const getCreateUpdateQuery = action => {

	const createUpdateQueryOpeningMap = {
		create: 'CREATE (playtext:Playtext { uuid: $uuid, name: $name, differentiator: $differentiator })',
		update: `
			MATCH (playtext:Playtext { uuid: $uuid })

			OPTIONAL MATCH (playtext)-[writerRel:WRITTEN_BY]->(:Person)

			DELETE writerRel

			WITH DISTINCT playtext

			OPTIONAL MATCH (playtext)-[characterRel:INCLUDES_CHARACTER]->(:Character)

			DELETE characterRel

			WITH DISTINCT playtext

			SET
				playtext.name = $name,
				playtext.differentiator = $differentiator
		`
	};

	return `
		${createUpdateQueryOpeningMap[action]}

		WITH playtext

		UNWIND (CASE $writerGroups WHEN [] THEN [{ writers: [] }] ELSE $writerGroups END) AS writerGroupParam

			UNWIND (CASE writerGroupParam.writers WHEN [] THEN [null] ELSE writerGroupParam.writers END) AS writerParam

				OPTIONAL MATCH (existingWriter:Person { name: writerParam.name })
					WHERE
						(writerParam.differentiator IS NULL AND existingWriter.differentiator IS NULL) OR
						(writerParam.differentiator = existingWriter.differentiator)

				WITH
					playtext,
					writerGroupParam,
					writerParam,
					CASE existingWriter WHEN NULL
						THEN {
							uuid: writerParam.uuid,
							name: writerParam.name,
							differentiator: writerParam.differentiator
						}
						ELSE existingWriter
					END AS writerProps

				FOREACH (item IN CASE writerParam WHEN NULL THEN [] ELSE [1] END |
					MERGE (writer:Person { uuid: writerProps.uuid, name: writerProps.name })
						ON CREATE SET writer.differentiator = writerProps.differentiator

					CREATE (playtext)-
						[:WRITTEN_BY {
							groupPosition: writerGroupParam.position,
							writerPosition: writerParam.position,
							group: writerGroupParam.name,
							isOriginalVersionWriter: writerGroupParam.isOriginalVersionWriter
						}]->(writer)
				)

		WITH DISTINCT playtext

		UNWIND (CASE $characterGroups WHEN [] THEN [{ characters: [] }] ELSE $characterGroups END) AS characterGroupParam

			UNWIND (CASE characterGroupParam.characters WHEN [] THEN [null] ELSE characterGroupParam.characters END) AS characterParam

				OPTIONAL MATCH (existingCharacter:Character {
					name: COALESCE(characterParam.underlyingName, characterParam.name)
				})
					WHERE
						(characterParam.differentiator IS NULL AND existingCharacter.differentiator IS NULL) OR
						(characterParam.differentiator = existingCharacter.differentiator)

				WITH
					playtext,
					characterGroupParam,
					characterParam,
					CASE existingCharacter WHEN NULL
						THEN {
							uuid: characterParam.uuid,
							name: COALESCE(characterParam.underlyingName, characterParam.name),
							differentiator: characterParam.differentiator
						}
						ELSE existingCharacter
					END AS characterProps

				FOREACH (item IN CASE characterParam WHEN NULL THEN [] ELSE [1] END |
					MERGE (character:Character { uuid: characterProps.uuid, name: characterProps.name })
						ON CREATE SET character.differentiator = characterProps.differentiator

					CREATE (playtext)-
						[:INCLUDES_CHARACTER {
							groupPosition: characterGroupParam.position,
							characterPosition: characterParam.position,
							displayName: CASE characterParam.underlyingName WHEN NULL THEN null ELSE characterParam.name END,
							qualifier: characterParam.qualifier,
							group: characterGroupParam.name
						}]->(character)
				)

		WITH DISTINCT playtext

		${getEditQuery()}
	`;

};

const getCreateQuery = () => getCreateUpdateQuery('create');

const getEditQuery = () => `
	MATCH (playtext:Playtext { uuid: $uuid })

	OPTIONAL MATCH (playtext)-[writerRel:WRITTEN_BY]->(writer:Person)

	WITH playtext, writerRel, writer
		ORDER BY writerRel.groupPosition, writerRel.writerPosition

	WITH playtext, writerRel.group AS writerGroupName, writerRel.isOriginalVersionWriter AS isOriginalVersionWriter,
		COLLECT(
			CASE writer WHEN NULL
				THEN null
				ELSE { model: 'person', name: writer.name, differentiator: writer.differentiator }
			END
		) + [{}] AS writers

	WITH playtext,
		COLLECT(
			CASE WHEN writerGroupName IS NULL AND SIZE(writers) = 1
				THEN null
				ELSE {
					model: 'writerGroup',
					name: writerGroupName,
					isOriginalVersionWriter: isOriginalVersionWriter,
					writers: writers
				}
			END
		) + [{ writers: [{}] }] AS writerGroups

	OPTIONAL MATCH (playtext)-[characterRel:INCLUDES_CHARACTER]->(character:Character)

	WITH playtext, writerGroups, characterRel, character
		ORDER BY characterRel.groupPosition, characterRel.characterPosition

	WITH playtext, writerGroups, characterRel.group AS characterGroupName,
		COLLECT(
			CASE character WHEN NULL
				THEN null
				ELSE {
					name: COALESCE(characterRel.displayName, character.name),
					underlyingName: CASE characterRel.displayName WHEN NULL THEN null ELSE character.name END,
					differentiator: character.differentiator,
					qualifier: characterRel.qualifier,
					group: characterRel.group
				}
			END
		) + [{}] AS characters

	RETURN
		'playtext' AS model,
		playtext.uuid AS uuid,
		playtext.name AS name,
		playtext.differentiator AS differentiator,
		writerGroups,
		COLLECT(
			CASE WHEN characterGroupName IS NULL AND SIZE(characters) = 1
				THEN null
				ELSE { model: 'characterGroup', name: characterGroupName, characters: characters }
			END
		) + [{ characters: [{}] }] AS characterGroups
`;

const getUpdateQuery = () => getCreateUpdateQuery('update');

const getShowQuery = () => `
	MATCH (playtext:Playtext { uuid: $uuid })

	OPTIONAL MATCH (playtext)-[writerRel:WRITTEN_BY]->(writer:Person)

	WITH playtext, writerRel, writer
		ORDER BY writerRel.groupPosition, writerRel.writerPosition

	WITH playtext, writerRel.group AS writerGroupName,
		COLLECT(
			CASE writer WHEN NULL
				THEN null
				ELSE { model: 'person', uuid: writer.uuid, name: writer.name }
			END
		) AS writers

	WITH playtext,
		COLLECT(
			CASE SIZE(writers) WHEN 0
				THEN null
				ELSE { model: 'writerGroup', name: COALESCE(writerGroupName, 'by'), writers: writers }
			END
		) AS writerGroups

	OPTIONAL MATCH (playtext)-[characterRel:INCLUDES_CHARACTER]->(character:Character)

	WITH playtext, writerGroups, characterRel, character
		ORDER BY characterRel.groupPosition, characterRel.characterPosition

	WITH
		playtext,
		writerGroups,
		characterRel.group AS characterGroupName,
		characterRel.groupPosition AS characterGroupPosition,
		COLLECT(
			CASE character WHEN NULL
				THEN null
				ELSE {
					model: 'character',
					uuid: character.uuid,
					name: COALESCE(characterRel.displayName, character.name),
					qualifier: characterRel.qualifier
				}
			END
		) AS characters

	WITH playtext, writerGroups,
		COLLECT(
			CASE SIZE(characters) WHEN 0
				THEN null
				ELSE {
					model: 'characterGroup',
					name: characterGroupName,
					position: characterGroupPosition,
					characters: characters
				}
			END
		) AS characterGroups

	OPTIONAL MATCH (playtext)<-[:PRODUCTION_OF]-(production:Production)

	OPTIONAL MATCH (production)-[:PLAYS_AT]->(theatre:Theatre)

	OPTIONAL MATCH (theatre)<-[:INCLUDES_SUB_THEATRE]-(surTheatre:Theatre)

	WITH playtext, writerGroups, characterGroups, production, theatre, surTheatre
		ORDER BY production.name, theatre.name

	RETURN
		'playtext' AS model,
		playtext.uuid AS uuid,
		playtext.name AS name,
		playtext.differentiator AS differentiator,
		writerGroups,
		characterGroups,
		COLLECT(
			CASE production WHEN NULL
				THEN null
				ELSE {
					model: 'production',
					uuid: production.uuid,
					name: production.name,
					theatre: CASE theatre WHEN NULL
						THEN null
						ELSE {
							model: 'theatre',
							uuid: theatre.uuid,
							name: theatre.name,
							surTheatre: CASE surTheatre WHEN NULL
								THEN null
								ELSE {
									model: 'theatre',
									uuid: surTheatre.uuid,
									name: surTheatre.name
								}
							END
						}
					END
				}
			END
		) AS productions
`;

const getListQuery = () => `
	MATCH (playtext:Playtext)

	OPTIONAL MATCH (playtext)-[writerRel:WRITTEN_BY]->(writer:Person)

	WITH playtext, writerRel, writer
		ORDER BY writerRel.groupPosition, writerRel.writerPosition

	WITH playtext, writerRel.group AS writerGroupName,
		COLLECT(
			CASE writer WHEN NULL
				THEN null
				ELSE { model: 'person', uuid: writer.uuid, name: writer.name }
			END
		) AS writers

	RETURN
		'playtext' AS model,
		playtext.uuid AS uuid,
		playtext.name AS name,
		COLLECT(
			CASE SIZE(writers) WHEN 0
				THEN null
				ELSE { model: 'writerGroup', name: COALESCE(writerGroupName, 'by'), writers: writers }
			END
		) AS writerGroups

	ORDER BY playtext.name

	LIMIT 100
`;

export {
	getCreateQuery,
	getEditQuery,
	getUpdateQuery,
	getShowQuery,
	getListQuery
};
