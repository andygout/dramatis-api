const getShowQuery = () => `
	MATCH (company:Company { uuid: $uuid })

	OPTIONAL MATCH (company)<-[:WRITTEN_BY|USES_SOURCE_MATERIAL*1..2]-(material:Material)

	WITH company, COLLECT(material) AS materials

	UNWIND (CASE materials WHEN [] THEN [null] ELSE materials END) AS material

		OPTIONAL MATCH (company)<-[writerRel:WRITTEN_BY]-(material:Material)

		OPTIONAL MATCH (company)<-[originalVersionCredit:WRITTEN_BY]-(:Material)<-[:SUBSEQUENT_VERSION_OF]-(material)

		OPTIONAL MATCH (company)<-[sourceMaterialCredit:WRITTEN_BY]-(:Material)<-[:USES_SOURCE_MATERIAL]-(material)

		OPTIONAL MATCH (material)-[writingEntityRel:WRITTEN_BY|USES_SOURCE_MATERIAL]->(writingEntity)
			WHERE writingEntity:Person OR writingEntity:Company OR writingEntity:Material

		OPTIONAL MATCH (writingEntity:Material)-[sourceMaterialWriterRel:WRITTEN_BY]->(sourceMaterialWriter)

		WITH
			company,
			writerRel,
			material,
			originalVersionCredit,
			sourceMaterialCredit,
			writingEntityRel,
			writingEntity,
			sourceMaterialWriterRel,
			sourceMaterialWriter
			ORDER BY sourceMaterialWriterRel.creditPosition, sourceMaterialWriterRel.entityPosition

		WITH
			company,
			writerRel,
			material,
			originalVersionCredit,
			sourceMaterialCredit,
			writingEntityRel,
			writingEntity,
			sourceMaterialWriterRel.credit AS sourceMaterialWritingCreditName,
			COLLECT(
				CASE sourceMaterialWriter WHEN NULL
					THEN null
					ELSE {
						model: TOLOWER(HEAD(LABELS(sourceMaterialWriter))),
						uuid: CASE sourceMaterialWriter.uuid WHEN company.uuid
							THEN null
							ELSE sourceMaterialWriter.uuid
						END,
						name: sourceMaterialWriter.name
					}
				END
			) AS sourceMaterialWriters

		WITH company, writerRel, material, originalVersionCredit, sourceMaterialCredit, writingEntityRel, writingEntity,
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
			company,
			writerRel,
			material,
			originalVersionCredit,
			sourceMaterialCredit,
			writingEntityRel.credit AS writingCreditName,
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

		WITH company, writerRel, material, originalVersionCredit, sourceMaterialCredit,
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
						originalVersionCredit: originalVersionCredit,
						sourceMaterialCredit: sourceMaterialCredit
					}
				END
			) AS materials

	RETURN
		'company' AS model,
		company.uuid AS uuid,
		company.name AS name,
		company.differentiator AS differentiator,
		[
			material IN materials WHERE ALL(x IN [
				'originalVersionCredit',
				'sourceMaterialCredit',
				'creditType'
			] WHERE material[x] IS NULL) |
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
			material IN materials WHERE
				material.sourceMaterialCredit IS NOT NULL OR
				material.creditType = 'NON_SPECIFIC_SOURCE_MATERIAL' |
			{
				model: material.model,
				uuid: material.uuid,
				name: material.name,
				format: material.format,
				writingCredits: material.writingCredits
			}
		] AS sourcingMaterials
`;

export {
	getShowQuery
};
