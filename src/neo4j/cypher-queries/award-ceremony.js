import { ACTIONS } from '../../utils/constants';

const getAwardContextualDuplicateRecordCountQuery = () => `
	MATCH (ceremony:AwardCeremony { name: $name })<-[:PRESENTED_AT]-(award:Award { name: $award.name })
		WHERE
			(
				$uuid IS NULL OR
				$uuid <> ceremony.uuid
			) AND
			(
				($award.differentiator IS NULL AND award.differentiator IS NULL) OR
				$award.differentiator = award.differentiator
			)

	RETURN SIGN(COUNT(ceremony)) AS duplicateRecordCount
`;

const getCreateUpdateQuery = action => {

	const createUpdateQueryOpeningMap = {
		[ACTIONS.CREATE]: `
			CREATE (ceremony:AwardCeremony { uuid: $uuid, name: $name })
		`,
		[ACTIONS.UPDATE]: `
			MATCH (ceremony:AwardCeremony { uuid: $uuid })

			OPTIONAL MATCH (ceremony)-[:PRESENTS_CATEGORY]->(category:AwardCeremonyCategory)

			OPTIONAL MATCH (category)-[nomineeEntityRel:HAS_NOMINEE]->(nomineeEntity)
				WHERE nomineeEntity:Person OR nomineeEntity:Company

			DELETE nomineeEntityRel

			DETACH DELETE category

			WITH ceremony

			OPTIONAL MATCH (ceremony)<-[awardRel:PRESENTED_AT]-(:Award)

			DELETE awardRel

			WITH DISTINCT ceremony

			SET ceremony.name = $name
		`
	};

	return `
		${createUpdateQueryOpeningMap[action]}

		WITH ceremony

		OPTIONAL MATCH (existingAward:Award { name: $award.name })
			WHERE
				($award.differentiator IS NULL AND existingAward.differentiator IS NULL) OR
				$award.differentiator = existingAward.differentiator

		FOREACH (item IN CASE $award.name WHEN NULL THEN [] ELSE [1] END |
			MERGE (award:Award {
				uuid: COALESCE(existingAward.uuid, $award.uuid),
				name: $award.name
			})
				ON CREATE SET award.differentiator = $award.differentiator

			CREATE (ceremony)<-[:PRESENTED_AT]-(award)
		)

		WITH DISTINCT ceremony

		UNWIND (CASE $categories WHEN [] THEN [{ nominations: [] }] ELSE $categories END) AS categoryParam

			FOREACH (item IN CASE categoryParam.name WHEN NULL THEN [] ELSE [1] END |
				CREATE (:AwardCeremonyCategory { name: categoryParam.name })
					<-[:PRESENTS_CATEGORY { position: categoryParam.position }]-(ceremony)
			)

			WITH ceremony, categoryParam

			OPTIONAL MATCH (category:AwardCeremonyCategory { name: categoryParam.name })
				<-[:PRESENTS_CATEGORY]-(ceremony)

			UNWIND (CASE categoryParam.nominations WHEN []
				THEN [{ entities: [] }]
				ELSE categoryParam.nominations
			END) AS nomination

				UNWIND
					CASE SIZE([entity IN nomination.entities WHERE entity.model = 'PERSON']) WHEN 0
						THEN [null]
						ELSE [entity IN nomination.entities WHERE entity.model = 'PERSON']
					END AS nomineePersonParam

					OPTIONAL MATCH (existingNomineePerson:Person { name: nomineePersonParam.name })
						WHERE
							(
								nomineePersonParam.differentiator IS NULL AND
								existingNomineePerson.differentiator IS NULL
							) OR
							nomineePersonParam.differentiator = existingNomineePerson.differentiator

					FOREACH (item IN CASE nomineePersonParam WHEN NULL THEN [] ELSE [1] END |
						MERGE (nomineePerson:Person {
							uuid: COALESCE(existingNomineePerson.uuid, nomineePersonParam.uuid),
							name: nomineePersonParam.name
						})
							ON CREATE SET nomineePerson.differentiator = nomineePersonParam.differentiator

						CREATE (category)-
							[:HAS_NOMINEE {
								nominationPosition: nomination.position,
								entityPosition: nomineePersonParam.position
							}]->(nomineePerson)
					)

				WITH DISTINCT ceremony, category, nomination

				UNWIND
					CASE SIZE([entity IN nomination.entities WHERE entity.model = 'COMPANY']) WHEN 0
						THEN [null]
						ELSE [entity IN nomination.entities WHERE entity.model = 'COMPANY']
					END AS nomineeCompanyParam

					OPTIONAL MATCH (existingNomineeCompany:Company { name: nomineeCompanyParam.name })
						WHERE
							(
								nomineeCompanyParam.differentiator IS NULL AND
								existingNomineeCompany.differentiator IS NULL
							) OR
							nomineeCompanyParam.differentiator = existingNomineeCompany.differentiator

					FOREACH (item IN CASE nomineeCompanyParam WHEN NULL THEN [] ELSE [1] END |
						MERGE (nomineeCompany:Company {
							uuid: COALESCE(existingNomineeCompany.uuid, nomineeCompanyParam.uuid),
							name: nomineeCompanyParam.name
						})
							ON CREATE SET nomineeCompany.differentiator = nomineeCompanyParam.differentiator

						CREATE (category)-
							[:HAS_NOMINEE {
								nominationPosition: nomination.position,
								entityPosition: nomineeCompanyParam.position
							}]->(nomineeCompany)
					)

					WITH DISTINCT ceremony, category, nomination, nomineeCompanyParam

					UNWIND
						CASE WHEN nomineeCompanyParam IS NOT NULL AND SIZE(nomineeCompanyParam.members) > 0
							THEN nomineeCompanyParam.members
							ELSE [null]
						END AS nominatedMemberParam

						OPTIONAL MATCH (nominatedCompany:Company { name: nomineeCompanyParam.name })
							WHERE
								(
									nomineeCompanyParam.differentiator IS NULL AND
									nominatedCompany.differentiator IS NULL
								) OR
								nomineeCompanyParam.differentiator = nominatedCompany.differentiator

						OPTIONAL MATCH (nominatedCompany)<-[nomineeCompanyRel:HAS_NOMINEE]-(category)
							WHERE
								nomination.position IS NULL OR
								nomination.position = nomineeCompanyRel.nominationPosition

						OPTIONAL MATCH (existingPerson:Person { name: nominatedMemberParam.name })
							WHERE
								(
									nominatedMemberParam.differentiator IS NULL AND
									existingPerson.differentiator IS NULL
								) OR
								nominatedMemberParam.differentiator = existingPerson.differentiator

						FOREACH (item IN CASE WHEN SIZE(nomineeCompanyParam.members) > 0
							THEN [1]
							ELSE []
						END | SET nomineeCompanyRel.nominatedMemberUuids = [])

						FOREACH (item IN CASE nominatedMemberParam WHEN NULL THEN [] ELSE [1] END |
							MERGE (nominatedMember:Person {
								uuid: COALESCE(existingPerson.uuid, nominatedMemberParam.uuid),
								name: nominatedMemberParam.name
							})
								ON CREATE SET nominatedMember.differentiator = nominatedMemberParam.differentiator

							CREATE (category)-
								[:HAS_NOMINEE {
									nominationPosition: nomination.position,
									memberPosition: nominatedMemberParam.position,
									nominatedCompanyUuid: nominatedCompany.uuid
								}]->(nominatedMember)

							SET nomineeCompanyRel.nominatedMemberUuids =
								nomineeCompanyRel.nominatedMemberUuids + nominatedMember.uuid
						)

		WITH DISTINCT ceremony

		${getEditQuery()}
	`;

};

const getCreateQuery = () => getCreateUpdateQuery(ACTIONS.CREATE);

const getEditQuery = () => `
	MATCH (ceremony:AwardCeremony { uuid: $uuid })

	OPTIONAL MATCH (ceremony)<-[:PRESENTED_AT]-(award:Award)

	OPTIONAL MATCH (ceremony)-[categoryRel:PRESENTS_CATEGORY]->
		(category:AwardCeremonyCategory)

	OPTIONAL MATCH (category)-[nomineeEntityRel:HAS_NOMINEE]->(nomineeEntity)
		WHERE
			(nomineeEntity:Person AND nomineeEntityRel.nominatedCompanyUuid IS NULL) OR
			nomineeEntity:Company

	WITH ceremony, award, categoryRel, category, nomineeEntityRel,
		COLLECT(nomineeEntity {
			model: TOUPPER(HEAD(LABELS(nomineeEntity))),
			.name,
			.differentiator,
			nominatedMemberUuids: nomineeEntityRel.nominatedMemberUuids
		}) AS nomineeEntities

	UNWIND (CASE nomineeEntities WHEN [] THEN [null] ELSE nomineeEntities END) AS nomineeEntity

		UNWIND (COALESCE(nomineeEntity.nominatedMemberUuids, [null])) AS nominatedMemberUuid

			OPTIONAL MATCH (category)-[nominatedMemberRel:HAS_NOMINEE]->
				(nominatedMember:Person { uuid: nominatedMemberUuid })
				WHERE
					nomineeEntityRel.nominationPosition IS NULL OR
					nomineeEntityRel.nominationPosition = nominatedMemberRel.nominationPosition

			WITH ceremony, award, categoryRel, category, nomineeEntityRel, nomineeEntity, nominatedMember
				ORDER BY nominatedMemberRel.memberPosition

			WITH ceremony, award, categoryRel, category, nomineeEntityRel, nomineeEntity,
				COLLECT(nominatedMember { .name, .differentiator }) + [{}] AS nominatedMembers

	WITH ceremony, award, categoryRel, category, nomineeEntityRel, nomineeEntity, nominatedMembers
		ORDER BY nomineeEntityRel.nominationPosition, nomineeEntityRel.entityPosition

	WITH
		ceremony,
		award,
		categoryRel,
		category,
		nomineeEntityRel.nominationPosition AS nominationPosition,
		[nomineeEntity IN COLLECT(
			CASE nomineeEntity WHEN NULL
				THEN null
				ELSE nomineeEntity { .model, .name, .differentiator, members: nominatedMembers }
			END
		) | CASE nomineeEntity.model WHEN 'COMPANY'
			THEN nomineeEntity
			ELSE nomineeEntity { .model, .name, .differentiator }
		END] + [{}] AS nomineeEntities

	WITH ceremony, award, categoryRel, category,
		COLLECT(
			CASE SIZE(nomineeEntities) WHEN 1
				THEN null
				ELSE { entities: nomineeEntities }
			END
		) + [{ entities: [{}] }] AS nominations
		ORDER BY categoryRel.position

	RETURN
		ceremony.uuid AS uuid,
		ceremony.name AS name,
		{ name: COALESCE(award.name, ''), differentiator: COALESCE(award.differentiator, '') } AS award,
		COLLECT(
			CASE category WHEN NULL
				THEN null
				ELSE category { .name, nominations }
			END
		) + [{ nominations: [{ entities: [{}] }] }] AS categories
`;

const getUpdateQuery = () => getCreateUpdateQuery(ACTIONS.UPDATE);

const getShowQuery = () => `
	MATCH (ceremony:AwardCeremony { uuid: $uuid })

	OPTIONAL MATCH (ceremony)<-[:PRESENTED_AT]-(award:Award)

	OPTIONAL MATCH (ceremony)-[categoryRel:PRESENTS_CATEGORY]->
		(category:AwardCeremonyCategory)

	OPTIONAL MATCH (category)-[nomineeEntityRel:HAS_NOMINEE]->(nomineeEntity)
		WHERE
			(nomineeEntity:Person AND nomineeEntityRel.nominatedCompanyUuid IS NULL) OR
			nomineeEntity:Company

	WITH ceremony, award, categoryRel, category, nomineeEntityRel,
		COLLECT(nomineeEntity {
			model: TOUPPER(HEAD(LABELS(nomineeEntity))),
			.uuid,
			.name,
			nominatedMemberUuids: nomineeEntityRel.nominatedMemberUuids
		}) AS nomineeEntities

	UNWIND (CASE nomineeEntities WHEN [] THEN [null] ELSE nomineeEntities END) AS nomineeEntity

		UNWIND (COALESCE(nomineeEntity.nominatedMemberUuids, [null])) AS nominatedMemberUuid

			OPTIONAL MATCH (category)-[nominatedMemberRel:HAS_NOMINEE]->
				(nominatedMember:Person { uuid: nominatedMemberUuid })
				WHERE
					nomineeEntityRel.nominationPosition IS NULL OR
					nomineeEntityRel.nominationPosition = nominatedMemberRel.nominationPosition

			WITH ceremony, award, categoryRel, category, nomineeEntityRel, nomineeEntity, nominatedMember
				ORDER BY nominatedMemberRel.memberPosition

			WITH ceremony, award, categoryRel, category, nomineeEntityRel, nomineeEntity,
				COLLECT(nominatedMember { model: 'PERSON', .uuid, .name }) AS nominatedMembers

	WITH ceremony, award, categoryRel, category, nomineeEntityRel, nomineeEntity, nominatedMembers
		ORDER BY nomineeEntityRel.nominationPosition, nomineeEntityRel.entityPosition

	WITH
		ceremony,
		award,
		categoryRel,
		category,
		nomineeEntityRel.nominationPosition AS nominationPosition,
		[nomineeEntity IN COLLECT(
			CASE nomineeEntity WHEN NULL
				THEN null
				ELSE nomineeEntity { .model, .uuid, .name, members: nominatedMembers }
			END
		) | CASE nomineeEntity.model WHEN 'COMPANY'
			THEN nomineeEntity
			ELSE nomineeEntity { .model, .uuid, .name }
		END] AS nomineeEntities

	WITH ceremony, award, categoryRel, category,
		COLLECT(
			CASE SIZE(nomineeEntities) WHEN 0
				THEN null
				ELSE {
					model: 'NOMINATION',
					entities: nomineeEntities
				}
			END
		) AS nominations
		ORDER BY categoryRel.position

	RETURN
		'AWARD_CEREMONY' AS model,
		ceremony.uuid AS uuid,
		ceremony.name AS name,
		CASE award WHEN NULL THEN null ELSE award { model: 'AWARD', .uuid, .name } END AS award,
		COLLECT(
			CASE category WHEN NULL
				THEN null
				ELSE category { model: 'AWARD_CEREMONY_CATEGORY', .name, nominations }
			END
		) AS categories
`;

const getListQuery = () => `
	MATCH (ceremony:AwardCeremony)

	OPTIONAL MATCH (ceremony)<-[:PRESENTED_AT]-(award:Award)

	RETURN
		'AWARD_CEREMONY' AS model,
		ceremony.uuid AS uuid,
		ceremony.name AS name,
		CASE award WHEN NULL THEN null ELSE award { model: 'AWARD', .uuid, .name } END AS award

	ORDER BY ceremony.name DESC, award.name

	LIMIT 100
`;

export {
	getAwardContextualDuplicateRecordCountQuery,
	getCreateQuery,
	getEditQuery,
	getUpdateQuery,
	getShowQuery,
	getListQuery
};
