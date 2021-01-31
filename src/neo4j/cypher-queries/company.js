const getShowQuery = () => `
	MATCH (company:Company { uuid: $uuid })

	OPTIONAL MATCH (company)<-[writerRel:WRITTEN_BY]-(material:Material)

	OPTIONAL MATCH (material)-[:SUBSEQUENT_VERSION_OF]->(:Material)-[originalVersionCredit:WRITTEN_BY]->(company)

	OPTIONAL MATCH (material)-[allWritingEntityRel:WRITTEN_BY|USES_SOURCE_MATERIAL]->(writingEntity)
		WHERE writingEntity:Person OR writingEntity:Company OR writingEntity:Material

	OPTIONAL MATCH (writingEntity:Material)-[sourceMaterialWriterRel:WRITTEN_BY]->(sourceMaterialWriter)

	WITH
		company,
		writerRel,
		material,
		originalVersionCredit,
		allWritingEntityRel,
		writingEntity,
		sourceMaterialWriterRel,
		sourceMaterialWriter
		ORDER BY sourceMaterialWriterRel.creditPosition, sourceMaterialWriterRel.entityPosition

	WITH
		company,
		writerRel,
		material,
		originalVersionCredit,
		allWritingEntityRel,
		writingEntity,
		sourceMaterialWriterRel.credit AS sourceMaterialWritingCreditName,
		COLLECT(
			CASE sourceMaterialWriter WHEN NULL
				THEN null
				ELSE {
					model: TOLOWER(HEAD(LABELS(sourceMaterialWriter))),
					uuid: sourceMaterialWriter.uuid,
					name: sourceMaterialWriter.name
				}
			END
		) AS sourceMaterialWriters

	WITH company, writerRel, material, originalVersionCredit, allWritingEntityRel, writingEntity,
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

	WITH company, writerRel, material, originalVersionCredit, allWritingEntityRel.credit AS writingCreditName,
		[writingEntity IN COLLECT(
			CASE writingEntity WHEN NULL
				THEN null
				ELSE {
					model: TOLOWER(HEAD(LABELS(writingEntity))),
					uuid: CASE writingEntity.uuid WHEN company.uuid THEN null ELSE writingEntity.uuid END,
					name: writingEntity.name,
					format: writingEntity.format,
					sourceMaterialWritingCredits: sourceMaterialWritingCredits
				}
			END
		) | CASE writingEntity.model WHEN 'material'
			THEN writingEntity
			ELSE { model: writingEntity.model, uuid: writingEntity.uuid, name: writingEntity.name }
		END] AS writingEntities

	WITH company, writerRel, material, originalVersionCredit,
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

	WITH company,
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
					originalVersionCredit: originalVersionCredit
				}
			END
		) AS materials

	WITH
		company,
		[
			material IN materials WHERE material.creditType IS NULL AND material.originalVersionCredit IS NULL |
			{
				model: material.model,
				uuid: material.uuid,
				name: material.name,
				format: material.format,
				writingCredits: material.writingCredits
			}
		] AS materials,
		[
			material IN materials WHERE material.originalVersionCredit IS NOT NULL |
			{
				model: material.model,
				uuid: material.uuid,
				name: material.name,
				format: material.format,
				writingCredits: material.writingCredits
			}
		] AS subsequentVersionMaterials,
		[
			material IN materials WHERE material.creditType = 'NON_SPECIFIC_SOURCE_MATERIAL' |
			{
				model: material.model,
				uuid: material.uuid,
				name: material.name,
				format: material.format,
				writingCredits: material.writingCredits
			}
		] AS sourcingMaterialsFromNonSpecificMaterials

	OPTIONAL MATCH (company)<-[:WRITTEN_BY]-(:Material)<-[:USES_SOURCE_MATERIAL]-(sourcingMaterial:Material)

	OPTIONAL MATCH (sourcingMaterial)-[sourcingMaterialWritingEntityRel:WRITTEN_BY|USES_SOURCE_MATERIAL]->
		(sourcingMaterialWritingEntity)
		WHERE
			sourcingMaterialWritingEntity:Person OR
			sourcingMaterialWritingEntity:Company OR
			sourcingMaterialWritingEntity:Material

	WITH
		company,
		materials,
		subsequentVersionMaterials,
		sourcingMaterialsFromNonSpecificMaterials,
		sourcingMaterial,
		sourcingMaterialWritingEntityRel,
		sourcingMaterialWritingEntity
		ORDER BY sourcingMaterialWritingEntityRel.creditPosition, sourcingMaterialWritingEntityRel.entityPosition

	WITH
		company,
		materials,
		subsequentVersionMaterials,
		sourcingMaterialsFromNonSpecificMaterials,
		sourcingMaterial,
		sourcingMaterialWritingEntityRel.credit AS sourcingMaterialWritingCreditName,
		[sourcingMaterialWritingEntity IN COLLECT(
			CASE sourcingMaterialWritingEntity WHEN NULL
				THEN null
				ELSE {
					model: TOLOWER(HEAD(LABELS(sourcingMaterialWritingEntity))),
					uuid: sourcingMaterialWritingEntity.uuid,
					name: sourcingMaterialWritingEntity.name,
					format: sourcingMaterialWritingEntity.format
				}
			END
		) | CASE sourcingMaterialWritingEntity.model WHEN 'material'
			THEN sourcingMaterialWritingEntity
			ELSE {
				model: sourcingMaterialWritingEntity.model,
				uuid: sourcingMaterialWritingEntity.uuid,
				name: sourcingMaterialWritingEntity.name
			}
		END] AS sourcingMaterialWritingEntities

	WITH company, materials, subsequentVersionMaterials, sourcingMaterialsFromNonSpecificMaterials, sourcingMaterial,
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

	WITH company, materials, subsequentVersionMaterials, sourcingMaterialsFromNonSpecificMaterials,
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
		) AS sourcingMaterialsFromSpecificMaterials

	WITH
		company,
		materials,
		subsequentVersionMaterials,
		sourcingMaterialsFromNonSpecificMaterials + sourcingMaterialsFromSpecificMaterials AS sourcingMaterials

	UNWIND (CASE sourcingMaterials WHEN [] THEN [null] ELSE sourcingMaterials END) AS sourcingMaterial

		WITH company, materials, subsequentVersionMaterials, sourcingMaterial
			ORDER BY sourcingMaterial.name

	WITH DISTINCT company, materials, subsequentVersionMaterials, COLLECT(sourcingMaterial) AS sourcingMaterials

	RETURN
		'company' AS model,
		company.uuid AS uuid,
		company.name AS name,
		company.differentiator AS differentiator,
		materials,
		subsequentVersionMaterials,
		sourcingMaterials
`;

export {
	getShowQuery
};
