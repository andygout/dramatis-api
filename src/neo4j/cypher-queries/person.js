const getShowQuery = () => `
	MATCH (person:Person { uuid: $uuid })

	OPTIONAL MATCH (person)<-[writerRel:WRITTEN_BY]-(material:Material)

	OPTIONAL MATCH (material)-[allWritingEntityRel:WRITTEN_BY|USES_SOURCE_MATERIAL]->(writingEntity)
		WHERE writingEntity:Person OR writingEntity:Material

	OPTIONAL MATCH (writingEntity:Material)-[sourceMaterialWriterRel:WRITTEN_BY]->(sourceMaterialWriter)

	WITH person, writerRel, material, allWritingEntityRel, writingEntity, sourceMaterialWriterRel, sourceMaterialWriter
		ORDER BY sourceMaterialWriterRel.creditPosition, sourceMaterialWriter.entityPosition

	WITH
		person,
		writerRel,
		material,
		allWritingEntityRel,
		writingEntity,
		sourceMaterialWriterRel.credit AS sourceMaterialWritingCreditName,
		COLLECT(
			CASE sourceMaterialWriter WHEN NULL
				THEN null
				ELSE { model: 'person', uuid: sourceMaterialWriter.uuid, name: sourceMaterialWriter.name }
			END
		) AS sourceMaterialWriters

	WITH person, writerRel, material, allWritingEntityRel, writingEntity,
		COLLECT(
			CASE SIZE(sourceMaterialWriters) WHEN 0
				THEN null
				ELSE {
					model: 'writingCredit',
					name: COALESCE(sourceMaterialWritingCreditName, 'by'),
					writingEntities: sourceMaterialWriters
				}
			END
		) AS sourceMaterialWritingCredits
		ORDER BY allWritingEntityRel.creditPosition, allWritingEntityRel.entityPosition

	WITH person, writerRel, material, allWritingEntityRel.credit AS writingCreditName,
		COLLECT(
			CASE writingEntity WHEN NULL
				THEN null
				ELSE {
					model: TOLOWER(HEAD(LABELS(writingEntity))),
					uuid: CASE WHEN writingEntity.uuid = person.uuid THEN null ELSE writingEntity.uuid END,
					name: writingEntity.name,
					format: writingEntity.format,
					sourceMaterialWritingCredits: sourceMaterialWritingCredits
				}
			END
		) AS writingEntities

	WITH person, writerRel, material,
		COLLECT(
			CASE SIZE(writingEntities) WHEN 0
				THEN null
				ELSE {
					model: 'writingCredit',
					name: COALESCE(writingCreditName, 'by'),
					writingEntities: writingEntities
				}
			END
		) AS writingCredits
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
					writingCredits: writingCredits,
					isOriginalVersionCredit: writerRel.isOriginalVersionCredit
				}
			END
		) AS materials

	WITH
		person,
		[
			material IN materials WHERE material.isOriginalVersionCredit IS NULL |
			{
				model: material.model,
				uuid: material.uuid,
				name: material.name,
				format: material.format,
				writingCredits: material.writingCredits
			}
		] AS materials,
		[
			material IN materials WHERE material.isOriginalVersionCredit = true |
			{
				model: material.model,
				uuid: material.uuid,
				name: material.name,
				format: material.format,
				writingCredits: material.writingCredits
			}
		] AS subsequentVersionMaterials

	OPTIONAL MATCH (person)<-[:WRITTEN_BY]-(:Material)<-[:USES_SOURCE_MATERIAL]-(sourcingMaterial:Material)

	OPTIONAL MATCH (sourcingMaterial)-[sourcingMaterialWritingEntityRel:WRITTEN_BY|USES_SOURCE_MATERIAL]->
		(sourcingMaterialWritingEntity)
		WHERE sourcingMaterialWritingEntity:Person OR sourcingMaterialWritingEntity:Material

	WITH
		person,
		materials,
		subsequentVersionMaterials,
		sourcingMaterial,
		sourcingMaterialWritingEntityRel,
		sourcingMaterialWritingEntity
		ORDER BY sourcingMaterialWritingEntityRel.creditPosition, sourcingMaterialWritingEntityRel.entityPosition

	WITH
		person,
		materials,
		subsequentVersionMaterials,
		sourcingMaterial,
		sourcingMaterialWritingEntityRel,
		sourcingMaterialWritingEntity,
		sourcingMaterialWritingEntityRel.credit AS sourcingMaterialWritingCreditName,
		COLLECT(
			CASE sourcingMaterialWritingEntity WHEN NULL
				THEN null
				ELSE {
					model: TOLOWER(HEAD(LABELS(sourcingMaterialWritingEntity))),
					uuid: sourcingMaterialWritingEntity.uuid,
					name: sourcingMaterialWritingEntity.name,
					format: sourcingMaterialWritingEntity.format
				}
			END
		) AS sourcingMaterialWritingEntities

	WITH
		person,
		materials,
		subsequentVersionMaterials,
		sourcingMaterial,
		COLLECT(
			CASE SIZE(sourcingMaterialWritingEntities) WHEN 0
				THEN null
				ELSE {
					model: 'writingCredit',
					name: COALESCE(sourcingMaterialWritingCreditName, 'by'),
					writingEntities: sourcingMaterialWritingEntities
				}
			END
		) AS sourcingMaterialWritingCredits

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
					writingCredits: sourcingMaterialWritingCredits
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
