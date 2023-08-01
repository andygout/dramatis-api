export default () => `
	MATCH (company:Company { uuid: $uuid })

	CALL {
		WITH company

		OPTIONAL MATCH (company)
			<-[:HAS_WRITING_ENTITY]-(creditingMaterial:Material)-[:HAS_SUB_MATERIAL*0..2]-(originalVersionMaterial:Material)
			<-[:SUBSEQUENT_VERSION_OF]-(subsequentVersionMaterial:Material)
				-[:HAS_SUB_MATERIAL*0..2]-(nominatedSubsequentVersionMaterial:Material)
			<-[nomineeRel:HAS_NOMINEE]-(category:AwardCeremonyCategory)
			<-[categoryRel:PRESENTS_CATEGORY]-(ceremony:AwardCeremony)
			WHERE
				(
					(creditingMaterial)-[:HAS_SUB_MATERIAL*0..2]->(originalVersionMaterial) AND
					(subsequentVersionMaterial)-[:HAS_SUB_MATERIAL*0..2]->(nominatedSubsequentVersionMaterial)
				) OR (
					(creditingMaterial)<-[:HAS_SUB_MATERIAL*0..2]-(originalVersionMaterial) AND
					(subsequentVersionMaterial)<-[:HAS_SUB_MATERIAL*0..2]-(nominatedSubsequentVersionMaterial)
				) OR (
					(creditingMaterial)-[:HAS_SUB_MATERIAL*0..2]->(originalVersionMaterial) AND
					(subsequentVersionMaterial)<-[:HAS_SUB_MATERIAL*0..2]-(nominatedSubsequentVersionMaterial)
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

		WITH nominatedSubsequentVersionMaterial, nomineeRel, category, categoryRel, ceremony, nominatedEntityRel,
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
					nominatedSubsequentVersionMaterial,
					nomineeRel,
					category,
					categoryRel,
					ceremony,
					nominatedEntityRel,
					nominatedEntity,
					nominatedMember
					ORDER BY nominatedMemberRel.memberPosition

				WITH
					nominatedSubsequentVersionMaterial,
					nomineeRel,
					category,
					categoryRel,
					ceremony,
					nominatedEntityRel,
					nominatedEntity,
					COLLECT(nominatedMember { model: 'PERSON', .uuid, .name }) AS nominatedMembers

		WITH
			nominatedSubsequentVersionMaterial,
			nomineeRel,
			category,
			categoryRel,
			ceremony,
			nominatedEntityRel,
			nominatedEntity,
			nominatedMembers
			ORDER BY nominatedEntityRel.nominationPosition, nominatedEntityRel.entityPosition

		WITH nominatedSubsequentVersionMaterial, nomineeRel, category, categoryRel, ceremony,
			COLLECT(
				CASE WHEN nominatedEntity IS NULL
					THEN null
					ELSE nominatedEntity { .model, .uuid, .name, members: nominatedMembers }
				END
			) AS nominatedEntities

		WITH nominatedSubsequentVersionMaterial, nomineeRel, category, categoryRel, ceremony,
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
			nominatedSubsequentVersionMaterial,
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

		WITH nominatedSubsequentVersionMaterial, nomineeRel, category, categoryRel, ceremony, nominatedEntities,
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

		OPTIONAL MATCH (category)-[nominatedMaterialRel:HAS_NOMINEE]->(nominatedMaterial:Material)
			WHERE
				(
					nomineeRel.nominationPosition IS NULL OR
					nomineeRel.nominationPosition = nominatedMaterialRel.nominationPosition
				) AND
				nominatedMaterialRel.uuid <> nominatedSubsequentVersionMaterial.uuid

		OPTIONAL MATCH (nominatedMaterial)<-[:HAS_SUB_MATERIAL]-(nominatedSurMaterial:Material)

		WITH
			nominatedSubsequentVersionMaterial,
			nomineeRel,
			category,
			categoryRel,
			ceremony,
			nominatedEntities,
			nominatedProductions,
			nominatedMaterialRel,
			nominatedMaterial,
			nominatedSurMaterial
			ORDER BY nominatedMaterialRel.materialPosition

		WITH
			nominatedSubsequentVersionMaterial,
			nomineeRel,
			category,
			categoryRel,
			ceremony,
			nominatedEntities,
			nominatedProductions,
			COLLECT(
				CASE WHEN nominatedMaterial IS NULL
					THEN null
					ELSE nominatedMaterial {
						model: 'MATERIAL',
						.uuid,
						.name,
						.format,
						.year,
						surMaterial: CASE WHEN nominatedSurMaterial IS NULL
							THEN null
							ELSE nominatedSurMaterial { model: 'MATERIAL', .uuid, .name }
						END
					}
				END
			) AS nominatedMaterials
			ORDER BY nomineeRel.nominationPosition, nomineeRel.materialPosition

		OPTIONAL MATCH (nominatedSubsequentVersionMaterial)
			<-[:HAS_SUB_MATERIAL]-(nominatedSubsequentVersionSurMaterial:Material)

		OPTIONAL MATCH (nominatedSubsequentVersionSurMaterial)
			<-[:HAS_SUB_MATERIAL]-(nominatedSubsequentVersionSurSurMaterial:Material)

		WITH
			nomineeRel.isWinner AS isWinner,
			nomineeRel.customType AS customType,
			nomineeRel,
			category,
			categoryRel,
			ceremony,
			nominatedEntities,
			nominatedProductions,
			nominatedMaterials,
			COLLECT(
				CASE WHEN nominatedSubsequentVersionMaterial IS NULL
					THEN null
					ELSE nominatedSubsequentVersionMaterial {
						model: 'MATERIAL',
						.uuid,
						.name,
						.format,
						.year,
						surMaterial: CASE WHEN nominatedSubsequentVersionSurMaterial IS NULL
							THEN null
							ELSE nominatedSubsequentVersionSurMaterial {
								model: 'MATERIAL',
								.uuid,
								.name,
								surMaterial: CASE WHEN nominatedSubsequentVersionSurSurMaterial IS NULL
									THEN null
									ELSE nominatedSubsequentVersionSurSurMaterial { model: 'MATERIAL', .uuid, .name }
								END
							}
						END
					}
				END
			) AS nominatedSubsequentVersionMaterials

		WITH category, categoryRel, ceremony,
			COLLECT({
				model: 'NOMINATION',
				isWinner: COALESCE(isWinner, false),
				type: COALESCE(customType, CASE WHEN isWinner THEN 'Winner' ELSE 'Nomination' END),
				entities: nominatedEntities,
				productions: nominatedProductions,
				materials: nominatedMaterials,
				recipientSubsequentVersionMaterials: nominatedSubsequentVersionMaterials
			}) AS nominations
			ORDER BY categoryRel.position

		WITH ceremony, COLLECT(category { model: 'AWARD_CEREMONY_CATEGORY', .name, nominations }) AS categories
			ORDER BY ceremony.name DESC

		OPTIONAL MATCH (ceremony)<-[:PRESENTED_AT]-(award:Award)

		WITH award, COLLECT(ceremony { model: 'AWARD_CEREMONY', .uuid, .name, categories }) AS ceremonies
			ORDER BY award.name

		RETURN
			COLLECT(award { model: 'AWARD', .uuid, .name, ceremonies }) AS subsequentVersionMaterialAwards
	}

	RETURN
		subsequentVersionMaterialAwards
`;
