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

		UNWIND (CASE $writers WHEN [] THEN [null] ELSE $writers END) AS writerParam

			OPTIONAL MATCH (existingWriter:Person { name: writerParam.name })
				WHERE
					(writerParam.differentiator IS NULL AND existingWriter.differentiator IS NULL) OR
					(writerParam.differentiator = existingWriter.differentiator)

			WITH
				playtext,
				writerParam,
				CASE existingWriter WHEN NULL
					THEN {
						uuid: writerParam.uuid,
						name: writerParam.name,
						differentiator: writerParam.differentiator,
						group: writerParam.group
					}
					ELSE existingWriter
				END AS writerProps

			FOREACH (item IN CASE writerParam WHEN NULL THEN [] ELSE [1] END |
				MERGE (writer:Person { uuid: writerProps.uuid, name: writerProps.name })
					ON CREATE SET writer.differentiator = writerProps.differentiator

				CREATE (playtext)-[:WRITTEN_BY { position: writerParam.position, group: writerParam.group }]->(writer)
			)

		WITH DISTINCT playtext

		UNWIND (CASE $characters WHEN [] THEN [null] ELSE $characters END) AS characterParam

			OPTIONAL MATCH (existingCharacter:Character {
				name: COALESCE(characterParam.underlyingName, characterParam.name)
			})
				WHERE
					(characterParam.differentiator IS NULL AND existingCharacter.differentiator IS NULL) OR
					(characterParam.differentiator = existingCharacter.differentiator)

			WITH
				playtext,
				characterParam,
				CASE existingCharacter WHEN NULL
					THEN {
						uuid: characterParam.uuid,
						name: COALESCE(characterParam.underlyingName, characterParam.name),
						differentiator: characterParam.differentiator,
						qualifier: characterParam.qualifier,
						group: characterParam.group
					}
					ELSE existingCharacter
				END AS characterProps

			FOREACH (item IN CASE characterParam WHEN NULL THEN [] ELSE [1] END |
				MERGE (character:Character { uuid: characterProps.uuid, name: characterProps.name })
					ON CREATE SET character.differentiator = characterProps.differentiator

				CREATE (playtext)-
					[:INCLUDES_CHARACTER {
						position: characterParam.position,
						displayName: CASE characterParam.underlyingName WHEN NULL THEN null ELSE characterParam.name END,
						qualifier: characterParam.qualifier,
						group: characterParam.group
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
		ORDER BY writerRel.position

	WITH playtext,
		COLLECT(
			CASE writer WHEN NULL
				THEN null
				ELSE { name: writer.name, differentiator: writer.differentiator, group: writerRel.group }
			END
		) + [{}] AS writers

	OPTIONAL MATCH (playtext)-[characterRel:INCLUDES_CHARACTER]->(character:Character)

	WITH playtext, writers, characterRel, character
		ORDER BY characterRel.position

	RETURN
		'playtext' AS model,
		playtext.uuid AS uuid,
		playtext.name AS name,
		playtext.differentiator AS differentiator,
		writers,
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
`;

const getUpdateQuery = () => getCreateUpdateQuery('update');

const getShowQuery = () => `
	MATCH (playtext:Playtext { uuid: $uuid })

	OPTIONAL MATCH (playtext)-[writerRel:WRITTEN_BY]->(writer:Person)

	WITH playtext, writerRel, writer
		ORDER BY writerRel.position

	WITH playtext, writerRel.group AS writerGroup,
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
				ELSE { model: 'writerGroup', name: COALESCE(writerGroup, 'by'), writers: writers }
			END
		) AS writerGroups

	OPTIONAL MATCH (playtext)-[characterRel:INCLUDES_CHARACTER]->(character:Character)

	WITH playtext, writerGroups, characterRel, character
		ORDER BY characterRel.position

	WITH playtext, writerGroups, characterRel.group AS characterGroup,
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
					name: characterGroup,
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
		ORDER BY writerRel.position

	WITH playtext, writerRel.group AS writerGroup,
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
				ELSE { model: 'writerGroup', name: COALESCE(writerGroup, 'by'), writers: writers }
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
