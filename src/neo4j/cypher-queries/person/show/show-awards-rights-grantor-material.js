export default () => `
	MATCH (person:Person { uuid: $uuid })

	OPTIONAL MATCH (person)
		<-[:HAS_WRITING_ENTITY { creditType: 'RIGHTS_GRANTOR' }]-(nominatedRightsGrantorMaterial:Material)
		<-[nomineeRel:HAS_NOMINEE]-(category:AwardCeremonyCategory)
		<-[categoryRel:PRESENTS_CATEGORY]-(ceremony:AwardCeremony)

	OPTIONAL MATCH (nominatedRightsGrantorMaterial)<-[:HAS_SUB_MATERIAL]-(nominatedRightsGrantorSurMaterial:Material)

	OPTIONAL MATCH (ceremony)<-[:PRESENTED_AT]-(rightsGrantorMaterialAward:Award)

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
		nominatedRightsGrantorMaterial,
		nominatedRightsGrantorSurMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		rightsGrantorMaterialAward,
		nominatedEntityRel,
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
				nominatedRightsGrantorMaterial,
				nominatedRightsGrantorSurMaterial,
				nomineeRel,
				category,
				categoryRel,
				ceremony,
				rightsGrantorMaterialAward,
				nominatedEntityRel,
				nominatedEntity,
				nominatedMember
				ORDER BY nominatedMemberRel.memberPosition

			WITH
				nominatedRightsGrantorMaterial,
				nominatedRightsGrantorSurMaterial,
				nomineeRel,
				category,
				categoryRel,
				ceremony,
				rightsGrantorMaterialAward,
				nominatedEntityRel,
				nominatedEntity,
				COLLECT(nominatedMember { model: 'PERSON', .uuid, .name }) AS nominatedMembers

	WITH
		nominatedRightsGrantorMaterial,
		nominatedRightsGrantorSurMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		rightsGrantorMaterialAward,
		nominatedEntityRel,
		nominatedEntity,
		nominatedMembers
		ORDER BY nominatedEntityRel.nominationPosition, nominatedEntityRel.entityPosition

	WITH
		nominatedRightsGrantorMaterial,
		nominatedRightsGrantorSurMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		rightsGrantorMaterialAward,
		COLLECT(
			CASE nominatedEntity WHEN NULL
				THEN null
				ELSE nominatedEntity { .model, .uuid, .name, members: nominatedMembers }
			END
		) AS nominatedEntities

	WITH
		nominatedRightsGrantorMaterial,
		nominatedRightsGrantorSurMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		rightsGrantorMaterialAward,
		[nominatedEntity IN nominatedEntities | CASE nominatedEntity.model WHEN 'COMPANY'
			THEN nominatedEntity
			ELSE nominatedEntity { .model, .uuid, .name }
		END] AS nominatedEntities

	OPTIONAL MATCH (category)-[nominatedProductionRel:HAS_NOMINEE]->(nominatedProduction:Production)
		WHERE
			(
				nomineeRel.nominationPosition IS NULL OR
				nomineeRel.nominationPosition = nominatedProductionRel.nominationPosition
			)

	OPTIONAL MATCH (nominatedProduction)-[:PLAYS_AT]->(venue:Venue)

	OPTIONAL MATCH (venue)<-[:HAS_SUB_VENUE]-(surVenue:Venue)

	OPTIONAL MATCH (nominatedProduction)<-[:HAS_SUB_PRODUCTION]-(surProduction:Production)

	WITH
		nominatedRightsGrantorMaterial,
		nominatedRightsGrantorSurMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		rightsGrantorMaterialAward,
		nominatedEntities,
		nominatedProductionRel,
		nominatedProduction,
		venue,
		surVenue,
		surProduction
		ORDER BY nominatedProductionRel.productionPosition

	WITH
		nominatedRightsGrantorMaterial,
		nominatedRightsGrantorSurMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		rightsGrantorMaterialAward,
		nominatedEntities,
		COLLECT(
			CASE nominatedProduction WHEN NULL
				THEN null
				ELSE nominatedProduction {
					model: 'PRODUCTION',
					.uuid,
					.name,
					.startDate,
					.endDate,
					venue: CASE venue WHEN NULL
						THEN null
						ELSE venue {
							model: 'VENUE',
							.uuid,
							.name,
							surVenue: CASE surVenue WHEN NULL
								THEN null
								ELSE surVenue { model: 'VENUE', .uuid, .name }
							END
						}
					END,
					surProduction: CASE surProduction WHEN NULL
						THEN null
						ELSE surProduction { model: 'PRODUCTION', .uuid, .name }
					END
				}
			END
		) AS nominatedProductions

	OPTIONAL MATCH (category)-[nominatedMaterialRel:HAS_NOMINEE]->(nominatedMaterial:Material)
		WHERE
			(
				nomineeRel.nominationPosition IS NULL OR
				nomineeRel.nominationPosition = nominatedMaterialRel.nominationPosition
			) AND
			nominatedMaterialRel.uuid <> nominatedRightsGrantorMaterial.uuid

	OPTIONAL MATCH (nominatedMaterial)<-[:HAS_SUB_MATERIAL]-(nominatedSurMaterial:Material)

	WITH
		nominatedRightsGrantorMaterial,
		nominatedRightsGrantorSurMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		rightsGrantorMaterialAward,
		nominatedEntities,
		nominatedProductions,
		nominatedMaterialRel,
		nominatedMaterial,
		nominatedSurMaterial
		ORDER BY nominatedMaterialRel.materialPosition

	WITH
		nominatedRightsGrantorMaterial,
		nominatedRightsGrantorSurMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		rightsGrantorMaterialAward,
		nominatedEntities,
		nominatedProductions,
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
						ELSE nominatedSurMaterial { model: 'MATERIAL', .uuid, .name }
					END
				}
			END
		) AS nominatedMaterials
		ORDER BY nomineeRel.nominationPosition, nomineeRel.materialPosition

	WITH
		nomineeRel.isWinner AS isWinner,
		nomineeRel.customType AS customType,
		category,
		categoryRel,
		ceremony,
		rightsGrantorMaterialAward,
		nominatedEntities,
		nominatedProductions,
		nominatedMaterials,
		COLLECT(
			CASE nominatedRightsGrantorMaterial WHEN NULL
				THEN null
				ELSE nominatedRightsGrantorMaterial {
					model: 'MATERIAL',
					.uuid,
					.name,
					.format,
					.year,
					surMaterial: CASE nominatedRightsGrantorSurMaterial WHEN NULL
						THEN null
						ELSE nominatedRightsGrantorSurMaterial { model: 'MATERIAL', .uuid, .name }
					END
				}
			END
		) AS nominatedRightsGrantorMaterials

	WITH
		category,
		categoryRel,
		ceremony,
		rightsGrantorMaterialAward,
		COLLECT({
			model: 'NOMINATION',
			isWinner: COALESCE(isWinner, false),
			type: COALESCE(customType, CASE WHEN isWinner THEN 'Winner' ELSE 'Nomination' END),
			entities: nominatedEntities,
			productions: nominatedProductions,
			materials: nominatedMaterials,
			rightsGrantorMaterials: nominatedRightsGrantorMaterials
		}) AS nominations
		ORDER BY categoryRel.position

	WITH
		ceremony,
		rightsGrantorMaterialAward,
		COLLECT(category { model: 'AWARD_CEREMONY_CATEGORY', .name, nominations }) AS categories
		ORDER BY ceremony.name DESC

	WITH
		rightsGrantorMaterialAward,
		COLLECT(ceremony { model: 'AWARD_CEREMONY', .uuid, .name, categories }) AS ceremonies
		ORDER BY rightsGrantorMaterialAward.name

	RETURN
		COLLECT(rightsGrantorMaterialAward { model: 'AWARD', .uuid, .name, ceremonies }) AS rightsGrantorMaterialAwards
`;
