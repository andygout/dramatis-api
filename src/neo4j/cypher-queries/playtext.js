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

			OPTIONAL MATCH (playtext)-[sourceMaterialRel:USES_SOURCE_MATERIAL]->(:Playtext)

			DELETE sourceMaterialRel

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

				OPTIONAL MATCH (existingWriter { name: writerParam.name })
					WHERE
						(existingWriter:Person OR existingWriter:Playtext) AND
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

				FOREACH (item IN CASE WHEN writerParam IS NOT NULL AND writerParam.model = 'person' THEN [1] ELSE [] END |
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

				FOREACH (item IN CASE WHEN writerParam IS NOT NULL AND writerParam.model = 'playtext' THEN [1] ELSE [] END |
					MERGE (sourceMaterial:Playtext { uuid: writerProps.uuid, name: writerProps.name })
						ON CREATE SET sourceMaterial.differentiator = writerProps.differentiator

					CREATE (playtext)-
						[:USES_SOURCE_MATERIAL {
							groupPosition: writerGroupParam.position,
							writerPosition: writerParam.position,
							group: writerGroupParam.name
						}]->(sourceMaterial)
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

	OPTIONAL MATCH (playtext)-[writerRel:WRITTEN_BY|USES_SOURCE_MATERIAL]->(writer)
		WHERE writer:Person OR writer:Playtext

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
				ELSE { model: TOLOWER(HEAD(LABELS(writer))), name: writer.name, differentiator: writer.differentiator }
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

	OPTIONAL MATCH (playtext)<-[:USES_SOURCE_MATERIAL]-(sourcingPlaytext:Playtext)

	OPTIONAL MATCH (sourcingPlaytext)-[sourcingPlaytextWriterRel:WRITTEN_BY|USES_SOURCE_MATERIAL]->
		(sourcingPlaytextWriter)
		WHERE sourcingPlaytextWriter:Person OR sourcingPlaytextWriter:Playtext

	WITH
		playtext,
		originalVersionPlaytext,
		subsequentVersionPlaytexts,
		sourcingPlaytext,
		sourcingPlaytextWriterRel,
		sourcingPlaytextWriter
		ORDER BY sourcingPlaytextWriterRel.groupPosition, sourcingPlaytextWriterRel.writerPosition

	WITH
		playtext,
		originalVersionPlaytext,
		subsequentVersionPlaytexts,
		sourcingPlaytext,
		sourcingPlaytextWriterRel.group AS sourcingPlaytextWriterGroupName,
		COLLECT(
			CASE sourcingPlaytextWriter WHEN NULL
				THEN null
				ELSE {
					model: TOLOWER(HEAD(LABELS(sourcingPlaytextWriter))),
					uuid: CASE WHEN sourcingPlaytextWriter.uuid = playtext.uuid THEN null ELSE sourcingPlaytextWriter.uuid END,
					name: sourcingPlaytextWriter.name
				}
			END
		) AS sourcingPlaytextWriters

	WITH
		playtext,
		originalVersionPlaytext,
		subsequentVersionPlaytexts,
		sourcingPlaytext,
		COLLECT(
			CASE SIZE(sourcingPlaytextWriters) WHEN 0
				THEN null
				ELSE {
					model: 'writerGroup',
					name: COALESCE(sourcingPlaytextWriterGroupName, 'by'),
					writers: sourcingPlaytextWriters
				}
			END
		) AS sourcingPlaytextWriterGroups

	WITH
		playtext,
		originalVersionPlaytext,
		subsequentVersionPlaytexts,
		COLLECT(
			CASE sourcingPlaytext WHEN NULL
				THEN null
				ELSE {
					model: 'playtext',
					uuid: sourcingPlaytext.uuid,
					name: sourcingPlaytext.name,
					writerGroups: sourcingPlaytextWriterGroups
				}
			END
		) AS sourcingPlaytexts

	OPTIONAL MATCH (playtext)-[writerRel:WRITTEN_BY|USES_SOURCE_MATERIAL]->(writer)
		WHERE writer:Person OR writer:Playtext

	OPTIONAL MATCH (writer:Playtext)-[sourceMaterialWriterRel:WRITTEN_BY]->(sourceMaterialWriter)

	WITH
		playtext,
		originalVersionPlaytext,
		subsequentVersionPlaytexts,
		sourcingPlaytexts,
		writerRel,
		writer,
		sourceMaterialWriterRel,
		sourceMaterialWriter
		ORDER BY sourceMaterialWriterRel.groupPosition, sourceMaterialWriter.writerPosition

	WITH
		playtext,
		originalVersionPlaytext,
		subsequentVersionPlaytexts,
		sourcingPlaytexts,
		writerRel,
		writer,
		sourceMaterialWriterRel.group AS sourceMaterialWriterGroupName,
		COLLECT(
			CASE sourceMaterialWriter WHEN NULL
				THEN null
				ELSE { model: 'person', uuid: sourceMaterialWriter.uuid, name: sourceMaterialWriter.name }
			END
		) AS sourceMaterialWriters

	WITH playtext, originalVersionPlaytext, subsequentVersionPlaytexts, sourcingPlaytexts, writerRel, writer,
		COLLECT(
			CASE SIZE(sourceMaterialWriters) WHEN 0
				THEN null
				ELSE {
					model: 'writerGroup',
					name: COALESCE(sourceMaterialWriterGroupName, 'by'),
					writers: sourceMaterialWriters
				}
			END
		) AS sourceMaterialWriterGroups
		ORDER BY writerRel.groupPosition, writerRel.writerPosition

	WITH
		playtext,
		originalVersionPlaytext,
		subsequentVersionPlaytexts,
		sourcingPlaytexts,
		writerRel.group AS writerGroupName,
		COLLECT(
			CASE writer WHEN NULL
				THEN null
				ELSE {
					model: TOLOWER(HEAD(LABELS(writer))),
					uuid: writer.uuid,
					name: writer.name,
					sourceMaterialWriterGroups: sourceMaterialWriterGroups
				}
			END
		) AS writers

	WITH playtext, originalVersionPlaytext, subsequentVersionPlaytexts, sourcingPlaytexts,
		COLLECT(
			CASE SIZE(writers) WHEN 0
				THEN null
				ELSE { model: 'writerGroup', name: COALESCE(writerGroupName, 'by'), writers: writers }
			END
		) AS writerGroups

	OPTIONAL MATCH (playtext)-[characterRel:INCLUDES_CHARACTER]->(character:Character)

	WITH
		playtext,
		originalVersionPlaytext,
		subsequentVersionPlaytexts,
		sourcingPlaytexts,
		writerGroups,
		characterRel,
		character
		ORDER BY characterRel.groupPosition, characterRel.characterPosition

	WITH
		playtext,
		originalVersionPlaytext,
		subsequentVersionPlaytexts,
		sourcingPlaytexts,
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

	WITH playtext, originalVersionPlaytext, subsequentVersionPlaytexts, sourcingPlaytexts, writerGroups,
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
		sourcingPlaytexts,
		writerGroups,
		characterGroups,
		production,
		theatre,
		surTheatre
		ORDER BY production.name, theatre.name

	WITH
		playtext,
		originalVersionPlaytext,
		subsequentVersionPlaytexts,
		sourcingPlaytexts,
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

	OPTIONAL MATCH (playtext)<-[:USES_SOURCE_MATERIAL]-(:Playtext)
		<-[:PRODUCTION_OF]-(sourcingPlaytextProduction:Production)

	OPTIONAL MATCH (sourcingPlaytextProduction)-[:PLAYS_AT]->(sourcingPlaytextProductionTheatre:Theatre)

	OPTIONAL MATCH (sourcingPlaytextProductionTheatre)
		<-[:INCLUDES_SUB_THEATRE]-(sourcingPlaytextProductionSurTheatre:Theatre)

	WITH
		playtext,
		originalVersionPlaytext,
		subsequentVersionPlaytexts,
		sourcingPlaytexts,
		writerGroups,
		characterGroups,
		productions,
		sourcingPlaytextProduction,
		sourcingPlaytextProductionTheatre,
		sourcingPlaytextProductionSurTheatre
		ORDER BY sourcingPlaytextProduction.name, sourcingPlaytextProductionTheatre.name

	RETURN
		'playtext' AS model,
		playtext.uuid AS uuid,
		playtext.name AS name,
		playtext.differentiator AS differentiator,
		originalVersionPlaytext,
		subsequentVersionPlaytexts,
		sourcingPlaytexts,
		writerGroups,
		characterGroups,
		productions,
		COLLECT(
			CASE sourcingPlaytextProduction WHEN NULL
				THEN null
				ELSE {
					model: 'production',
					uuid: sourcingPlaytextProduction.uuid,
					name: sourcingPlaytextProduction.name,
					theatre: CASE sourcingPlaytextProductionTheatre WHEN NULL
						THEN null
						ELSE {
							model: 'theatre',
							uuid: sourcingPlaytextProductionTheatre.uuid,
							name: sourcingPlaytextProductionTheatre.name,
							surTheatre: CASE sourcingPlaytextProductionSurTheatre WHEN NULL
								THEN null
								ELSE {
									model: 'theatre',
									uuid: sourcingPlaytextProductionSurTheatre.uuid,
									name: sourcingPlaytextProductionSurTheatre.name
								}
							END
						}
					END
				}
			END
		) AS sourcingPlaytextProductions
	`;

const getListQuery = () => `
	MATCH (playtext:Playtext)

	OPTIONAL MATCH (playtext)-[writerRel:WRITTEN_BY|USES_SOURCE_MATERIAL]->(writer)
		WHERE writer:Person OR writer:Playtext

	OPTIONAL MATCH (writer:Playtext)-[sourceMaterialWriterRel:WRITTEN_BY]->(sourceMaterialWriter)

	WITH playtext, writerRel, writer, sourceMaterialWriterRel, sourceMaterialWriter
		ORDER BY sourceMaterialWriterRel.groupPosition, sourceMaterialWriter.writerPosition

	WITH playtext, writerRel, writer, sourceMaterialWriterRel.group AS sourceMaterialWriterGroupName,
		COLLECT(
			CASE sourceMaterialWriter WHEN NULL
				THEN null
				ELSE { model: 'person', uuid: sourceMaterialWriter.uuid, name: sourceMaterialWriter.name }
			END
		) AS sourceMaterialWriters

	WITH playtext, writerRel, writer,
		COLLECT(
			CASE SIZE(sourceMaterialWriters) WHEN 0
				THEN null
				ELSE {
					model: 'writerGroup',
					name: COALESCE(sourceMaterialWriterGroupName, 'by'),
					writers: sourceMaterialWriters
				}
			END
		) AS sourceMaterialWriterGroups
		ORDER BY writerRel.groupPosition, writerRel.writerPosition

	WITH playtext, writerRel.group AS writerGroupName,
		COLLECT(
			CASE writer WHEN NULL
				THEN null
				ELSE {
					model: TOLOWER(HEAD(LABELS(writer))),
					uuid: writer.uuid,
					name: writer.name,
					sourceMaterialWriterGroups: sourceMaterialWriterGroups
				}
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
