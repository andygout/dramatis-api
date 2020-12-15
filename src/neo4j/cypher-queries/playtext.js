const getCreateUpdateQuery = action => {

	const createUpdateQueryOpeningMap = {
		create: 'CREATE (playtext:Playtext { uuid: $uuid, name: $name, differentiator: $differentiator })',
		update: `
			MATCH (playtext:Playtext { uuid: $uuid })

			OPTIONAL MATCH (playtext)-[originalVersionPlaytextRel:SUBSEQUENT_VERSION_OF]->(:Playtext)

			DELETE originalVersionPlaytextRel

			WITH DISTINCT playtext

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

		OPTIONAL MATCH (existingOriginalVersionPlaytext:Playtext { name: $originalVersionPlaytext.name })
			WHERE
				($originalVersionPlaytext.differentiator IS NULL AND existingOriginalVersionPlaytext.differentiator IS NULL) OR
				($originalVersionPlaytext.differentiator = existingOriginalVersionPlaytext.differentiator)

		WITH
			playtext,
			CASE existingOriginalVersionPlaytext WHEN NULL
				THEN {
					uuid: $originalVersionPlaytext.uuid,
					name: $originalVersionPlaytext.name,
					differentiator: $originalVersionPlaytext.differentiator
				}
				ELSE existingOriginalVersionPlaytext
			END AS originalVersionPlaytextProps

		FOREACH (item IN CASE $originalVersionPlaytext.name WHEN NULL THEN [] ELSE [1] END |
			MERGE (originalVersionPlaytext:Playtext {
				uuid: originalVersionPlaytextProps.uuid,
				name: originalVersionPlaytextProps.name
			})
				ON CREATE SET originalVersionPlaytext.differentiator = originalVersionPlaytextProps.differentiator

			CREATE (playtext)-[:SUBSEQUENT_VERSION_OF]->(originalVersionPlaytext)
		)

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

	OPTIONAL MATCH (playtext)-[:SUBSEQUENT_VERSION_OF]->(originalVersionPlaytext:Playtext)

	OPTIONAL MATCH (playtext)-[writerRel:WRITTEN_BY]->(writer:Person)

	WITH playtext, originalVersionPlaytext, writerRel, writer
		ORDER BY writerRel.groupPosition, writerRel.writerPosition

	WITH
		playtext,
		originalVersionPlaytext,
		writerRel.group AS writerGroupName,
		writerRel.isOriginalVersionWriter AS isOriginalVersionWriter,
		COLLECT(
			CASE writer WHEN NULL
				THEN null
				ELSE { model: 'person', name: writer.name, differentiator: writer.differentiator }
			END
		) + [{}] AS writers

	WITH playtext, originalVersionPlaytext,
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

	WITH playtext, originalVersionPlaytext, writerGroups, characterRel, character
		ORDER BY characterRel.groupPosition, characterRel.characterPosition

	WITH playtext, originalVersionPlaytext, writerGroups, characterRel.group AS characterGroupName,
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
		{
			name: CASE originalVersionPlaytext.name WHEN NULL THEN '' ELSE originalVersionPlaytext.name END,
			differentiator: CASE originalVersionPlaytext.differentiator WHEN NULL THEN '' ELSE originalVersionPlaytext.differentiator END
		} AS originalVersionPlaytext,
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

	OPTIONAL MATCH (playtext)-[:SUBSEQUENT_VERSION_OF]->(originalVersionPlaytext:Playtext)

	OPTIONAL MATCH (originalVersionPlaytext)-[originalVersionPlaytextWriterRel:WRITTEN_BY]->
		(originalVersionPlaytextWriter:Person)

	WITH
		playtext,
		originalVersionPlaytext,
		originalVersionPlaytextWriterRel,
		originalVersionPlaytextWriter
		ORDER BY originalVersionPlaytextWriterRel.groupPosition, originalVersionPlaytextWriterRel.writerPosition

	WITH
		playtext,
		originalVersionPlaytext,
		originalVersionPlaytextWriterRel.group AS originalVersionPlaytextWriterGroupName,
		COLLECT(
			CASE originalVersionPlaytextWriter WHEN NULL
				THEN null
				ELSE {
					model: 'person',
					uuid: originalVersionPlaytextWriter.uuid,
					name: originalVersionPlaytextWriter.name
				}
			END
		) AS originalVersionPlaytextWriters

	WITH
		playtext,
		originalVersionPlaytext,
		COLLECT(
			CASE SIZE(originalVersionPlaytextWriters) WHEN 0
				THEN null
				ELSE {
					model: 'writerGroup',
					name: COALESCE(originalVersionPlaytextWriterGroupName, 'by'),
					writers: originalVersionPlaytextWriters
				}
			END
		) AS originalVersionPlaytextWriterGroups

	WITH
		playtext,
		CASE originalVersionPlaytext WHEN NULL
			THEN null
			ELSE {
				model: 'playtext',
				uuid: originalVersionPlaytext.uuid,
				name: originalVersionPlaytext.name,
				writerGroups: originalVersionPlaytextWriterGroups
			}
		END AS originalVersionPlaytext

	OPTIONAL MATCH (playtext)<-[:SUBSEQUENT_VERSION_OF]-(subsequentVersionPlaytext:Playtext)

	OPTIONAL MATCH (subsequentVersionPlaytext)-[subsequentVersionPlaytextWriterRel:WRITTEN_BY]->
		(subsequentVersionPlaytextWriter:Person)
		WHERE subsequentVersionPlaytextWriterRel.isOriginalVersionWriter IS NULL

	WITH
		playtext,
		originalVersionPlaytext,
		subsequentVersionPlaytext,
		subsequentVersionPlaytextWriterRel,
		subsequentVersionPlaytextWriter
		ORDER BY subsequentVersionPlaytextWriterRel.groupPosition, subsequentVersionPlaytextWriterRel.writerPosition

	WITH
		playtext,
		originalVersionPlaytext,
		subsequentVersionPlaytext,
		subsequentVersionPlaytextWriterRel.group AS subsequentVersionPlaytextWriterGroupName,
		COLLECT(
			CASE subsequentVersionPlaytextWriter WHEN NULL
				THEN null
				ELSE {
					model: 'person',
					uuid: subsequentVersionPlaytextWriter.uuid,
					name: subsequentVersionPlaytextWriter.name
				}
			END
		) AS subsequentVersionPlaytextWriters

	WITH
		playtext,
		originalVersionPlaytext,
		subsequentVersionPlaytext,
		COLLECT(
			CASE SIZE(subsequentVersionPlaytextWriters) WHEN 0
				THEN null
				ELSE {
					model: 'writerGroup',
					name: COALESCE(subsequentVersionPlaytextWriterGroupName, 'by'),
					writers: subsequentVersionPlaytextWriters
				}
			END
		) AS subsequentVersionPlaytextWriterGroups

	WITH
		playtext,
		originalVersionPlaytext,
		COLLECT(
			CASE subsequentVersionPlaytext WHEN NULL
				THEN null
				ELSE {
					model: 'playtext',
					uuid: subsequentVersionPlaytext.uuid,
					name: subsequentVersionPlaytext.name,
					writerGroups: subsequentVersionPlaytextWriterGroups
				}
			END
		) AS subsequentVersionPlaytexts

	OPTIONAL MATCH (playtext)-[writerRel:WRITTEN_BY]->(writer:Person)

	WITH playtext, originalVersionPlaytext, subsequentVersionPlaytexts, writerRel, writer
		ORDER BY writerRel.groupPosition, writerRel.writerPosition

	WITH playtext, originalVersionPlaytext, subsequentVersionPlaytexts, writerRel.group AS writerGroupName,
		COLLECT(
			CASE writer WHEN NULL
				THEN null
				ELSE { model: 'person', uuid: writer.uuid, name: writer.name }
			END
		) AS writers

	WITH playtext, originalVersionPlaytext, subsequentVersionPlaytexts,
		COLLECT(
			CASE SIZE(writers) WHEN 0
				THEN null
				ELSE { model: 'writerGroup', name: COALESCE(writerGroupName, 'by'), writers: writers }
			END
		) AS writerGroups

	OPTIONAL MATCH (playtext)-[characterRel:INCLUDES_CHARACTER]->(character:Character)

	WITH playtext, originalVersionPlaytext, subsequentVersionPlaytexts, writerGroups, characterRel, character
		ORDER BY characterRel.groupPosition, characterRel.characterPosition

	WITH
		playtext,
		originalVersionPlaytext,
		subsequentVersionPlaytexts,
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

	WITH playtext, originalVersionPlaytext, subsequentVersionPlaytexts, writerGroups,
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

	WITH
		playtext,
		originalVersionPlaytext,
		subsequentVersionPlaytexts,
		writerGroups,
		characterGroups,
		production,
		theatre,
		surTheatre
		ORDER BY production.name, theatre.name

	RETURN
		'playtext' AS model,
		playtext.uuid AS uuid,
		playtext.name AS name,
		playtext.differentiator AS differentiator,
		originalVersionPlaytext,
		subsequentVersionPlaytexts,
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

	WITH playtext, writerGroupName, writers
		ORDER BY playtext.name, playtext.differentiator

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

	LIMIT 100
`;

export {
	getCreateQuery,
	getEditQuery,
	getUpdateQuery,
	getShowQuery,
	getListQuery
};
