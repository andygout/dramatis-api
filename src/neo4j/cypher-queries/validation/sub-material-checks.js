export default () => `
	MATCH (m:Material { name: $name })
		WHERE
			(
				($differentiator IS NULL AND m.differentiator IS NULL) OR
				$differentiator = m.differentiator
			)

	OPTIONAL MATCH (subjectMaterial:Material { uuid: $subjectMaterialUuid })

	OPTIONAL MATCH (m)<-[surMaterialRel:HAS_SUB_MATERIAL]-(:Material)

	OPTIONAL MATCH (m)
		-[:HAS_SUB_MATERIAL]->(:Material)
		-[subSubMaterialRel:HAS_SUB_MATERIAL]->(:Material)

	OPTIONAL MATCH (m)-[subjectMaterialSubMaterialRel:HAS_SUB_MATERIAL]->(subjectMaterial)

	OPTIONAL MATCH (subjectMaterial)
		<-[:HAS_SUB_MATERIAL]-(:Material)
		<-[surSurMaterialRel:HAS_SUB_MATERIAL]-(:Material)

	RETURN
		TOBOOLEAN(COUNT(surMaterialRel)) AS isAssignedToSurMaterial,
		TOBOOLEAN(COUNT(subSubMaterialRel)) AS isSurSurMaterial,
		TOBOOLEAN(COUNT(subjectMaterialSubMaterialRel)) AS isSurMaterialOfSubjectMaterial,
		TOBOOLEAN(COUNT(surSurMaterialRel)) AS isSubjectMaterialASubSubMaterial
`;
