export default () => `
	MATCH (ceremony:AwardCeremony { uuid: $uuid })

	OPTIONAL MATCH (ceremony)<-[:PRESENTED_AT]-(award:Award)

	OPTIONAL MATCH (ceremony)-[categoryRel:PRESENTS_CATEGORY]->(category:AwardCeremonyCategory)

	OPTIONAL MATCH (category)-[nomineeRel:HAS_NOMINEE]->(nominee)
		WHERE
			(nominee:Person AND nomineeRel.nominatedCompanyUuid IS NULL) OR
			nominee:Company OR
			nominee:Production OR
			nominee:Material

	WITH ceremony, award, categoryRel, category, nomineeRel,
		COLLECT(nominee {
			model: TOUPPER(HEAD(LABELS(nominee))),
			.uuid,
			.name,
			.differentiator,
			nominatedMemberUuids: nomineeRel.nominatedMemberUuids
		}) AS nominees

	UNWIND (CASE nominees WHEN [] THEN [null] ELSE nominees END) AS nominee

		UNWIND (COALESCE(nominee.nominatedMemberUuids, [null])) AS nominatedMemberUuid

			OPTIONAL MATCH (category)-[nominatedMemberRel:HAS_NOMINEE]->
				(nominatedMember:Person { uuid: nominatedMemberUuid })
				WHERE
					nomineeRel.nominationPosition IS NULL OR
					nomineeRel.nominationPosition = nominatedMemberRel.nominationPosition

			WITH ceremony, award, categoryRel, category, nomineeRel, nominee, nominatedMember
				ORDER BY nominatedMemberRel.memberPosition

			WITH ceremony, award, categoryRel, category, nomineeRel, nominee,
				COLLECT(nominatedMember { .name, .differentiator }) + [{}] AS nominatedMembers

	WITH ceremony, award, categoryRel, category, nomineeRel, nominee, nominatedMembers
		ORDER BY
			nomineeRel.nominationPosition,
			nomineeRel.entityPosition,
			nomineeRel.productionPosition,
			nomineeRel.materialPosition

	WITH
		ceremony,
		award,
		categoryRel,
		category,
		nomineeRel.nominationPosition AS nominationPosition,
		nomineeRel.isWinner AS isWinner,
		nomineeRel.customType AS customType,
		COLLECT(
			CASE WHEN nominee IS NULL
				THEN null
				ELSE nominee { .model, .uuid, .name, .differentiator, members: nominatedMembers }
			END
		) AS nominees

	WITH
		ceremony,
		award,
		categoryRel,
		category,
		nominationPosition,
		isWinner,
		customType,
		[nominee IN nominees | CASE nominee.model
			WHEN 'COMPANY' THEN nominee { .model, .name, .differentiator, .members }
			WHEN 'PERSON' THEN nominee { .model, .name, .differentiator }
			WHEN 'PRODUCTION' THEN nominee { .model, .uuid }
			WHEN 'MATERIAL' THEN nominee { .model, .name, .differentiator }
		END] + [{}] AS nominees

	WITH
		ceremony,
		award,
		categoryRel,
		category,
		isWinner,
		customType,
		[nominee IN nominees WHERE nominee.model = 'PERSON' OR nominee.model = 'COMPANY'] + [{}] AS nomineeEntities,
		[nominee IN nominees WHERE nominee.model = 'PRODUCTION'] + [{ uuid: '' }] AS nomineeProductions,
		[nominee IN nominees WHERE nominee.model = 'MATERIAL'] + [{}] AS nomineeMaterials

	WITH ceremony, award, categoryRel, category,
		COLLECT(
			CASE WHEN SIZE(nomineeEntities) = 1 AND SIZE(nomineeProductions) = 1 AND SIZE(nomineeMaterials) = 1
				THEN null
				ELSE {
					isWinner: COALESCE(isWinner, false),
					customType: customType,
					entities: nomineeEntities,
					productions: nomineeProductions,
					materials: nomineeMaterials
				}
			END
		) + [{ entities: [{}], productions: [{ uuid: '' }], materials: [{}] }] AS nominations
		ORDER BY categoryRel.position

	RETURN
		ceremony.uuid AS uuid,
		ceremony.name AS name,
		{ name: COALESCE(award.name, ''), differentiator: COALESCE(award.differentiator, '') } AS award,
		COLLECT(
			CASE WHEN category IS NULL
				THEN null
				ELSE category { .name, nominations }
			END
		) + [{
			nominations: [{
				entities: [{}],
				productions: [{ uuid: '' }],
				materials: [{}]
			}]
		}] AS categories
`;
