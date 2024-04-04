export default () => `
	MATCH (m:Material { name: $name })
		WHERE
			(
				($differentiator IS NULL AND m.differentiator IS NULL) OR
				$differentiator = m.differentiator
			)

	OPTIONAL MATCH (subjectMaterial:Material { uuid: $subjectMaterialUuid })

	OPTIONAL MATCH (m)-[sourceMaterialRelWithSubjectMaterial:USES_SOURCE_MATERIAL]->(subjectMaterial)

	RETURN
		TOBOOLEAN(COUNT(sourceMaterialRelWithSubjectMaterial)) AS isSourcingMaterialOfSubjectMaterial
`;
