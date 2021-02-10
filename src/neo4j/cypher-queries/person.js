const getShowQuery = () => `
	MATCH (person:Person { uuid: $uuid })

	OPTIONAL MATCH (person)<-[:WRITTEN_BY|USES_SOURCE_MATERIAL*1..2]-(material:Material)

	WITH person, COLLECT(material) AS materials

	UNWIND (CASE materials WHEN [] THEN [null] ELSE materials END) AS material

		OPTIONAL MATCH (person)<-[writerRel:WRITTEN_BY]-(material:Material)

		OPTIONAL MATCH (person)<-[:WRITTEN_BY]-(:Material)<-[subsequentVersionRel:SUBSEQUENT_VERSION_OF]-(material)

		OPTIONAL MATCH (person)<-[:WRITTEN_BY]-(:Material)<-[sourcingMaterialRel:USES_SOURCE_MATERIAL]-(material)

		OPTIONAL MATCH (material)-[writingEntityRel:WRITTEN_BY|USES_SOURCE_MATERIAL]->(writingEntity)
			WHERE writingEntity:Person OR writingEntity:Company OR writingEntity:Material

		OPTIONAL MATCH (writingEntity:Material)-[sourceMaterialWriterRel:WRITTEN_BY]->(sourceMaterialWriter)

		WITH
			person,
			writerRel,
			material,
			CASE subsequentVersionRel WHEN NULL THEN false ELSE true END AS isSubsequentVersion,
			CASE sourcingMaterialRel WHEN NULL THEN false ELSE true END AS isSourcingMaterial,
			writingEntityRel,
			writingEntity,
			sourceMaterialWriterRel,
			sourceMaterialWriter
			ORDER BY sourceMaterialWriterRel.creditPosition, sourceMaterialWriterRel.entityPosition

		WITH
			person,
			writerRel,
			material,
			isSubsequentVersion,
			isSourcingMaterial,
			writingEntityRel,
			writingEntity,
			sourceMaterialWriterRel.credit AS sourceMaterialWritingCreditName,
			COLLECT(
				CASE sourceMaterialWriter WHEN NULL
					THEN null
					ELSE {
						model: TOLOWER(HEAD(LABELS(sourceMaterialWriter))),
						uuid: CASE sourceMaterialWriter.uuid WHEN person.uuid
							THEN null
							ELSE sourceMaterialWriter.uuid
						END,
						name: sourceMaterialWriter.name
					}
				END
			) AS sourceMaterialWriters

		WITH person, writerRel, material, isSubsequentVersion, isSourcingMaterial, writingEntityRel, writingEntity,
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
			ORDER BY writingEntityRel.creditPosition, writingEntityRel.entityPosition

		WITH
			person,
			writerRel,
			material,
			isSubsequentVersion,
			isSourcingMaterial,
			writingEntityRel.credit AS writingCreditName,
			[writingEntity IN COLLECT(
				CASE writingEntity WHEN NULL
					THEN null
					ELSE {
						model: TOLOWER(HEAD(LABELS(writingEntity))),
						uuid: CASE writingEntity.uuid WHEN person.uuid THEN null ELSE writingEntity.uuid END,
						name: writingEntity.name,
						format: writingEntity.format,
						sourceMaterialWritingCredits: sourceMaterialWritingCredits
					}
				END
			) | CASE writingEntity.model WHEN 'material'
				THEN writingEntity
				ELSE { model: writingEntity.model, uuid: writingEntity.uuid, name: writingEntity.name }
			END] AS writingEntities

		WITH person, writerRel, material, isSubsequentVersion, isSourcingMaterial,
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
						creditType: writerRel.creditType,
						hasDirectCredit: CASE writerRel WHEN NULL THEN false ELSE true END,
						isSubsequentVersion: isSubsequentVersion,
						isSourcingMaterial: isSourcingMaterial
					}
				END
			) AS materials

	WITH
		person,
		[
			material IN materials WHERE
				material.hasDirectCredit AND
				NOT material.isSubsequentVersion AND
				material.creditType IS NULL |
			{
				model: material.model,
				uuid: material.uuid,
				name: material.name,
				format: material.format,
				writingCredits: material.writingCredits
			}
		] AS materials,
		[
			material IN materials WHERE material.isSubsequentVersion |
			{
				model: material.model,
				uuid: material.uuid,
				name: material.name,
				format: material.format,
				writingCredits: material.writingCredits
			}
		] AS subsequentVersionMaterials,
		[
			material IN materials WHERE
				material.isSourcingMaterial OR
				material.creditType = 'NON_SPECIFIC_SOURCE_MATERIAL' |
			{
				model: material.model,
				uuid: material.uuid,
				name: material.name,
				format: material.format,
				writingCredits: material.writingCredits
			}
		] AS sourcingMaterials,
		[
			material IN materials WHERE material.creditType = 'RIGHTS_GRANTOR' |
			{
				model: material.model,
				uuid: material.uuid,
				name: material.name,
				format: material.format,
				writingCredits: material.writingCredits
			}
		] AS rightsGrantorMaterials

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
		rightsGrantorMaterials,
		production,
		theatre,
		surTheatre,
		role,
		character
		ORDER BY role.rolePosition

	WITH
		person,
		materials,
		subsequentVersionMaterials,
		sourcingMaterials,
		rightsGrantorMaterials,
		production,
		theatre,
		surTheatre,
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
		rightsGrantorMaterials,
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
