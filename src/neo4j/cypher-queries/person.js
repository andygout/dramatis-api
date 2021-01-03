const getShowQuery = () => `
	MATCH (person:Person { uuid: $uuid })

	OPTIONAL MATCH (person)<-[writerRel:WRITTEN_BY]-(material:Material)

	OPTIONAL MATCH (material)-[allWriterRel:WRITTEN_BY|USES_SOURCE_MATERIAL]->(writer)
		WHERE writer:Person OR writer:Material

	OPTIONAL MATCH (writer:Material)-[sourceMaterialWriterRel:WRITTEN_BY]->(sourceMaterialWriter)

	WITH person, writerRel, material, allWriterRel, writer, sourceMaterialWriterRel, sourceMaterialWriter
		ORDER BY sourceMaterialWriterRel.groupPosition, sourceMaterialWriter.writerPosition

	WITH
		person,
		writerRel,
		material,
		allWriterRel,
		writer,
		sourceMaterialWriterRel.group AS sourceMaterialWriterGroupName,
		COLLECT(
			CASE sourceMaterialWriter WHEN NULL
				THEN null
				ELSE { model: 'person', uuid: sourceMaterialWriter.uuid, name: sourceMaterialWriter.name }
			END
		) AS sourceMaterialWriters

	WITH person, writerRel, material, allWriterRel, writer,
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
		ORDER BY allWriterRel.groupPosition, allWriterRel.writerPosition

	WITH person, writerRel, material, allWriterRel.group AS writerGroupName,
		COLLECT(
			CASE writer WHEN NULL
				THEN null
				ELSE {
					model: TOLOWER(HEAD(LABELS(writer))),
					uuid: CASE WHEN writer.uuid = person.uuid THEN null ELSE writer.uuid END,
					name: writer.name,
					format: writer.format,
					sourceMaterialWriterGroups: sourceMaterialWriterGroups
				}
			END
		) AS writers

	WITH person, writerRel, material,
		COLLECT(
			CASE SIZE(writers) WHEN 0
				THEN null
				ELSE { model: 'writerGroup', name: COALESCE(writerGroupName, 'by'), writers: writers }
			END
		) AS writerGroups
		ORDER BY material.name

	WITH person,
		COLLECT(
			CASE material WHEN NULL
				THEN null
				ELSE {
					model: 'material',
					uuid: material.uuid,
					name: material.name,
					format: material.format,
					writerGroups: writerGroups,
					isOriginalVersionWriter: writerRel.isOriginalVersionWriter
				}
			END
		) AS materials

	WITH
		person,
		[
			material IN materials WHERE material.isOriginalVersionWriter IS NULL |
			{
				model: material.model,
				uuid: material.uuid,
				name: material.name,
				format: material.format,
				writerGroups: material.writerGroups
			}
		] AS materials,
		[
			material IN materials WHERE material.isOriginalVersionWriter = true |
			{
				model: material.model,
				uuid: material.uuid,
				name: material.name,
				format: material.format,
				writerGroups: material.writerGroups
			}
		] AS subsequentVersionMaterials

	OPTIONAL MATCH (person)<-[:WRITTEN_BY]-(:Material)<-[:USES_SOURCE_MATERIAL]-(sourcingMaterial:Material)

	OPTIONAL MATCH (sourcingMaterial)-[sourcingMaterialWriterRel:WRITTEN_BY|USES_SOURCE_MATERIAL]->
		(sourcingMaterialWriter)
		WHERE sourcingMaterialWriter:Person OR sourcingMaterialWriter:Material

	WITH
		person,
		materials,
		subsequentVersionMaterials,
		sourcingMaterial,
		sourcingMaterialWriterRel,
		sourcingMaterialWriter
		ORDER BY sourcingMaterialWriterRel.groupPosition, sourcingMaterialWriterRel.writerPosition

	WITH
		person,
		materials,
		subsequentVersionMaterials,
		sourcingMaterial,
		sourcingMaterialWriterRel,
		sourcingMaterialWriter,
		sourcingMaterialWriterRel.group AS sourcingMaterialWriterGroupName,
		COLLECT(
			CASE sourcingMaterialWriter WHEN NULL
				THEN null
				ELSE {
					model: TOLOWER(HEAD(LABELS(sourcingMaterialWriter))),
					uuid: sourcingMaterialWriter.uuid,
					name: sourcingMaterialWriter.name,
					format: sourcingMaterialWriter.format
				}
			END
		) AS sourcingMaterialWriters

	WITH
		person,
		materials,
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
		person,
		materials,
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

	OPTIONAL MATCH (person)-[role:PERFORMS_IN]->(production:Production)

	OPTIONAL MATCH (production)-[:PLAYS_AT]->(theatre:Theatre)

	OPTIONAL MATCH (theatre)<-[:INCLUDES_SUB_THEATRE]-(surTheatre:Theatre)

	OPTIONAL MATCH (production)-[:PRODUCTION_OF]->(:Material)-[characterRel:INCLUDES_CHARACTER]->(character:Character)
		WHERE
			(
				role.roleName IN [character.name, characterRel.displayName] OR
				role.characterName IN [character.name, characterRel.displayName]
			) AND
			(role.characterDifferentiator IS NULL OR role.characterDifferentiator = character.differentiator)

	WITH DISTINCT
		person,
		materials,
		subsequentVersionMaterials,
		sourcingMaterials,
		production,
		theatre,
		surTheatre,
		role,
		character
		ORDER BY role.rolePosition

	WITH person, materials, subsequentVersionMaterials, sourcingMaterials, production, theatre, surTheatre,
		COLLECT(
			CASE role.roleName WHEN NULL
				THEN { name: 'Performer' }
				ELSE { model: 'character', uuid: character.uuid, name: role.roleName, qualifier: role.qualifier }
			END
		) AS roles
		ORDER BY production.name, theatre.name

	RETURN
		'person' AS model,
		person.uuid AS uuid,
		person.name AS name,
		person.differentiator AS differentiator,
		materials,
		subsequentVersionMaterials,
		sourcingMaterials,
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
					END,
					roles: roles
				}
			END
		) AS productions
`;

export {
	getShowQuery
};
