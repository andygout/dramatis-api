export default () => `
	MATCH (material:Material { name: $name })
		WHERE
			(
				($differentiator IS NULL AND material.differentiator IS NULL) OR
				$differentiator = material.differentiator
			)

	OPTIONAL MATCH (subjectMaterial:Material { uuid: $subjectMaterialUuid })

	OPTIONAL MATCH (material)-[originalVersionMaterialRelWithSubjectMaterial:SUBSEQUENT_VERSION_OF]->(subjectMaterial)

	RETURN
		TOBOOLEAN(COUNT(originalVersionMaterialRelWithSubjectMaterial)) AS isSubsequentVersionMaterialOfSubjectMaterial
`;
