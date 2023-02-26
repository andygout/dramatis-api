export default () => `
	MATCH (production:Production { uuid: $uuid })

	OPTIONAL MATCH (production)-[:HAS_SUB_PRODUCTION*0..1]-(productionLinkedToCategory:Production)
		<-[nomineeRel:HAS_NOMINEE]-(category:AwardCeremonyCategory)
		<-[categoryRel:PRESENTS_CATEGORY]-(ceremony:AwardCeremony)

	OPTIONAL MATCH (productionLinkedToCategory)-[:PLAYS_AT]->(productionLinkedToCategoryVenue:Venue)

	OPTIONAL MATCH (productionLinkedToCategoryVenue)<-[:HAS_SUB_VENUE]-(productionLinkedToCategorySurVenue:Venue)

	OPTIONAL MATCH (ceremony)<-[:PRESENTED_AT]-(award:Award)

	OPTIONAL MATCH (category)-[nominatedEntityRel:HAS_NOMINEE]->(nominatedEntity)
		WHERE
			(
				(nominatedEntity:Person AND nominatedEntityRel.nominatedCompanyUuid IS NULL) OR
				nominatedEntity:Company
			) AND
			(
				nomineeRel.nominationPosition IS NULL OR
				nomineeRel.nominationPosition = nominatedEntityRel.nominationPosition
			)

	WITH
		production,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		award,
		nominatedEntityRel,
		CASE WHEN production <> productionLinkedToCategory
			THEN productionLinkedToCategory {
				model: 'PRODUCTION',
				.uuid,
				.name,
				.startDate,
				.endDate,
				venue: CASE productionLinkedToCategoryVenue WHEN NULL
					THEN null
					ELSE productionLinkedToCategoryVenue {
						model: 'VENUE',
						.uuid,
						.name,
						surVenue: CASE productionLinkedToCategorySurVenue WHEN NULL
							THEN null
							ELSE productionLinkedToCategorySurVenue { model: 'VENUE', .uuid, .name }
						END
					}
				END
			}
			ELSE null
		END AS recipientProduction,
		COLLECT(nominatedEntity {
			model: TOUPPER(HEAD(LABELS(nominatedEntity))),
			.uuid,
			.name,
			nominatedMemberUuids: nominatedEntityRel.nominatedMemberUuids
		}) AS nominatedEntities

	UNWIND (CASE nominatedEntities WHEN [] THEN [null] ELSE nominatedEntities END) AS nominatedEntity

		UNWIND (COALESCE(nominatedEntity.nominatedMemberUuids, [null])) AS nominatedMemberUuid

			OPTIONAL MATCH (category)-[nominatedMemberRel:HAS_NOMINEE]->
				(nominatedMember:Person { uuid: nominatedMemberUuid })
				WHERE
					nominatedEntityRel.nominationPosition IS NULL OR
					nominatedEntityRel.nominationPosition = nominatedMemberRel.nominationPosition

			WITH
				production,
				recipientProduction,
				nomineeRel,
				category,
				categoryRel,
				ceremony,
				award,
				nominatedEntityRel,
				nominatedEntity,
				nominatedMember
				ORDER BY nominatedMemberRel.memberPosition

			WITH
				production,
				recipientProduction,
				nomineeRel,
				category,
				categoryRel,
				ceremony,
				award,
				nominatedEntityRel,
				nominatedEntity,
				COLLECT(nominatedMember { model: 'PERSON', .uuid, .name }) AS nominatedMembers

	WITH
		production,
		recipientProduction,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		award,
		nominatedEntityRel,
		nominatedEntity,
		nominatedMembers
		ORDER BY nominatedEntityRel.nominationPosition, nominatedEntityRel.entityPosition

	WITH production, recipientProduction, nomineeRel, category, categoryRel, ceremony, award,
		COLLECT(
			CASE nominatedEntity WHEN NULL
				THEN null
				ELSE nominatedEntity { .model, .uuid, .name, members: nominatedMembers }
			END
		) AS nominatedEntities

	WITH production, recipientProduction, nomineeRel, category, categoryRel, ceremony, award,
		[nominatedEntity IN nominatedEntities | CASE nominatedEntity.model WHEN 'COMPANY'
			THEN nominatedEntity
			ELSE nominatedEntity { .model, .uuid, .name }
		END] AS nominatedEntities

	OPTIONAL MATCH (category)-[coNominatedProductionRel:HAS_NOMINEE]->(coNominatedProduction:Production)
		WHERE
			(
				nomineeRel.nominationPosition IS NULL OR
				nomineeRel.nominationPosition = coNominatedProductionRel.nominationPosition
			) AND
			coNominatedProduction.uuid <> production.uuid AND
			NOT EXISTS((production)-[:HAS_SUB_PRODUCTION]-(coNominatedProduction))

	OPTIONAL MATCH (coNominatedProduction)-[:PLAYS_AT]->(coNominatedProductionVenue:Venue)

	OPTIONAL MATCH (coNominatedProductionVenue)<-[:HAS_SUB_VENUE]-(coNominatedProductionSurVenue:Venue)

	OPTIONAL MATCH (coNominatedProduction)<-[:HAS_SUB_PRODUCTION]-(coNominatedProductionSurProduction:Production)

	WITH
		recipientProduction,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		award,
		nominatedEntities,
		coNominatedProductionRel,
		coNominatedProduction,
		coNominatedProductionVenue,
		coNominatedProductionSurVenue,
		coNominatedProductionSurProduction
		ORDER BY coNominatedProductionRel.productionPosition

	WITH recipientProduction, nomineeRel, category, categoryRel, ceremony, award, nominatedEntities,
		COLLECT(
			CASE coNominatedProduction WHEN NULL
				THEN null
				ELSE coNominatedProduction {
					model: 'PRODUCTION',
					.uuid,
					.name,
					.startDate,
					.endDate,
					venue: CASE coNominatedProductionVenue WHEN NULL
						THEN null
						ELSE coNominatedProductionVenue {
							model: 'VENUE',
							.uuid,
							.name,
							surVenue: CASE coNominatedProductionSurVenue WHEN NULL
								THEN null
								ELSE coNominatedProductionSurVenue { model: 'VENUE', .uuid, .name }
							END
						}
					END,
					surProduction: CASE coNominatedProductionSurProduction WHEN NULL
						THEN null
						ELSE coNominatedProductionSurProduction { model: 'PRODUCTION', .uuid, .name }
					END
				}
			END
		) AS coNominatedProductions

	OPTIONAL MATCH (category)-[nominatedMaterialRel:HAS_NOMINEE]->(nominatedMaterial:Material)
		WHERE
			(
				nomineeRel.nominationPosition IS NULL OR
				nomineeRel.nominationPosition = nominatedMaterialRel.nominationPosition
			)

	OPTIONAL MATCH (nominatedMaterial)<-[:HAS_SUB_MATERIAL]-(nominatedSurMaterial:Material)

	OPTIONAL MATCH (nominatedSurMaterial)<-[:HAS_SUB_MATERIAL]-(nominatedSurSurMaterial:Material)

	WITH
		recipientProduction,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		award,
		nominatedEntities,
		coNominatedProductions,
		nominatedMaterialRel,
		nominatedMaterial,
		nominatedSurMaterial,
		nominatedSurSurMaterial
		ORDER BY nominatedMaterialRel.materialPosition

	WITH
		recipientProduction,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		award,
		nominatedEntities,
		coNominatedProductions,
		COLLECT(
			CASE nominatedMaterial WHEN NULL
				THEN null
				ELSE nominatedMaterial {
					model: 'MATERIAL',
					.uuid,
					.name,
					.format,
					.year,
					surMaterial: CASE nominatedSurMaterial WHEN NULL
						THEN null
						ELSE nominatedSurMaterial {
							model: 'MATERIAL',
							.uuid,
							.name,
							surMaterial: CASE nominatedSurSurMaterial WHEN NULL
								THEN null
								ELSE nominatedSurSurMaterial { model: 'MATERIAL', .uuid, .name }
							END
						}
					END
				}
			END
		) AS nominatedMaterials
		ORDER BY nomineeRel.nominationPosition

	WITH category, categoryRel, ceremony, award,
		COLLECT({
			model: 'NOMINATION',
			isWinner: COALESCE(nomineeRel.isWinner, false),
			type: COALESCE(nomineeRel.customType, CASE WHEN nomineeRel.isWinner THEN 'Winner' ELSE 'Nomination' END),
			recipientProduction: CASE recipientProduction WHEN NULL THEN null ELSE recipientProduction END,
			entities: nominatedEntities,
			coProductions: coNominatedProductions,
			materials: nominatedMaterials
		}) AS nominations
		ORDER BY categoryRel.position

	WITH ceremony, award,
		COLLECT(category { model: 'AWARD_CEREMONY_CATEGORY', .name, nominations }) AS categories
		ORDER BY ceremony.name DESC

	WITH award,
		COLLECT(ceremony { model: 'AWARD_CEREMONY', .uuid, .name, categories }) AS ceremonies
		ORDER BY award.name

	RETURN
		COLLECT(award { model: 'AWARD', .uuid, .name, ceremonies }) AS awards
`;
