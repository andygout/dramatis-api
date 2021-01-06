const getCreateUpdateQuery = action => {

	const createUpdateQueryOpeningMap = {
		create: `
			CREATE (material:Material { uuid: $uuid, name: $name, differentiator: $differentiator, format: $format })
		`,
		update: `
			MATCH (material:Material { uuid: $uuid })

			OPTIONAL MATCH (material)-[originalVersionMaterialRel:SUBSEQUENT_VERSION_OF]->(:Material)

			DELETE originalVersionMaterialRel

			WITH DISTINCT material

			OPTIONAL MATCH (material)-[writerRel:WRITTEN_BY]->(:Person)

			DELETE writerRel

			WITH DISTINCT material

			OPTIONAL MATCH (material)-[sourceMaterialRel:USES_SOURCE_MATERIAL]->(:Material)

			DELETE sourceMaterialRel

			WITH DISTINCT material

			OPTIONAL MATCH (material)-[characterRel:INCLUDES_CHARACTER]->(:Character)

			DELETE characterRel

			WITH DISTINCT material

			SET
				material.name = $name,
				material.differentiator = $differentiator,
				material.format = $format
		`
	};

	return `
		${createUpdateQueryOpeningMap[action]}

		WITH material

		OPTIONAL MATCH (existingOriginalVersionMaterial:Material { name: $originalVersionMaterial.name })
			WHERE
				($originalVersionMaterial.differentiator IS NULL AND existingOriginalVersionMaterial.differentiator IS NULL) OR
				($originalVersionMaterial.differentiator = existingOriginalVersionMaterial.differentiator)

		FOREACH (item IN CASE $originalVersionMaterial.name WHEN NULL THEN [] ELSE [1] END |
			MERGE (originalVersionMaterial:Material {
				uuid: COALESCE(existingOriginalVersionMaterial.uuid, $originalVersionMaterial.uuid),
				name: $originalVersionMaterial.name
			})
				ON CREATE SET originalVersionMaterial.differentiator = $originalVersionMaterial.differentiator

			CREATE (material)-[:SUBSEQUENT_VERSION_OF]->(originalVersionMaterial)
		)

		WITH material

		UNWIND (CASE $writerGroups WHEN [] THEN [{ writers: [] }] ELSE $writerGroups END) AS writerGroup

			UNWIND
				CASE SIZE([writer IN writerGroup.writers WHERE writer.model = 'person']) WHEN 0
					THEN [null]
					ELSE [writer IN writerGroup.writers WHERE writer.model = 'person']
				END AS writerParam

				OPTIONAL MATCH (existingWriter:Person { name: writerParam.name })
					WHERE
						(writerParam.differentiator IS NULL AND existingWriter.differentiator IS NULL) OR
						(writerParam.differentiator = existingWriter.differentiator)

				FOREACH (item IN CASE WHEN writerParam IS NOT NULL AND writerParam.model = 'person' THEN [1] ELSE [] END |
					MERGE (writer:Person {
						uuid: COALESCE(existingWriter.uuid, writerParam.uuid),
						name: writerParam.name
					})
						ON CREATE SET writer.differentiator = writerParam.differentiator

					CREATE (material)-
						[:WRITTEN_BY {
							groupPosition: writerGroup.position,
							writerPosition: writerParam.position,
							group: writerGroup.name,
							isOriginalVersionWriter: writerGroup.isOriginalVersionWriter
						}]->(writer)
				)

			WITH DISTINCT material, writerGroup

			UNWIND
				CASE SIZE([writer IN writerGroup.writers WHERE writer.model = 'material']) WHEN 0
					THEN [null]
					ELSE [writer IN writerGroup.writers WHERE writer.model = 'material']
				END AS sourceMaterialParam

				OPTIONAL MATCH (existingSourceMaterial:Material { name: sourceMaterialParam.name })
					WHERE
						(sourceMaterialParam.differentiator IS NULL AND existingSourceMaterial.differentiator IS NULL) OR
						(sourceMaterialParam.differentiator = existingSourceMaterial.differentiator)

				FOREACH (item IN CASE WHEN sourceMaterialParam IS NOT NULL AND sourceMaterialParam.model = 'material' THEN [1] ELSE [] END |
					MERGE (sourceMaterial:Material {
						uuid: COALESCE(existingSourceMaterial.uuid, sourceMaterialParam.uuid),
						name: sourceMaterialParam.name
					})
						ON CREATE SET sourceMaterial.differentiator = sourceMaterialParam.differentiator

					CREATE (material)-
						[:USES_SOURCE_MATERIAL {
							groupPosition: writerGroup.position,
							writerPosition: sourceMaterialParam.position,
							group: writerGroup.name
						}]->(sourceMaterial)
				)

		WITH DISTINCT material

		UNWIND (CASE $characterGroups WHEN [] THEN [{ characters: [] }] ELSE $characterGroups END) AS characterGroup

			UNWIND (CASE characterGroup.characters WHEN [] THEN [null] ELSE characterGroup.characters END) AS characterParam

				OPTIONAL MATCH (existingCharacter:Character {
					name: COALESCE(characterParam.underlyingName, characterParam.name)
				})
					WHERE
						(characterParam.differentiator IS NULL AND existingCharacter.differentiator IS NULL) OR
						(characterParam.differentiator = existingCharacter.differentiator)

				FOREACH (item IN CASE characterParam WHEN NULL THEN [] ELSE [1] END |
					MERGE (character:Character {
						uuid: COALESCE(existingCharacter.uuid, characterParam.uuid),
						name: COALESCE(characterParam.underlyingName, characterParam.name)
					})
						ON CREATE SET character.differentiator = characterParam.differentiator

					CREATE (material)-
						[:INCLUDES_CHARACTER {
							groupPosition: characterGroup.position,
							characterPosition: characterParam.position,
							displayName: CASE characterParam.underlyingName WHEN NULL THEN null ELSE characterParam.name END,
							qualifier: characterParam.qualifier,
							group: characterGroup.name
						}]->(character)
				)

		WITH DISTINCT material

		${getEditQuery()}
	`;

};

const getCreateQuery = () => getCreateUpdateQuery('create');

const getEditQuery = () => `
	MATCH (material:Material { uuid: $uuid })

	OPTIONAL MATCH (material)-[:SUBSEQUENT_VERSION_OF]->(originalVersionMaterial:Material)

	OPTIONAL MATCH (material)-[writerRel:WRITTEN_BY|USES_SOURCE_MATERIAL]->(writer)
		WHERE writer:Person OR writer:Material

	WITH material, originalVersionMaterial, writerRel, writer
		ORDER BY writerRel.groupPosition, writerRel.writerPosition

	WITH
		material,
		originalVersionMaterial,
		writerRel.group AS writerGroupName,
		writerRel.isOriginalVersionWriter AS isOriginalVersionWriter,
		COLLECT(
			CASE writer WHEN NULL
				THEN null
				ELSE { model: TOLOWER(HEAD(LABELS(writer))), name: writer.name, differentiator: writer.differentiator }
			END
		) + [{}] AS writers

	WITH material, originalVersionMaterial,
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

	OPTIONAL MATCH (material)-[characterRel:INCLUDES_CHARACTER]->(character:Character)

	WITH material, originalVersionMaterial, writerGroups, characterRel, character
		ORDER BY characterRel.groupPosition, characterRel.characterPosition

	WITH material, originalVersionMaterial, writerGroups, characterRel.group AS characterGroupName,
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
		'material' AS model,
		material.uuid AS uuid,
		material.name AS name,
		material.differentiator AS differentiator,
		material.format AS format,
		{
			name: CASE originalVersionMaterial.name WHEN NULL THEN '' ELSE originalVersionMaterial.name END,
			differentiator: CASE originalVersionMaterial.differentiator WHEN NULL THEN '' ELSE originalVersionMaterial.differentiator END
		} AS originalVersionMaterial,
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
	MATCH (material:Material { uuid: $uuid })

	OPTIONAL MATCH (material)-[:SUBSEQUENT_VERSION_OF]->(originalVersionMaterial:Material)

	OPTIONAL MATCH (originalVersionMaterial)-[originalVersionMaterialWriterRel:WRITTEN_BY]->
		(originalVersionMaterialWriter:Person)

	WITH
		material,
		originalVersionMaterial,
		originalVersionMaterialWriterRel,
		originalVersionMaterialWriter
		ORDER BY originalVersionMaterialWriterRel.groupPosition, originalVersionMaterialWriterRel.writerPosition

	WITH
		material,
		originalVersionMaterial,
		originalVersionMaterialWriterRel.group AS originalVersionMaterialWriterGroupName,
		COLLECT(
			CASE originalVersionMaterialWriter WHEN NULL
				THEN null
				ELSE {
					model: 'person',
					uuid: originalVersionMaterialWriter.uuid,
					name: originalVersionMaterialWriter.name
				}
			END
		) AS originalVersionMaterialWriters

	WITH
		material,
		originalVersionMaterial,
		COLLECT(
			CASE SIZE(originalVersionMaterialWriters) WHEN 0
				THEN null
				ELSE {
					model: 'writerGroup',
					name: COALESCE(originalVersionMaterialWriterGroupName, 'by'),
					writers: originalVersionMaterialWriters
				}
			END
		) AS originalVersionMaterialWriterGroups

	WITH
		material,
		CASE originalVersionMaterial WHEN NULL
			THEN null
			ELSE {
				model: 'material',
				uuid: originalVersionMaterial.uuid,
				name: originalVersionMaterial.name,
				format: originalVersionMaterial.format,
				writerGroups: originalVersionMaterialWriterGroups
			}
		END AS originalVersionMaterial

	OPTIONAL MATCH (material)<-[:SUBSEQUENT_VERSION_OF]-(subsequentVersionMaterial:Material)

	OPTIONAL MATCH (subsequentVersionMaterial)-[subsequentVersionMaterialWriterRel:WRITTEN_BY]->
		(subsequentVersionMaterialWriter:Person)
		WHERE subsequentVersionMaterialWriterRel.isOriginalVersionWriter IS NULL

	WITH
		material,
		originalVersionMaterial,
		subsequentVersionMaterial,
		subsequentVersionMaterialWriterRel,
		subsequentVersionMaterialWriter
		ORDER BY subsequentVersionMaterialWriterRel.groupPosition, subsequentVersionMaterialWriterRel.writerPosition

	WITH
		material,
		originalVersionMaterial,
		subsequentVersionMaterial,
		subsequentVersionMaterialWriterRel.group AS subsequentVersionMaterialWriterGroupName,
		COLLECT(
			CASE subsequentVersionMaterialWriter WHEN NULL
				THEN null
				ELSE {
					model: 'person',
					uuid: subsequentVersionMaterialWriter.uuid,
					name: subsequentVersionMaterialWriter.name
				}
			END
		) AS subsequentVersionMaterialWriters

	WITH
		material,
		originalVersionMaterial,
		subsequentVersionMaterial,
		COLLECT(
			CASE SIZE(subsequentVersionMaterialWriters) WHEN 0
				THEN null
				ELSE {
					model: 'writerGroup',
					name: COALESCE(subsequentVersionMaterialWriterGroupName, 'by'),
					writers: subsequentVersionMaterialWriters
				}
			END
		) AS subsequentVersionMaterialWriterGroups

	WITH
		material,
		originalVersionMaterial,
		COLLECT(
			CASE subsequentVersionMaterial WHEN NULL
				THEN null
				ELSE {
					model: 'material',
					uuid: subsequentVersionMaterial.uuid,
					name: subsequentVersionMaterial.name,
					format: subsequentVersionMaterial.format,
					writerGroups: subsequentVersionMaterialWriterGroups
				}
			END
		) AS subsequentVersionMaterials

	OPTIONAL MATCH (material)<-[:USES_SOURCE_MATERIAL]-(sourcingMaterial:Material)

	OPTIONAL MATCH (sourcingMaterial)-[sourcingMaterialWriterRel:WRITTEN_BY|USES_SOURCE_MATERIAL]->
		(sourcingMaterialWriter)
		WHERE sourcingMaterialWriter:Person OR sourcingMaterialWriter:Material

	WITH
		material,
		originalVersionMaterial,
		subsequentVersionMaterials,
		sourcingMaterial,
		sourcingMaterialWriterRel,
		sourcingMaterialWriter
		ORDER BY sourcingMaterialWriterRel.groupPosition, sourcingMaterialWriterRel.writerPosition

	WITH
		material,
		originalVersionMaterial,
		subsequentVersionMaterials,
		sourcingMaterial,
		sourcingMaterialWriterRel.group AS sourcingMaterialWriterGroupName,
		COLLECT(
			CASE sourcingMaterialWriter WHEN NULL
				THEN null
				ELSE {
					model: TOLOWER(HEAD(LABELS(sourcingMaterialWriter))),
					uuid: CASE WHEN sourcingMaterialWriter.uuid = material.uuid THEN null ELSE sourcingMaterialWriter.uuid END,
					name: sourcingMaterialWriter.name,
					format: sourcingMaterialWriter.format
				}
			END
		) AS sourcingMaterialWriters

	WITH
		material,
		originalVersionMaterial,
		subsequentVersionMaterials,
		sourcingMaterial,
		COLLECT(
			CASE SIZE(sourcingMaterialWriters) WHEN 0
				THEN null
				ELSE {
					model: 'writerGroup',
					name: COALESCE(sourcingMaterialWriterGroupName, 'by'),
					writers: sourcingMaterialWriters
				}
			END
		) AS sourcingMaterialWriterGroups

	WITH
		material,
		originalVersionMaterial,
		subsequentVersionMaterials,
		COLLECT(
			CASE sourcingMaterial WHEN NULL
				THEN null
				ELSE {
					model: 'material',
					uuid: sourcingMaterial.uuid,
					name: sourcingMaterial.name,
					format: sourcingMaterial.format,
					writerGroups: sourcingMaterialWriterGroups
				}
			END
		) AS sourcingMaterials

	OPTIONAL MATCH (material)-[writerRel:WRITTEN_BY|USES_SOURCE_MATERIAL]->(writer)
		WHERE writer:Person OR writer:Material

	OPTIONAL MATCH (writer:Material)-[sourceMaterialWriterRel:WRITTEN_BY]->(sourceMaterialWriter)

	WITH
		material,
		originalVersionMaterial,
		subsequentVersionMaterials,
		sourcingMaterials,
		writerRel,
		writer,
		sourceMaterialWriterRel,
		sourceMaterialWriter
		ORDER BY sourceMaterialWriterRel.groupPosition, sourceMaterialWriter.writerPosition

	WITH
		material,
		originalVersionMaterial,
		subsequentVersionMaterials,
		sourcingMaterials,
		writerRel,
		writer,
		sourceMaterialWriterRel.group AS sourceMaterialWriterGroupName,
		COLLECT(
			CASE sourceMaterialWriter WHEN NULL
				THEN null
				ELSE { model: 'person', uuid: sourceMaterialWriter.uuid, name: sourceMaterialWriter.name }
			END
		) AS sourceMaterialWriters

	WITH material, originalVersionMaterial, subsequentVersionMaterials, sourcingMaterials, writerRel, writer,
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
		material,
		originalVersionMaterial,
		subsequentVersionMaterials,
		sourcingMaterials,
		writerRel.group AS writerGroupName,
		COLLECT(
			CASE writer WHEN NULL
				THEN null
				ELSE {
					model: TOLOWER(HEAD(LABELS(writer))),
					uuid: writer.uuid,
					name: writer.name,
					format: writer.format,
					sourceMaterialWriterGroups: sourceMaterialWriterGroups
				}
			END
		) AS writers

	WITH material, originalVersionMaterial, subsequentVersionMaterials, sourcingMaterials,
		COLLECT(
			CASE SIZE(writers) WHEN 0
				THEN null
				ELSE { model: 'writerGroup', name: COALESCE(writerGroupName, 'by'), writers: writers }
			END
		) AS writerGroups

	OPTIONAL MATCH (material)-[characterRel:INCLUDES_CHARACTER]->(character:Character)

	WITH
		material,
		originalVersionMaterial,
		subsequentVersionMaterials,
		sourcingMaterials,
		writerGroups,
		characterRel,
		character
		ORDER BY characterRel.groupPosition, characterRel.characterPosition

	WITH
		material,
		originalVersionMaterial,
		subsequentVersionMaterials,
		sourcingMaterials,
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

	WITH material, originalVersionMaterial, subsequentVersionMaterials, sourcingMaterials, writerGroups,
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

	OPTIONAL MATCH (material)<-[:PRODUCTION_OF]-(production:Production)

	OPTIONAL MATCH (production)-[:PLAYS_AT]->(theatre:Theatre)

	OPTIONAL MATCH (theatre)<-[:INCLUDES_SUB_THEATRE]-(surTheatre:Theatre)

	WITH
		material,
		originalVersionMaterial,
		subsequentVersionMaterials,
		sourcingMaterials,
		writerGroups,
		characterGroups,
		production,
		theatre,
		surTheatre
		ORDER BY production.name, theatre.name

	WITH
		material,
		originalVersionMaterial,
		subsequentVersionMaterials,
		sourcingMaterials,
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

	OPTIONAL MATCH (material)<-[:USES_SOURCE_MATERIAL]-(:Material)
		<-[:PRODUCTION_OF]-(sourcingMaterialProduction:Production)

	OPTIONAL MATCH (sourcingMaterialProduction)-[:PLAYS_AT]->(sourcingMaterialProductionTheatre:Theatre)

	OPTIONAL MATCH (sourcingMaterialProductionTheatre)
		<-[:INCLUDES_SUB_THEATRE]-(sourcingMaterialProductionSurTheatre:Theatre)

	WITH
		material,
		originalVersionMaterial,
		subsequentVersionMaterials,
		sourcingMaterials,
		writerGroups,
		characterGroups,
		productions,
		sourcingMaterialProduction,
		sourcingMaterialProductionTheatre,
		sourcingMaterialProductionSurTheatre
		ORDER BY sourcingMaterialProduction.name, sourcingMaterialProductionTheatre.name

	RETURN
		'material' AS model,
		material.uuid AS uuid,
		material.name AS name,
		material.differentiator AS differentiator,
		material.format AS format,
		originalVersionMaterial,
		subsequentVersionMaterials,
		sourcingMaterials,
		writerGroups,
		characterGroups,
		productions,
		COLLECT(
			CASE sourcingMaterialProduction WHEN NULL
				THEN null
				ELSE {
					model: 'production',
					uuid: sourcingMaterialProduction.uuid,
					name: sourcingMaterialProduction.name,
					theatre: CASE sourcingMaterialProductionTheatre WHEN NULL
						THEN null
						ELSE {
							model: 'theatre',
							uuid: sourcingMaterialProductionTheatre.uuid,
							name: sourcingMaterialProductionTheatre.name,
							surTheatre: CASE sourcingMaterialProductionSurTheatre WHEN NULL
								THEN null
								ELSE {
									model: 'theatre',
									uuid: sourcingMaterialProductionSurTheatre.uuid,
									name: sourcingMaterialProductionSurTheatre.name
								}
							END
						}
					END
				}
			END
		) AS sourcingMaterialProductions
	`;

const getListQuery = () => `
	MATCH (material:Material)

	OPTIONAL MATCH (material)-[writerRel:WRITTEN_BY|USES_SOURCE_MATERIAL]->(writer)
		WHERE writer:Person OR writer:Material

	OPTIONAL MATCH (writer:Material)-[sourceMaterialWriterRel:WRITTEN_BY]->(sourceMaterialWriter)

	WITH material, writerRel, writer, sourceMaterialWriterRel, sourceMaterialWriter
		ORDER BY sourceMaterialWriterRel.groupPosition, sourceMaterialWriter.writerPosition

	WITH material, writerRel, writer, sourceMaterialWriterRel.group AS sourceMaterialWriterGroupName,
		COLLECT(
			CASE sourceMaterialWriter WHEN NULL
				THEN null
				ELSE { model: 'person', uuid: sourceMaterialWriter.uuid, name: sourceMaterialWriter.name }
			END
		) AS sourceMaterialWriters

	WITH material, writerRel, writer,
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

	WITH material, writerRel.group AS writerGroupName,
		COLLECT(
			CASE writer WHEN NULL
				THEN null
				ELSE {
					model: TOLOWER(HEAD(LABELS(writer))),
					uuid: writer.uuid,
					name: writer.name,
					format: writer.format,
					sourceMaterialWriterGroups: sourceMaterialWriterGroups
				}
			END
		) AS writers

	WITH material, writerGroupName, writers
		ORDER BY material.name, material.differentiator

	RETURN
		'material' AS model,
		material.uuid AS uuid,
		material.name AS name,
		material.format AS format,
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
