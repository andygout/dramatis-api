export default () => `
	MATCH (company:Company { uuid: $uuid })

	OPTIONAL MATCH (company)<-[:HAS_PRODUCER_ENTITY]-(production:Production)

	OPTIONAL MATCH (production)-[entityRel:HAS_PRODUCER_ENTITY]->(entity)
		WHERE
			(entity:Person OR entity:Company) AND
			entityRel.creditedCompanyUuid IS NULL

	UNWIND (CASE WHEN entityRel IS NOT NULL AND entityRel.creditedMemberUuids IS NOT NULL
		THEN [uuid IN entityRel.creditedMemberUuids]
		ELSE [null]
	END) AS creditedMemberUuid

		OPTIONAL MATCH (production)-[creditedMemberRel:HAS_PRODUCER_ENTITY]->
			(creditedMember:Person { uuid: creditedMemberUuid })
			WHERE
				entityRel.creditPosition IS NULL OR
				entityRel.creditPosition = creditedMemberRel.creditPosition

		WITH company, production, entityRel, entity, creditedMember
			ORDER BY creditedMember.memberPosition

		WITH company, production, entityRel, entity,
			COLLECT(DISTINCT(creditedMember {
				model: 'PERSON',
				.uuid,
				.name
			})) AS creditedMembers
		ORDER BY entityRel.creditPosition, entityRel.entityPosition

	WITH company, production, entityRel.credit AS producerCreditName,
		COLLECT(
			CASE entity WHEN NULL
				THEN null
				ELSE entity { model: TOUPPER(HEAD(LABELS(entity))), .uuid, .name, members: creditedMembers }
			END
		) AS entities

	WITH company, production, producerCreditName,
		[entity IN entities | CASE entity.model WHEN 'COMPANY'
			THEN entity
			ELSE entity { .model, .uuid, .name }
		END] AS entities

	WITH company, production,
		COLLECT(
			CASE SIZE(entities) WHEN 0
				THEN null
				ELSE {
					model: 'PRODUCER_CREDIT',
					name: COALESCE(producerCreditName, 'produced by'),
					entities: entities
				}
			END
		) AS producerCredits

	OPTIONAL MATCH (production)-[:PLAYS_AT]->(venue:Venue)

	OPTIONAL MATCH (venue)<-[:HAS_SUB_VENUE]-(surVenue:Venue)

	OPTIONAL MATCH (production)<-[surProductionRel:HAS_SUB_PRODUCTION]-(surProduction:Production)

	OPTIONAL MATCH (surProduction)<-[surSurProductionRel:HAS_SUB_PRODUCTION]-(surSurProduction:Production)

	WITH
		company,
		production,
		producerCredits,
		venue,
		surVenue,
		surProduction,
		surProductionRel,
		surSurProduction,
		surSurProductionRel
		ORDER BY
			production.startDate DESC,
			COALESCE(surSurProduction.name, surProduction.name, production.name),
			COALESCE(surSurProductionRel.position, surProductionRel.position, -1) DESC,
			COALESCE(surSurProductionRel.position, -1) DESC,
			COALESCE(surProductionRel.position, -1) DESC,
			venue.name

	WITH company,
		COLLECT(
			CASE production WHEN NULL
				THEN null
				ELSE production {
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
					END,
					producerCredits
				}
			END
		) AS producerProductions

	OPTIONAL MATCH (company)<-[creativeRel:HAS_CREATIVE_ENTITY]-(production:Production)

	UNWIND (CASE WHEN creativeRel IS NOT NULL AND creativeRel.creditedMemberUuids IS NOT NULL
		THEN creativeRel.creditedMemberUuids
		ELSE [null]
	END) AS creditedMemberUuid

		OPTIONAL MATCH (production)-[creditedMemberRel:HAS_CREATIVE_ENTITY]->
			(creditedMember:Person { uuid: creditedMemberUuid })
			WHERE creativeRel.creditPosition IS NULL OR creativeRel.creditPosition = creditedMemberRel.creditPosition

		WITH company, producerProductions, creativeRel, production, creditedMember
			ORDER BY creditedMemberRel.memberPosition

		WITH company, producerProductions, creativeRel, production,
			COLLECT(creditedMember { model: 'PERSON', .uuid, .name }) AS creditedMembers

	OPTIONAL MATCH (production)-[coCreditedEntityRel:HAS_CREATIVE_ENTITY]->(coCreditedEntity)
		WHERE
			(coCreditedEntity:Person OR coCreditedEntity:Company) AND
			coCreditedEntityRel.creditedCompanyUuid IS NULL AND
			(creativeRel.creditPosition IS NULL OR creativeRel.creditPosition = coCreditedEntityRel.creditPosition) AND
			coCreditedEntity.uuid <> company.uuid

	UNWIND (CASE WHEN coCreditedEntityRel IS NOT NULL AND coCreditedEntityRel.creditedMemberUuids IS NOT NULL
		THEN [uuid IN coCreditedEntityRel.creditedMemberUuids]
		ELSE [null]
	END) AS coCreditedCompanyCreditedMemberUuid

		OPTIONAL MATCH (production)-[coCreditedCompanyCreditedMemberRel:HAS_CREATIVE_ENTITY]->
			(coCreditedCompanyCreditedMember:Person { uuid: coCreditedCompanyCreditedMemberUuid })
			WHERE
				coCreditedEntityRel.creditPosition IS NULL OR
				coCreditedEntityRel.creditPosition = coCreditedCompanyCreditedMemberRel.creditPosition

		WITH
			company,
			producerProductions,
			creativeRel,
			production,
			creditedMembers,
			coCreditedEntityRel,
			coCreditedEntity,
			coCreditedCompanyCreditedMember
			ORDER BY coCreditedCompanyCreditedMemberRel.memberPosition

		WITH
			company,
			producerProductions,
			creativeRel,
			production,
			creditedMembers,
			coCreditedEntityRel,
			coCreditedEntity,
			COLLECT(coCreditedCompanyCreditedMember {
				model: 'PERSON',
				.uuid,
				.name
			}) AS coCreditedCompanyCreditedMembers
			ORDER BY coCreditedEntityRel.entityPosition

	WITH company, producerProductions, creativeRel, production, creditedMembers,
		COLLECT(
			CASE coCreditedEntity WHEN NULL
				THEN null
				ELSE coCreditedEntity {
					model: TOUPPER(HEAD(LABELS(coCreditedEntity))),
					.uuid,
					.name,
					members: coCreditedCompanyCreditedMembers
				}
			END
		) AS coCreditedEntities
		ORDER BY creativeRel.creditPosition

	WITH company, producerProductions, creativeRel, production, creditedMembers,
		[coCreditedEntity IN coCreditedEntities | CASE coCreditedEntity.model WHEN 'COMPANY'
			THEN coCreditedEntity
			ELSE coCreditedEntity { .model, .uuid, .name }
		END] AS coCreditedEntities

	OPTIONAL MATCH (production)-[:PLAYS_AT]->(venue:Venue)

	OPTIONAL MATCH (venue)<-[:HAS_SUB_VENUE]-(surVenue:Venue)

	OPTIONAL MATCH (production)<-[surProductionRel:HAS_SUB_PRODUCTION]-(surProduction:Production)

	OPTIONAL MATCH (surProduction)<-[surSurProductionRel:HAS_SUB_PRODUCTION]-(surSurProduction:Production)

	WITH
		company,
		producerProductions,
		production,
		venue,
		surVenue,
		surProduction,
		surProductionRel,
		surSurProduction,
		surSurProductionRel,
		COLLECT({
			model: 'CREATIVE_CREDIT',
			name: creativeRel.credit,
			members: creditedMembers,
			coEntities: coCreditedEntities
		}) AS creativeCredits
		ORDER BY
			production.startDate DESC,
			COALESCE(surSurProduction.name, surProduction.name, production.name),
			COALESCE(surSurProductionRel.position, surProductionRel.position, -1) DESC,
			COALESCE(surSurProductionRel.position, -1) DESC,
			COALESCE(surProductionRel.position, -1) DESC,
			venue.name

	WITH company, producerProductions,
		COLLECT(
			CASE production WHEN NULL
				THEN null
				ELSE production {
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
					END,
					creativeCredits
				}
			END
		) AS creativeProductions

	OPTIONAL MATCH (company)<-[crewRel:HAS_CREW_ENTITY]-(production:Production)

	UNWIND (CASE WHEN crewRel IS NOT NULL AND crewRel.creditedMemberUuids IS NOT NULL
		THEN crewRel.creditedMemberUuids
		ELSE [null]
	END) AS creditedMemberUuid

		OPTIONAL MATCH (production)-[creditedMemberRel:HAS_CREW_ENTITY]->
			(creditedMember:Person { uuid: creditedMemberUuid })
			WHERE crewRel.creditPosition IS NULL OR crewRel.creditPosition = creditedMemberRel.creditPosition

		WITH company, producerProductions, creativeProductions, crewRel, production, creditedMember
			ORDER BY creditedMemberRel.memberPosition

		WITH company, producerProductions, creativeProductions, crewRel, production,
			COLLECT(creditedMember { model: 'PERSON', .uuid, .name }) AS creditedMembers

	OPTIONAL MATCH (production)-[coCreditedEntityRel:HAS_CREW_ENTITY]->(coCreditedEntity)
		WHERE
			(coCreditedEntity:Person OR coCreditedEntity:Company) AND
			coCreditedEntityRel.creditedCompanyUuid IS NULL AND
			(crewRel.creditPosition IS NULL OR crewRel.creditPosition = coCreditedEntityRel.creditPosition) AND
			coCreditedEntity.uuid <> company.uuid

	UNWIND (CASE WHEN coCreditedEntityRel IS NOT NULL AND coCreditedEntityRel.creditedMemberUuids IS NOT NULL
		THEN [uuid IN coCreditedEntityRel.creditedMemberUuids]
		ELSE [null]
	END) AS coCreditedCompanyCreditedMemberUuid

		OPTIONAL MATCH (production)-[coCreditedCompanyCreditedMemberRel:HAS_CREW_ENTITY]->
			(coCreditedCompanyCreditedMember:Person { uuid: coCreditedCompanyCreditedMemberUuid })
			WHERE
				coCreditedEntityRel.creditPosition IS NULL OR
				coCreditedEntityRel.creditPosition = coCreditedCompanyCreditedMemberRel.creditPosition

		WITH
			producerProductions,
			creativeProductions,
			crewRel,
			production,
			creditedMembers,
			coCreditedEntityRel,
			coCreditedEntity,
			coCreditedCompanyCreditedMember
			ORDER BY coCreditedCompanyCreditedMemberRel.memberPosition

		WITH
			producerProductions,
			creativeProductions,
			crewRel,
			production,
			creditedMembers,
			coCreditedEntityRel,
			coCreditedEntity,
			COLLECT(coCreditedCompanyCreditedMember {
				model: 'PERSON',
				.uuid,
				.name
			}) AS coCreditedCompanyCreditedMembers
			ORDER BY coCreditedEntityRel.entityPosition

	WITH producerProductions, creativeProductions, crewRel, production, creditedMembers,
		COLLECT(
			CASE coCreditedEntity WHEN NULL
				THEN null
				ELSE coCreditedEntity {
					model: TOUPPER(HEAD(LABELS(coCreditedEntity))),
					.uuid,
					.name,
					members: coCreditedCompanyCreditedMembers
				}
			END
		) AS coCreditedEntities
		ORDER BY crewRel.creditPosition

	WITH producerProductions, creativeProductions, crewRel, production, creditedMembers,
		[coCreditedEntity IN coCreditedEntities | CASE coCreditedEntity.model WHEN 'COMPANY'
			THEN coCreditedEntity
			ELSE coCreditedEntity { .model, .uuid, .name }
		END] AS coCreditedEntities

	OPTIONAL MATCH (production)-[:PLAYS_AT]->(venue:Venue)

	OPTIONAL MATCH (venue)<-[:HAS_SUB_VENUE]-(surVenue:Venue)

	OPTIONAL MATCH (production)<-[surProductionRel:HAS_SUB_PRODUCTION]-(surProduction:Production)

	OPTIONAL MATCH (surProduction)<-[surSurProductionRel:HAS_SUB_PRODUCTION]-(surSurProduction:Production)

	WITH
		producerProductions,
		creativeProductions,
		production,
		venue,
		surVenue,
		surProduction,
		surProductionRel,
		surSurProduction,
		surSurProductionRel,
		COLLECT({
			model: 'CREW_CREDIT',
			name: crewRel.credit,
			members: creditedMembers,
			coEntities: coCreditedEntities
		}) AS crewCredits
		ORDER BY
			production.startDate DESC,
			COALESCE(surSurProduction.name, surProduction.name, production.name),
			COALESCE(surSurProductionRel.position, surProductionRel.position, -1) DESC,
			COALESCE(surSurProductionRel.position, -1) DESC,
			COALESCE(surProductionRel.position, -1) DESC,
			venue.name

	RETURN
		producerProductions,
		creativeProductions,
		COLLECT(
			CASE production WHEN NULL
				THEN null
				ELSE production {
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
					END,
					crewCredits
				}
			END
		) AS crewProductions
`;
