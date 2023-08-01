export default () => `
	MATCH (material:Material { uuid: $uuid })

	CALL {
		WITH material

		OPTIONAL MATCH (material)-[:HAS_SUB_MATERIAL*0..2]-(nominatedMaterial:Material)
			<-[nomineeRel:HAS_NOMINEE]-(category:AwardCeremonyCategory)
			<-[categoryRel:PRESENTS_CATEGORY]-(ceremony:AwardCeremony)
	 		WHERE (
				(material)-[:HAS_SUB_MATERIAL*0..2]->(nominatedMaterial) OR
				(material)<-[:HAS_SUB_MATERIAL*0..2]-(nominatedMaterial)
			)

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
			material,
			nomineeRel,
			category,
			categoryRel,
			ceremony,
			nominatedEntityRel,
			CASE WHEN material <> nominatedMaterial
				THEN nominatedMaterial { model: 'MATERIAL', .uuid, .name, .format, .year }
				ELSE null
			END AS recipientMaterial,
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
					material,
					recipientMaterial,
					nomineeRel,
					category,
					categoryRel,
					ceremony,
					nominatedEntityRel,
					nominatedEntity,
					nominatedMember
					ORDER BY nominatedMemberRel.memberPosition

				WITH
					material,
					recipientMaterial,
					nomineeRel,
					category,
					categoryRel,
					ceremony,
					nominatedEntityRel,
					nominatedEntity,
					COLLECT(nominatedMember { model: 'PERSON', .uuid, .name }) AS nominatedMembers

		WITH
			material,
			recipientMaterial,
			nomineeRel,
			category,
			categoryRel,
			ceremony,
			nominatedEntityRel,
			nominatedEntity,
			nominatedMembers
			ORDER BY nominatedEntityRel.nominationPosition, nominatedEntityRel.entityPosition

		WITH material, recipientMaterial, nomineeRel, category, categoryRel, ceremony,
			COLLECT(
				CASE WHEN nominatedEntity IS NULL
					THEN null
					ELSE nominatedEntity { .model, .uuid, .name, members: nominatedMembers }
				END
			) AS nominatedEntities

		WITH material, recipientMaterial, nomineeRel, category, categoryRel, ceremony,
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

		OPTIONAL MATCH (surProduction)<-[:HAS_SUB_PRODUCTION]-(surSurProduction:Production)

		WITH
			material,
			recipientMaterial,
			nomineeRel,
			category,
			categoryRel,
			ceremony,
			nominatedEntities,
			nominatedProductionRel,
			nominatedProduction,
			venue,
			surVenue,
			surProduction,
			surSurProduction
			ORDER BY nominatedProductionRel.productionPosition

		WITH material, recipientMaterial, nomineeRel, category, categoryRel, ceremony, nominatedEntities,
			COLLECT(
				CASE WHEN nominatedProduction IS NULL
					THEN null
					ELSE nominatedProduction {
						model: 'PRODUCTION',
						.uuid,
						.name,
						.startDate,
						.endDate,
						venue: CASE WHEN venue IS NULL
							THEN null
							ELSE venue {
								model: 'VENUE',
								.uuid,
								.name,
								surVenue: CASE WHEN surVenue IS NULL
									THEN null
									ELSE surVenue { model: 'VENUE', .uuid, .name }
								END
							}
						END,
						surProduction: CASE WHEN surProduction IS NULL
							THEN null
							ELSE surProduction {
								model: 'PRODUCTION',
								.uuid,
								.name,
								surProduction: CASE WHEN surSurProduction IS NULL
									THEN null
									ELSE surSurProduction { model: 'PRODUCTION', .uuid, .name }
								END
							}
						END
					}
				END
			) AS nominatedProductions

		OPTIONAL MATCH (category)-[coNominatedMaterialRel:HAS_NOMINEE]->(coNominatedMaterial:Material)
			WHERE
				(
					nomineeRel.nominationPosition IS NULL OR
					nomineeRel.nominationPosition = coNominatedMaterialRel.nominationPosition
				) AND
				coNominatedMaterial.uuid <> material.uuid AND
				NOT EXISTS((material)-[:HAS_SUB_MATERIAL*1..2]-(coNominatedMaterial))

		WITH
			recipientMaterial,
			nomineeRel,
			category,
			categoryRel,
			ceremony,
			nominatedEntities,
			nominatedProductions,
			coNominatedMaterialRel,
			coNominatedMaterial
			ORDER BY coNominatedMaterialRel.materialPosition

		OPTIONAL MATCH (coNominatedMaterial)<-[:HAS_SUB_MATERIAL]-(coNominatedMaterialSurMaterial:Material)

		OPTIONAL MATCH (coNominatedMaterialSurMaterial)<-[:HAS_SUB_MATERIAL]-(coNominatedMaterialSurSurMaterial:Material)

		WITH recipientMaterial, nomineeRel, category, categoryRel, ceremony, nominatedEntities, nominatedProductions,
			COLLECT(
				CASE WHEN coNominatedMaterial IS NULL
					THEN null
					ELSE coNominatedMaterial {
						model: 'MATERIAL',
						.uuid,
						.name,
						.format,
						.year,
						surMaterial: CASE WHEN coNominatedMaterialSurMaterial IS NULL
							THEN null
							ELSE coNominatedMaterialSurMaterial {
								model: 'MATERIAL',
								.uuid,
								.name,
								surMaterial: CASE WHEN coNominatedMaterialSurSurMaterial IS NULL
									THEN null
									ELSE coNominatedMaterialSurSurMaterial { model: 'MATERIAL', .uuid, .name }
								END
							}
						END
					}
				END
			) AS coNominatedMaterials
			ORDER BY nomineeRel.nominationPosition, nomineeRel.materialPosition

		WITH
			nomineeRel.isWinner AS isWinner,
			nomineeRel.customType AS customType,
			category,
			categoryRel,
			ceremony,
			nominatedEntities,
			nominatedProductions,
			coNominatedMaterials,
			COLLECT(recipientMaterial) AS recipientMaterials

		WITH category, categoryRel, ceremony,
			COLLECT({
				model: 'NOMINATION',
				isWinner: COALESCE(isWinner, false),
				type: COALESCE(customType, CASE WHEN isWinner THEN 'Winner' ELSE 'Nomination' END),
				recipientMaterials: recipientMaterials,
				entities: nominatedEntities,
				productions: nominatedProductions,
				coMaterials: coNominatedMaterials
			}) AS nominations
			ORDER BY categoryRel.position

		WITH ceremony, COLLECT(category { model: 'AWARD_CEREMONY_CATEGORY', .name, nominations }) AS categories
			ORDER BY ceremony.name DESC

		OPTIONAL MATCH (ceremony)<-[:PRESENTED_AT]-(award:Award)

		WITH award, COLLECT(ceremony { model: 'AWARD_CEREMONY', .uuid, .name, categories }) AS ceremonies
			ORDER BY award.name

		RETURN
			COLLECT(award { model: 'AWARD', .uuid, .name, ceremonies }) AS awards
	}

	RETURN
		awards
`;
