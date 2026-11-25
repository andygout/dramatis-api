export default () => `
	MATCH (material:Material { name: $name })
		WHERE
			(
				($differentiator IS NULL AND material.differentiator IS NULL) OR
				$differentiator = material.differentiator
			)

	OPTIONAL MATCH (subjectMaterial:Material { uuid: $subjectMaterialUuid })

	OPTIONAL MATCH (material)<-[surMaterialRel:HAS_SUB_MATERIAL]-(surMaterial:Material)
		WHERE
			$subjectMaterialUuid IS NULL OR
			$subjectMaterialUuid <> surMaterial.uuid

	OPTIONAL MATCH (material)
		-[:HAS_SUB_MATERIAL]->(:Material)
		-[subSubMaterialRel:HAS_SUB_MATERIAL]->(:Material)

	OPTIONAL MATCH (material)-[subMaterialRelWithSubjectMaterial:HAS_SUB_MATERIAL]->(subjectMaterial)

	OPTIONAL MATCH (subjectMaterial)
		<-[:HAS_SUB_MATERIAL]-(:Material)
		<-[subjectMaterialSurSurMaterialRel:HAS_SUB_MATERIAL]-(:Material)

	RETURN
		TOBOOLEAN(COUNT(surMaterialRel)) AS isAssignedToSurMaterial,
		TOBOOLEAN(COUNT(subSubMaterialRel)) AS isSurSurMaterial,
		TOBOOLEAN(COUNT(subMaterialRelWithSubjectMaterial)) AS isSurMaterialOfSubjectMaterial,
		TOBOOLEAN(COUNT(subjectMaterialSurSurMaterialRel)) AS isSubjectMaterialASubSubMaterial
`;
