export default () => `
	MATCH (material:Material { name: $name })
		WHERE
			(
				($differentiator IS NULL AND material.differentiator IS NULL) OR
				$differentiator = material.differentiator
			)

	OPTIONAL MATCH (subjectMaterial:Material { uuid: $subjectMaterialUuid })

	OPTIONAL MATCH (material)-[sourceMaterialRelWithSubjectMaterial:USES_SOURCE_MATERIAL]->(subjectMaterial)

	RETURN
		TOBOOLEAN(COUNT(sourceMaterialRelWithSubjectMaterial)) AS isSourcingMaterialOfSubjectMaterial
`;
