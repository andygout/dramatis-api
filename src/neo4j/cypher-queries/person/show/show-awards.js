export default () => `
	MATCH (person:Person { uuid: $uuid })

	OPTIONAL MATCH path=(person)
		<-[:HAS_WRITING_ENTITY*0..1]-()<-[nomineeRel:HAS_NOMINEE]-(category:AwardCeremonyCategory)
		<-[categoryRel:PRESENTS_CATEGORY]-(ceremony:AwardCeremony)
	WHERE
		(NONE(rel IN RELATIONSHIPS(path)
			WHERE COALESCE(rel.creditType IN ['NON_SPECIFIC_SOURCE_MATERIAL', 'RIGHTS_GRANTOR'], false)
		)) AND
		NOT EXISTS(
			(person)<-[:HAS_WRITING_ENTITY]-(:Material)<-[:SUBSEQUENT_VERSION_OF]-(:Material)<-[:HAS_NOMINEE]-(category)
		)

	WITH person, nomineeRel, category, categoryRel, ceremony

	OPTIONAL MATCH (ceremony)<-[:PRESENTED_AT]-(award:Award)

	OPTIONAL MATCH (category)-[nominatedCompanyRel:HAS_NOMINEE]->
		(nominatedEmployerCompany:Company { uuid: nomineeRel.nominatedCompanyUuid })
		WHERE
			nomineeRel.nominationPosition IS NULL OR
			nomineeRel.nominationPosition = nominatedCompanyRel.nominationPosition

	UNWIND (CASE WHEN nominatedCompanyRel IS NOT NULL AND nominatedCompanyRel.nominatedMemberUuids IS NOT NULL
		THEN [uuid IN nominatedCompanyRel.nominatedMemberUuids]
		ELSE [null]
	END) AS coNominatedMemberUuid

		OPTIONAL MATCH (category)-[coNominatedMemberRel:HAS_NOMINEE]->
			(coNominatedMember:Person { uuid: coNominatedMemberUuid })
			WHERE
				coNominatedMember.uuid <> person.uuid AND
				(
					nominatedCompanyRel.nominationPosition IS NULL OR
					nominatedCompanyRel.nominationPosition = coNominatedMemberRel.nominationPosition
				)

		WITH
			person,
			nomineeRel,
			nominatedCompanyRel,
			nominatedEmployerCompany,
			category,
			categoryRel,
			ceremony,
			award,
			coNominatedMember
			ORDER BY coNominatedMemberRel.memberPosition

		WITH
			person,
			nomineeRel,
			nominatedCompanyRel,
			nominatedEmployerCompany,
			category,
			categoryRel,
			ceremony,
			award,
			COLLECT(coNominatedMember { model: 'PERSON', .uuid, .name }) AS coNominatedMembers

	WITH
		person,
		category,
		categoryRel,
		ceremony,
		award,
		CASE nominatedEmployerCompany WHEN NULL
			THEN null
			ELSE nominatedEmployerCompany { model: 'COMPANY', .uuid, .name, coMembers: coNominatedMembers }
		END AS nominatedEmployerCompany,
		COALESCE(nominatedEmployerCompany, person) AS entity,
		COALESCE(nominatedCompanyRel, nomineeRel) AS entityRel

	OPTIONAL MATCH (category)-[coNominatedEntityRel:HAS_NOMINEE]->(coNominatedEntity)
		WHERE
			(coNominatedEntity:Person OR coNominatedEntity:Company) AND
			coNominatedEntityRel.nominatedCompanyUuid IS NULL AND
			(
				entityRel.nominationPosition IS NULL OR
				entityRel.nominationPosition = coNominatedEntityRel.nominationPosition
			) AND
			coNominatedEntity.uuid <> entity.uuid

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
			entityRel,
			nominatedEmployerCompany,
			category,
			categoryRel,
			ceremony,
			award,
			coNominatedEntityRel,
			coNominatedEntity,
			coNominatedCompanyNominatedMember
			ORDER BY coNominatedCompanyNominatedMemberRel.memberPosition

		WITH
			entityRel,
			nominatedEmployerCompany,
			category,
			categoryRel,
			ceremony,
			award,
			coNominatedEntityRel,
			coNominatedEntity,
			COLLECT(coNominatedCompanyNominatedMember {
				model: 'PERSON', .uuid, .name
			}) AS coNominatedCompanyNominatedMembers
			ORDER BY coNominatedEntityRel.entityPosition

	WITH
		entityRel,
		nominatedEmployerCompany,
		category,
		categoryRel,
		ceremony,
		award,
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

	WITH
		entityRel,
		nominatedEmployerCompany,
		category,
		categoryRel,
		ceremony,
		award,
		[coNominatedEntity IN coNominatedEntities | CASE coNominatedEntity.model WHEN 'COMPANY'
			THEN coNominatedEntity
			ELSE coNominatedEntity { .model, .uuid, .name }
		END] AS coNominatedEntities

	OPTIONAL MATCH (category)-[nominatedProductionRel:HAS_NOMINEE]->(nominatedProduction:Production)
		WHERE
			(
				entityRel.nominationPosition IS NULL OR
				entityRel.nominationPosition = nominatedProductionRel.nominationPosition
			)

	OPTIONAL MATCH (nominatedProduction)-[:PLAYS_AT]->(venue:Venue)

	OPTIONAL MATCH (venue)<-[:HAS_SUB_VENUE]-(surVenue:Venue)

	OPTIONAL MATCH (nominatedProduction)<-[:HAS_SUB_PRODUCTION]-(surProduction:Production)

	WITH
		entityRel,
		nominatedEmployerCompany,
		category,
		categoryRel,
		ceremony,
		award,
		coNominatedEntities,
		nominatedProductionRel,
		nominatedProduction,
		venue,
		surVenue,
		surProduction
		ORDER BY nominatedProductionRel.productionPosition

	WITH
		entityRel,
		nominatedEmployerCompany,
		category,
		categoryRel,
		ceremony,
		award,
		coNominatedEntities,
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
				entityRel.nominationPosition IS NULL OR
				entityRel.nominationPosition = nominatedMaterialRel.nominationPosition
			)

	OPTIONAL MATCH (nominatedMaterial)<-[:HAS_SUB_MATERIAL]-(nominatedSurMaterial:Material)

	WITH
		entityRel,
		nominatedEmployerCompany,
		category,
		categoryRel,
		ceremony,
		award,
		coNominatedEntities,
		nominatedProductions,
		nominatedMaterialRel,
		nominatedMaterial,
		nominatedSurMaterial
		ORDER BY nominatedMaterialRel.materialPosition

	WITH
		entityRel,
		nominatedEmployerCompany,
		category,
		categoryRel,
		ceremony,
		award,
		coNominatedEntities,
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
		ORDER BY entityRel.nominationPosition

	WITH
		category,
		categoryRel,
		ceremony,
		award,
		COLLECT({
			model: 'NOMINATION',
			isWinner: COALESCE(entityRel.isWinner, false),
			type: COALESCE(entityRel.customType, CASE WHEN entityRel.isWinner THEN 'Winner' ELSE 'Nomination' END),
			employerCompany: nominatedEmployerCompany,
			coEntities: coNominatedEntities,
			productions: nominatedProductions,
			materials: nominatedMaterials
		}) AS nominations
		ORDER BY categoryRel.position

	WITH
		ceremony,
		award,
		COLLECT(category { model: 'AWARD_CEREMONY_CATEGORY', .name, nominations }) AS categories
		ORDER BY ceremony.name DESC

	WITH
		award,
		COLLECT(ceremony { model: 'AWARD_CEREMONY', .uuid, .name, categories }) AS ceremonies
		ORDER BY award.name

	RETURN
		COLLECT(award { model: 'AWARD', .uuid, .name, ceremonies }) AS awards
`;
