export default () => `
	MATCH (person:Person { uuid: $uuid })

	CALL {
		WITH person

		OPTIONAL MATCH (person)<-[:HAS_PRODUCER_ENTITY]-(production:Production)

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
				COLLECT(DISTINCT(creditedMember { model: 'PERSON', .uuid, .name })) AS creditedMembers
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
		WITH person

		OPTIONAL MATCH (person)<-[role:HAS_CAST_MEMBER]-(production:Production)

		OPTIONAL MATCH (production)-[:PLAYS_AT]->(venue:Venue)

		OPTIONAL MATCH (venue)<-[:HAS_SUB_VENUE]-(surVenue:Venue)

		OPTIONAL MATCH (production)-[:PRODUCTION_OF]->(:Material)-[characterRel:DEPICTS]->(character:Character)
			WHERE
				COALESCE(role.characterName, role.roleName) IN [character.name, characterRel.displayName] AND
				(role.characterDifferentiator IS NULL OR role.characterDifferentiator = character.differentiator)

		WITH DISTINCT production, venue, surVenue, role, character
			ORDER BY role.rolePosition

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
			COLLECT(
				CASE WHEN role.roleName IS NULL
					THEN { name: 'Performer' }
					ELSE role {
						model: 'CHARACTER',
						uuid: character.uuid,
						name: role.roleName,
						.qualifier,
						isAlternate: COALESCE(role.isAlternate, false)
					}
				END
			) AS roles
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
						roles
					}
				END
			) AS castMemberProductions
	}

	CALL {
		WITH person

		OPTIONAL MATCH (person)<-[creativeRel:HAS_CREATIVE_ENTITY]-(production:Production)

		OPTIONAL MATCH (production)-[creativeCompanyRel:HAS_CREATIVE_ENTITY]->
			(creditedEmployerCompany:Company { uuid: creativeRel.creditedCompanyUuid })
			WHERE
				creativeRel.creditPosition IS NULL OR
				creativeRel.creditPosition = creativeCompanyRel.creditPosition

		UNWIND (CASE WHEN creativeCompanyRel IS NOT NULL AND creativeCompanyRel.creditedMemberUuids IS NOT NULL
			THEN [uuid IN creativeCompanyRel.creditedMemberUuids]
			ELSE [null]
		END) AS coCreditedMemberUuid

			OPTIONAL MATCH (production)-[coCreditedMemberRel:HAS_CREATIVE_ENTITY]->
				(coCreditedMember:Person { uuid: coCreditedMemberUuid })
				WHERE
					coCreditedMember.uuid <> person.uuid AND
					(
						creativeCompanyRel.creditPosition IS NULL OR
						creativeCompanyRel.creditPosition = coCreditedMemberRel.creditPosition
					)

			WITH
				person,
				creativeRel,
				production,
				creativeCompanyRel,
				creditedEmployerCompany,
				coCreditedMember
				ORDER BY coCreditedMemberRel.memberPosition

			WITH
				person,
				creativeRel,
				production,
				creativeCompanyRel,
				creditedEmployerCompany,
				COLLECT(coCreditedMember { model: 'PERSON', .uuid, .name }) AS coCreditedMembers

		WITH
			production,
			CASE WHEN creditedEmployerCompany IS NULL
				THEN null
				ELSE creditedEmployerCompany { model: 'COMPANY', .uuid, .name, coMembers: coCreditedMembers }
			END AS creditedEmployerCompany,
			COALESCE(creditedEmployerCompany, person) AS entity,
			COALESCE(creativeCompanyRel, creativeRel) AS entityRel

		OPTIONAL MATCH (production)-[coCreditedEntityRel:HAS_CREATIVE_ENTITY]->(coCreditedEntity:Person|Company)
			WHERE
				coCreditedEntityRel.creditedCompanyUuid IS NULL AND
				(
					entityRel.creditPosition IS NULL OR
					entityRel.creditPosition = coCreditedEntityRel.creditPosition
				) AND
				coCreditedEntity.uuid <> entity.uuid

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
				production,
				entityRel,
				creditedEmployerCompany,
				coCreditedEntityRel,
				coCreditedEntity,
				coCreditedCompanyCreditedMember
				ORDER BY coCreditedCompanyCreditedMemberRel.memberPosition

			WITH
				production,
				entityRel,
				creditedEmployerCompany,
				coCreditedEntityRel,
				coCreditedEntity,
				COLLECT(coCreditedCompanyCreditedMember {
					model: 'PERSON',
					.uuid,
					.name
				}) AS coCreditedCompanyCreditedMembers
				ORDER BY coCreditedEntityRel.entityPosition

		WITH
			production,
			entityRel,
			creditedEmployerCompany,
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
			ORDER BY entityRel.creditPosition

		WITH
			production,
			entityRel,
			creditedEmployerCompany,
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
				name: entityRel.credit,
				employerCompany: creditedEmployerCompany,
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
		WITH person

		OPTIONAL MATCH (person)<-[crewRel:HAS_CREW_ENTITY]-(production:Production)

		OPTIONAL MATCH (production)-[crewCompanyRel:HAS_CREW_ENTITY]->
			(creditedEmployerCompany:Company { uuid: crewRel.creditedCompanyUuid })
			WHERE
				crewRel.creditPosition IS NULL OR
				crewRel.creditPosition = crewCompanyRel.creditPosition

		UNWIND (CASE WHEN crewCompanyRel IS NOT NULL AND crewCompanyRel.creditedMemberUuids IS NOT NULL
			THEN [uuid IN crewCompanyRel.creditedMemberUuids]
			ELSE [null]
		END) AS coCreditedMemberUuid

			OPTIONAL MATCH (production)-[coCreditedMemberRel:HAS_CREW_ENTITY]->
				(coCreditedMember:Person { uuid: coCreditedMemberUuid })
				WHERE
					coCreditedMember.uuid <> person.uuid AND
					(
						crewCompanyRel.creditPosition IS NULL OR
						crewCompanyRel.creditPosition = coCreditedMemberRel.creditPosition
					)

			WITH
				person,
				crewRel,
				production,
				crewCompanyRel,
				creditedEmployerCompany,
				coCreditedMember
				ORDER BY coCreditedMemberRel.memberPosition

			WITH
				person,
				crewRel,
				production,
				crewCompanyRel,
				creditedEmployerCompany,
				COLLECT(coCreditedMember { model: 'PERSON', .uuid, .name }) AS coCreditedMembers

		WITH
			production,
			CASE WHEN creditedEmployerCompany IS NULL
				THEN null
				ELSE creditedEmployerCompany { model: 'COMPANY', .uuid, .name, coMembers: coCreditedMembers }
			END AS creditedEmployerCompany,
			COALESCE(creditedEmployerCompany, person) AS entity,
			COALESCE(crewCompanyRel, crewRel) AS entityRel

		OPTIONAL MATCH (production)-[coCreditedEntityRel:HAS_CREW_ENTITY]->(coCreditedEntity:Person|Company)
			WHERE
				coCreditedEntityRel.creditedCompanyUuid IS NULL AND
				(
					entityRel.creditPosition IS NULL OR
					entityRel.creditPosition = coCreditedEntityRel.creditPosition
				) AND
				coCreditedEntity.uuid <> entity.uuid

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
				production,
				entityRel,
				creditedEmployerCompany,
				coCreditedEntityRel,
				coCreditedEntity,
				coCreditedCompanyCreditedMember
				ORDER BY coCreditedCompanyCreditedMemberRel.memberPosition

			WITH
				production,
				entityRel,
				creditedEmployerCompany,
				coCreditedEntityRel,
				coCreditedEntity,
				COLLECT(coCreditedCompanyCreditedMember {
					model: 'PERSON',
					.uuid,
					.name
				}) AS coCreditedCompanyCreditedMembers
				ORDER BY coCreditedEntityRel.entityPosition

		WITH
			production,
			entityRel,
			creditedEmployerCompany,
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
			ORDER BY entityRel.creditPosition

		WITH
			production,
			entityRel,
			creditedEmployerCompany,
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
				name: entityRel.credit,
				employerCompany: creditedEmployerCompany,
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

	CALL {
		WITH person

		OPTIONAL MATCH (person)<-[criticRel:HAS_REVIEWER]-(production:Production)

		OPTIONAL MATCH (production)-[publicationRel:HAS_REVIEWER]->
			(publication:Company { uuid: criticRel.publicationCompanyUuid })
			WHERE
				criticRel.position IS NULL OR
				criticRel.position = publicationRel.position

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
			{
				model: 'REVIEW',
				url: publicationRel.url,
				date: publicationRel.date,
				publication: publication {
					model: 'COMPANY',
					.uuid,
					.name
				}
			} AS review
			ORDER BY
				publicationRel.date DESC,
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
						review
					}
				END
			) AS reviewCriticProductions
	}

	RETURN
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
		reviewCriticProductions
`;
