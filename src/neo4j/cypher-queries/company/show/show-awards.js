export default () => `
	MATCH (company:Company { uuid: $uuid })

	OPTIONAL MATCH path=(company)
		<-[:HAS_WRITING_ENTITY*0..1]-()<-[nomineeRel:HAS_NOMINEE]-(category:AwardCeremonyCategory)
		<-[categoryRel:PRESENTS_CATEGORY]-(ceremony:AwardCeremony)
	WHERE
		(NONE(rel IN RELATIONSHIPS(path)
			WHERE COALESCE(rel.creditType IN ['NON_SPECIFIC_SOURCE_MATERIAL', 'RIGHTS_GRANTOR'], false)
		)) AND
		NOT EXISTS(
			(company)<-[:HAS_WRITING_ENTITY]-(:Material)
			<-[:SUBSEQUENT_VERSION_OF]-(:Material)<-[:HAS_NOMINEE]-(category)
		)

	WITH company, nomineeRel, category, categoryRel, ceremony

	UNWIND (CASE WHEN nomineeRel IS NOT NULL AND nomineeRel.nominatedMemberUuids IS NOT NULL
		THEN nomineeRel.nominatedMemberUuids
		ELSE [null]
	END) AS nominatedMemberUuid

		OPTIONAL MATCH (category)-[nominatedMemberRel:HAS_NOMINEE]->
			(nominatedMember:Person { uuid: nominatedMemberUuid })
			WHERE
				nomineeRel.nominationPosition IS NULL OR
				nomineeRel.nominationPosition = nominatedMemberRel.nominationPosition

		WITH company, nomineeRel, category, categoryRel, ceremony, nominatedMember
			ORDER BY nominatedMemberRel.memberPosition

		WITH company, nomineeRel, category, categoryRel, ceremony,
			COLLECT(nominatedMember { model: 'PERSON', .uuid, .name }) AS nominatedMembers

	OPTIONAL MATCH (category)-[coNominatedEntityRel:HAS_NOMINEE]->(coNominatedEntity)
		WHERE
			(coNominatedEntity:Person OR coNominatedEntity:Company) AND
			coNominatedEntityRel.nominatedCompanyUuid IS NULL AND
			(
				nomineeRel.nominationPosition IS NULL OR
				nomineeRel.nominationPosition = coNominatedEntityRel.nominationPosition
			) AND
			coNominatedEntity.uuid <> company.uuid

	UNWIND (CASE WHEN coNominatedEntityRel IS NOT NULL AND coNominatedEntityRel.nominatedMemberUuids IS NOT NULL
		THEN [uuid IN coNominatedEntityRel.nominatedMemberUuids]
		ELSE [null]
	END) AS coNominatedCompanyNominatedMemberUuid

		OPTIONAL MATCH (category)-[coNominatedCompanyNominatedMemberRel:HAS_NOMINEE]->
			(coNominatedCompanyNominatedMember:Person { uuid: coNominatedCompanyNominatedMemberUuid })
			WHERE
				coNominatedEntityRel.nominationPosition IS NULL OR
				coNominatedEntityRel.nominationPosition = coNominatedCompanyNominatedMemberRel.nominationPosition

		WITH
			nominatedMembers,
			nomineeRel,
			category,
			categoryRel,
			ceremony,
			coNominatedEntityRel,
			coNominatedEntity,
			coNominatedCompanyNominatedMember
			ORDER BY coNominatedCompanyNominatedMemberRel.memberPosition

		WITH nominatedMembers, nomineeRel, category, categoryRel, ceremony, coNominatedEntityRel, coNominatedEntity,
			COLLECT(coNominatedCompanyNominatedMember {
				model: 'PERSON', .uuid, .name
			}) AS coNominatedCompanyNominatedMembers
			ORDER BY coNominatedEntityRel.entityPosition

	WITH nominatedMembers, nomineeRel, category, categoryRel, ceremony,
		COLLECT(
			CASE coNominatedEntity WHEN NULL
				THEN null
				ELSE coNominatedEntity {
					model: TOUPPER(HEAD(LABELS(coNominatedEntity))),
					.uuid,
					.name,
					members: coNominatedCompanyNominatedMembers
				}
			END
		) AS coNominatedEntities

	WITH nominatedMembers, nomineeRel, category, categoryRel, ceremony,
		[coNominatedEntity IN coNominatedEntities | CASE coNominatedEntity.model WHEN 'COMPANY'
			THEN coNominatedEntity
			ELSE coNominatedEntity { .model, .uuid, .name }
		END] AS coNominatedEntities

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
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		nominatedMembers,
		coNominatedEntities,
		nominatedProductionRel,
		nominatedProduction,
		venue,
		surVenue,
		surProduction,
		surSurProduction
		ORDER BY nominatedProductionRel.productionPosition

	WITH nomineeRel, category, categoryRel, ceremony, nominatedMembers, coNominatedEntities,
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
						ELSE surProduction {
							model: 'PRODUCTION',
							.uuid,
							.name,
							surProduction: CASE surSurProduction WHEN NULL
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
			)

	WITH
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		nominatedMembers,
		coNominatedEntities,
		nominatedProductions,
		nominatedMaterialRel,
		nominatedMaterial
		ORDER BY nominatedMaterialRel.materialPosition

	OPTIONAL MATCH (nominatedMaterial)<-[:HAS_SUB_MATERIAL]-(nominatedSurMaterial:Material)

	OPTIONAL MATCH (nominatedSurMaterial)<-[:HAS_SUB_MATERIAL]-(nominatedSurSurMaterial:Material)

	WITH nomineeRel, category, categoryRel, ceremony, nominatedMembers, coNominatedEntities, nominatedProductions,
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

	WITH category, categoryRel, ceremony,
		COLLECT({
			model: 'NOMINATION',
			isWinner: COALESCE(nomineeRel.isWinner, false),
			type: COALESCE(nomineeRel.customType, CASE WHEN nomineeRel.isWinner THEN 'Winner' ELSE 'Nomination' END),
			members: nominatedMembers,
			coEntities: coNominatedEntities,
			productions: nominatedProductions,
			materials: nominatedMaterials
		}) AS nominations
		ORDER BY categoryRel.position

	WITH ceremony, COLLECT(category { model: 'AWARD_CEREMONY_CATEGORY', .name, nominations }) AS categories
		ORDER BY ceremony.name DESC

	OPTIONAL MATCH (ceremony)<-[:PRESENTED_AT]-(award:Award)

	WITH award, COLLECT(ceremony { model: 'AWARD_CEREMONY', .uuid, .name, categories }) AS ceremonies
		ORDER BY award.name

	RETURN
		COLLECT(award { model: 'AWARD', .uuid, .name, ceremonies }) AS awards
`;
