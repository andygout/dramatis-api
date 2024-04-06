export default () => `
	MATCH (m:Material { name: $name })
		WHERE
			(
				($differentiator IS NULL AND m.differentiator IS NULL) OR
				$differentiator = m.differentiator
			)

	OPTIONAL MATCH (subjectMaterial:Material { uuid: $subjectMaterialUuid })

	OPTIONAL MATCH (m)-[originalVersionMaterialRelWithSubjectMaterial:SUBSEQUENT_VERSION_OF]->(subjectMaterial)

	RETURN
		TOBOOLEAN(COUNT(originalVersionMaterialRelWithSubjectMaterial)) AS isSubsequentVersionMaterialOfSubjectMaterial
`;
