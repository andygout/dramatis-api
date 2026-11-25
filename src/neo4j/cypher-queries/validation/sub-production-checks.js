export default () => `
	MATCH (production:Production { uuid: $uuid })

	OPTIONAL MATCH (subjectProduction:Production { uuid: $subjectProductionUuid })

	OPTIONAL MATCH (production)<-[surProductionRel:HAS_SUB_PRODUCTION]-(surProduction:Production)
		WHERE
			$subjectProductionUuid IS NULL OR
			$subjectProductionUuid <> surProduction.uuid

	OPTIONAL MATCH (production)
		-[:HAS_SUB_PRODUCTION]->(:Production)
		-[subSubProductionRel:HAS_SUB_PRODUCTION]->(:Production)

	OPTIONAL MATCH (production)-[subProductionRelWithSubjectProduction:HAS_SUB_PRODUCTION]->(subjectProduction)

	OPTIONAL MATCH (subjectProduction)
		<-[:HAS_SUB_PRODUCTION]-(:Production)
		<-[subjectProductionSurSurProductionRel:HAS_SUB_PRODUCTION]-(:Production)

	RETURN
		TOBOOLEAN(COUNT(production)) AS isExistent,
		TOBOOLEAN(COUNT(surProductionRel)) AS isAssignedToSurProduction,
		TOBOOLEAN(COUNT(subSubProductionRel)) AS isSurSurProduction,
		TOBOOLEAN(COUNT(subProductionRelWithSubjectProduction)) AS isSurProductionOfSubjectProduction,
		TOBOOLEAN(COUNT(subjectProductionSurSurProductionRel)) AS isSubjectProductionASubSubProduction
`;
