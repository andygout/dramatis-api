export default () => `
	MATCH (company:Company { uuid: $uuid })

	CALL {
		WITH company

		OPTIONAL MATCH (company)<-[:HAS_PRODUCER_ENTITY]-(production:Production)

		OPTIONAL MATCH (production)-[entityRel:HAS_PRODUCER_ENTITY WHERE entityRel.creditedCompanyUuid IS NULL]->
			(entity:Person|Company)

		UNWIND (CASE WHEN entityRel IS NOT NULL AND entityRel.creditedMemberUuids IS NOT NULL
			THEN [uuid IN entityRel.creditedMemberUuids]
			ELSE [null]
		END) AS creditedMemberUuid

			OPTIONAL MATCH (production)-[creditedMemberRel:HAS_PRODUCER_ENTITY]->
				(creditedMember:Person { uuid: creditedMemberUuid })
				WHERE
					entityRel.creditPosition IS NULL OR
					entityRel.creditPosition = creditedMemberRel.creditPosition

			WITH production, entityRel, entity, creditedMember
				ORDER BY creditedMember.memberPosition

			WITH production, entityRel, entity,
				COLLECT(DISTINCT(creditedMember {
					model: 'PERSON',
					.uuid,
					.name
				})) AS creditedMembers
			ORDER BY entityRel.creditPosition, entityRel.entityPosition

		WITH production, entityRel.credit AS producerCreditName,
			COLLECT(
				CASE WHEN entity IS NULL
					THEN null
					ELSE entity { model: TOUPPER(HEAD(LABELS(entity))), .uuid, .name, members: creditedMembers }
				END
			) AS entities

		WITH production, producerCreditName,
			[entity IN entities | CASE entity.model WHEN 'COMPANY'
				THEN entity
				ELSE entity { .model, .uuid, .name }
			END] AS entities

		WITH production,
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

		RETURN
			COLLECT(
				CASE WHEN production IS NULL
					THEN null
					ELSE production {
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
						END,
						producerCredits
					}
				END
			) AS producerProductions
	}

	CALL {
		WITH company

		OPTIONAL MATCH (company)<-[creativeRel:HAS_CREATIVE_ENTITY]-(production:Production)

		UNWIND (CASE WHEN creativeRel IS NOT NULL AND creativeRel.creditedMemberUuids IS NOT NULL
			THEN creativeRel.creditedMemberUuids
			ELSE [null]
		END) AS creditedMemberUuid

			OPTIONAL MATCH (production)-[creditedMemberRel:HAS_CREATIVE_ENTITY]->
				(creditedMember:Person { uuid: creditedMemberUuid })
				WHERE
					creativeRel.creditPosition IS NULL OR
					creativeRel.creditPosition = creditedMemberRel.creditPosition

			WITH company, creativeRel, production, creditedMember
				ORDER BY creditedMemberRel.memberPosition

			WITH company, creativeRel, production,
				COLLECT(creditedMember { model: 'PERSON', .uuid, .name }) AS creditedMembers

		OPTIONAL MATCH (production)-[coCreditedEntityRel:HAS_CREATIVE_ENTITY]->(coCreditedEntity:Person|Company)
			WHERE
				coCreditedEntityRel.creditedCompanyUuid IS NULL AND
				(
					creativeRel.creditPosition IS NULL OR
					creativeRel.creditPosition = coCreditedEntityRel.creditPosition
				) AND
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
				creativeRel,
				production,
				creditedMembers,
				coCreditedEntityRel,
				coCreditedEntity,
				coCreditedCompanyCreditedMember
				ORDER BY coCreditedCompanyCreditedMemberRel.memberPosition

			WITH
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

		WITH creativeRel, production, creditedMembers,
			COLLECT(
				CASE WHEN coCreditedEntity IS NULL
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

		WITH creativeRel, production, creditedMembers,
			[coCreditedEntity IN coCreditedEntities | CASE coCreditedEntity.model WHEN 'COMPANY'
				THEN coCreditedEntity
				ELSE coCreditedEntity { .model, .uuid, .name }
			END] AS coCreditedEntities

		OPTIONAL MATCH (production)-[:PLAYS_AT]->(venue:Venue)

		OPTIONAL MATCH (venue)<-[:HAS_SUB_VENUE]-(surVenue:Venue)

		OPTIONAL MATCH (production)<-[surProductionRel:HAS_SUB_PRODUCTION]-(surProduction:Production)

		OPTIONAL MATCH (surProduction)<-[surSurProductionRel:HAS_SUB_PRODUCTION]-(surSurProduction:Production)

		WITH
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

		RETURN
			COLLECT(
				CASE WHEN production IS NULL
					THEN null
					ELSE production {
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
						END,
						creativeCredits
					}
				END
			) AS creativeProductions
	}

	CALL {
		WITH company

		OPTIONAL MATCH (company)<-[crewRel:HAS_CREW_ENTITY]-(production:Production)

		UNWIND (CASE WHEN crewRel IS NOT NULL AND crewRel.creditedMemberUuids IS NOT NULL
			THEN crewRel.creditedMemberUuids
			ELSE [null]
		END) AS creditedMemberUuid

			OPTIONAL MATCH (production)-[creditedMemberRel:HAS_CREW_ENTITY]->
				(creditedMember:Person { uuid: creditedMemberUuid })
				WHERE crewRel.creditPosition IS NULL OR crewRel.creditPosition = creditedMemberRel.creditPosition

			WITH company, crewRel, production, creditedMember
				ORDER BY creditedMemberRel.memberPosition

			WITH company, crewRel, production,
				COLLECT(creditedMember { model: 'PERSON', .uuid, .name }) AS creditedMembers

		OPTIONAL MATCH (production)-[coCreditedEntityRel:HAS_CREW_ENTITY]->(coCreditedEntity:Person|Company)
			WHERE
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
				crewRel,
				production,
				creditedMembers,
				coCreditedEntityRel,
				coCreditedEntity,
				coCreditedCompanyCreditedMember
				ORDER BY coCreditedCompanyCreditedMemberRel.memberPosition

			WITH
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

		WITH crewRel, production, creditedMembers,
			COLLECT(
				CASE WHEN coCreditedEntity IS NULL
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

		WITH crewRel, production, creditedMembers,
			[coCreditedEntity IN coCreditedEntities | CASE coCreditedEntity.model WHEN 'COMPANY'
				THEN coCreditedEntity
				ELSE coCreditedEntity { .model, .uuid, .name }
			END] AS coCreditedEntities

		OPTIONAL MATCH (production)-[:PLAYS_AT]->(venue:Venue)

		OPTIONAL MATCH (venue)<-[:HAS_SUB_VENUE]-(surVenue:Venue)

		OPTIONAL MATCH (production)<-[surProductionRel:HAS_SUB_PRODUCTION]-(surProduction:Production)

		OPTIONAL MATCH (surProduction)<-[surSurProductionRel:HAS_SUB_PRODUCTION]-(surSurProduction:Production)

		WITH
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
			COLLECT(
				CASE WHEN production IS NULL
					THEN null
					ELSE production {
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
						END,
						crewCredits
					}
				END
			) AS crewProductions
	}

	RETURN
		producerProductions,
		creativeProductions,
		crewProductions
`;
