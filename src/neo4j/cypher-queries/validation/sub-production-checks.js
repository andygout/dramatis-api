export default () => `
	MATCH (p:Production { uuid: $uuid })

	OPTIONAL MATCH (subjectProduction:Production { uuid: $subjectProductionUuid })

	OPTIONAL MATCH (p)<-[surProductionRel:HAS_SUB_PRODUCTION]-(:Production)

	OPTIONAL MATCH (p)
		-[:HAS_SUB_PRODUCTION]->(:Production)
		-[subSubProductionRel:HAS_SUB_PRODUCTION]->(:Production)

	OPTIONAL MATCH (p)-[subjectProductionSubProductionRel:HAS_SUB_PRODUCTION]->(subjectProduction)

	OPTIONAL MATCH (subjectProduction)
		<-[:HAS_SUB_PRODUCTION]-(:Production)
		<-[surSurProductionRel:HAS_SUB_PRODUCTION]-(:Production)

	RETURN
		TOBOOLEAN(COUNT(p)) AS exists,
		TOBOOLEAN(COUNT(surProductionRel)) AS isAssignedToSurProduction,
		TOBOOLEAN(COUNT(subSubProductionRel)) AS isSurSurProduction,
		TOBOOLEAN(COUNT(subjectProductionSubProductionRel)) AS isSurProductionOfSubjectProduction,
		TOBOOLEAN(COUNT(surSurProductionRel)) AS isSubjectProductionASubSubProduction
`;
