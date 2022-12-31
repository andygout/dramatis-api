export default () => `
	MATCH (person:Person { uuid: $uuid })

	OPTIONAL MATCH (person)<-[:HAS_WRITING_ENTITY]-(:Material)<-[:USES_SOURCE_MATERIAL*0..1]-(material:Material)
		WHERE NOT EXISTS(
			(person)<-[:HAS_WRITING_ENTITY]-(:Material)<-[:USES_SOURCE_MATERIAL*0..1]-(:Material)
			<-[:HAS_SUB_MATERIAL]-(material)
		)

	WITH person, COLLECT(DISTINCT(material)) AS materials

	UNWIND (CASE materials WHEN [] THEN [null] ELSE materials END) AS material

		OPTIONAL MATCH (person)<-[writerRel:HAS_WRITING_ENTITY]-(material)

		OPTIONAL MATCH (person)<-[:HAS_WRITING_ENTITY]-(:Material)
			<-[subsequentVersionRel:SUBSEQUENT_VERSION_OF]-(material)

		OPTIONAL MATCH (person)<-[:HAS_WRITING_ENTITY]-(:Material)
			<-[sourcingMaterialRel:USES_SOURCE_MATERIAL]-(material)

		OPTIONAL MATCH (material)-[entityRel:HAS_WRITING_ENTITY|USES_SOURCE_MATERIAL]->(entity)
			WHERE entity:Person OR entity:Company OR entity:Material

		OPTIONAL MATCH (entity:Material)<-[:HAS_SUB_MATERIAL]-(entitySurMaterial:Material)

		OPTIONAL MATCH (entity:Material)-[sourceMaterialWriterRel:HAS_WRITING_ENTITY]->(sourceMaterialWriter)
			WHERE sourceMaterialWriter:Person OR sourceMaterialWriter:Company

		WITH
			person,
			material,
			writerRel.creditType AS creditType,
			CASE writerRel WHEN NULL THEN false ELSE true END AS hasDirectCredit,
			CASE subsequentVersionRel WHEN NULL THEN false ELSE true END AS isSubsequentVersion,
			CASE sourcingMaterialRel WHEN NULL THEN false ELSE true END AS isSourcingMaterial,
			entityRel,
			entity,
			entitySurMaterial,
			sourceMaterialWriterRel,
			sourceMaterialWriter
			ORDER BY sourceMaterialWriterRel.creditPosition, sourceMaterialWriterRel.entityPosition

		WITH
			person,
			material,
			creditType,
			hasDirectCredit,
			isSubsequentVersion,
			isSourcingMaterial,
			entityRel,
			entity,
			entitySurMaterial,
			sourceMaterialWriterRel.credit AS sourceMaterialWritingCreditName,
			COLLECT(
				CASE sourceMaterialWriter WHEN NULL
					THEN null
					ELSE sourceMaterialWriter { model: TOUPPER(HEAD(LABELS(sourceMaterialWriter))), .uuid, .name }
				END
			) AS sourceMaterialWriters

		WITH
			person,
			material,
			creditType,
			hasDirectCredit,
			isSubsequentVersion,
			isSourcingMaterial,
			entityRel,
			entity,
			entitySurMaterial,
			COLLECT(
				CASE SIZE(sourceMaterialWriters) WHEN 0
					THEN null
					ELSE {
						model: 'WRITING_CREDIT',
						name: COALESCE(sourceMaterialWritingCreditName, 'by'),
						entities: sourceMaterialWriters
					}
				END
			) AS sourceMaterialWritingCredits
			ORDER BY entityRel.creditPosition, entityRel.entityPosition

		WITH
			person,
			material,
			creditType,
			hasDirectCredit,
			isSubsequentVersion,
			isSourcingMaterial,
			entityRel.credit AS writingCreditName,
			COLLECT(
				CASE entity WHEN NULL
					THEN null
					ELSE entity {
						model: TOUPPER(HEAD(LABELS(entity))),
						.uuid,
						.name,
						.format,
						.year,
						surMaterial: CASE entitySurMaterial WHEN NULL
							THEN null
							ELSE entitySurMaterial { model: 'MATERIAL', .uuid, .name }
						END,
						writingCredits: sourceMaterialWritingCredits
					}
				END
			) AS entities

		WITH
			person,
			material,
			creditType,
			hasDirectCredit,
			isSubsequentVersion,
			isSourcingMaterial,
			writingCreditName,
			[entity IN entities | CASE entity.model WHEN 'MATERIAL'
				THEN entity
				ELSE entity { .model, .uuid, .name }
			END] AS entities

		WITH person, material, creditType, hasDirectCredit, isSubsequentVersion, isSourcingMaterial,
			COLLECT(
				CASE SIZE(entities) WHEN 0
					THEN null
					ELSE {
						model: 'WRITING_CREDIT',
						name: COALESCE(writingCreditName, 'by'),
						entities: entities
					}
				END
			) AS writingCredits
			ORDER BY material.year DESC, material.name

		OPTIONAL MATCH (material)<-[:HAS_SUB_MATERIAL]-(surMaterial:Material)

		WITH person,
			COLLECT(
				CASE material WHEN NULL
					THEN null
					ELSE material {
						model: 'MATERIAL',
						.uuid,
						.name,
						.format,
						.year,
						surMaterial: CASE surMaterial WHEN NULL
							THEN null
							ELSE surMaterial { model: 'MATERIAL', .uuid, .name }
						END,
						writingCredits,
						creditType,
						hasDirectCredit,
						isSubsequentVersion,
						isSourcingMaterial
					}
				END
			) AS materials

	OPTIONAL MATCH (person)<-[:HAS_PRODUCER_ENTITY]-(production:Production)

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

		WITH person, materials, production, entityRel, entity, creditedMember
			ORDER BY creditedMember.memberPosition

		WITH person, materials, production, entityRel, entity,
			COLLECT(DISTINCT(creditedMember { model: 'PERSON', .uuid, .name })) AS creditedMembers
		ORDER BY entityRel.creditPosition, entityRel.entityPosition

	WITH person, materials, production, entityRel.credit AS producerCreditName,
		COLLECT(
			CASE entity WHEN NULL
				THEN null
				ELSE entity { model: TOUPPER(HEAD(LABELS(entity))), .uuid, .name, members: creditedMembers }
			END
		) AS entities

	WITH person, materials, production, producerCreditName,
		[entity IN entities | CASE entity.model WHEN 'COMPANY'
			THEN entity
			ELSE entity { .model, .uuid, .name }
		END] AS entities

	WITH person, materials, production,
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

	OPTIONAL MATCH (production)<-[:HAS_SUB_PRODUCTION]-(surProduction:Production)

	WITH person, materials, production, producerCredits, venue, surVenue, surProduction
		ORDER BY production.startDate DESC, production.name, venue.name

	WITH person, materials,
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
						ELSE surProduction { model: 'PRODUCTION', .uuid, .name }
					END,
					producerCredits
				}
			END
		) AS producerProductions

	OPTIONAL MATCH (person)<-[role:HAS_CAST_MEMBER]-(production:Production)

	OPTIONAL MATCH (production)-[:PLAYS_AT]->(venue:Venue)

	OPTIONAL MATCH (venue)<-[:HAS_SUB_VENUE]-(surVenue:Venue)

	OPTIONAL MATCH (production)<-[:HAS_SUB_PRODUCTION]-(surProduction:Production)

	OPTIONAL MATCH (production)-[:PRODUCTION_OF]->(:Material)-[characterRel:DEPICTS]->(character:Character)
		WHERE
			(
				role.roleName IN [character.name, characterRel.displayName] OR
				role.characterName IN [character.name, characterRel.displayName]
			) AND
			(role.characterDifferentiator IS NULL OR role.characterDifferentiator = character.differentiator)

	WITH DISTINCT person, materials, producerProductions, production, venue, surVenue, surProduction, role, character
		ORDER BY role.rolePosition

	WITH person, materials, producerProductions, production, venue, surVenue, surProduction,
		COLLECT(
			CASE role.roleName WHEN NULL
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
		ORDER BY production.startDate DESC, production.name, venue.name

	WITH person, materials, producerProductions,
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
						ELSE surProduction { model: 'PRODUCTION', .uuid, .name }
					END,
					roles
				}
			END
		) AS castMemberProductions

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
			materials,
			producerProductions,
			castMemberProductions,
			creativeRel,
			production,
			creativeCompanyRel,
			creditedEmployerCompany,
			coCreditedMember
			ORDER BY coCreditedMemberRel.memberPosition

		WITH
			person,
			materials,
			producerProductions,
			castMemberProductions,
			creativeRel,
			production,
			creativeCompanyRel,
			creditedEmployerCompany,
			COLLECT(coCreditedMember { model: 'PERSON', .uuid, .name }) AS coCreditedMembers

	WITH
		person,
		materials,
		producerProductions,
		castMemberProductions,
		production,
		CASE creditedEmployerCompany WHEN NULL
			THEN null
			ELSE creditedEmployerCompany { model: 'COMPANY', .uuid, .name, coMembers: coCreditedMembers }
		END AS creditedEmployerCompany,
		COALESCE(creditedEmployerCompany, person) AS entity,
		COALESCE(creativeCompanyRel, creativeRel) AS entityRel

	OPTIONAL MATCH (production)-[coCreditedEntityRel:HAS_CREATIVE_ENTITY]->(coCreditedEntity)
		WHERE
			(coCreditedEntity:Person OR coCreditedEntity:Company) AND
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
			person,
			materials,
			producerProductions,
			castMemberProductions,
			production,
			entityRel,
			creditedEmployerCompany,
			coCreditedEntityRel,
			coCreditedEntity,
			coCreditedCompanyCreditedMember
			ORDER BY coCreditedCompanyCreditedMemberRel.memberPosition

		WITH
			person,
			materials,
			producerProductions,
			castMemberProductions,
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
		person,
		materials,
		producerProductions,
		castMemberProductions,
		production,
		entityRel,
		creditedEmployerCompany,
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
		ORDER BY entityRel.creditPosition

	WITH
		person,
		materials,
		producerProductions,
		castMemberProductions,
		production,
		entityRel,
		creditedEmployerCompany,
		[coCreditedEntity IN coCreditedEntities | CASE coCreditedEntity.model WHEN 'COMPANY'
			THEN coCreditedEntity
			ELSE coCreditedEntity { .model, .uuid, .name }
		END] AS coCreditedEntities

	OPTIONAL MATCH (production)-[:PLAYS_AT]->(venue:Venue)

	OPTIONAL MATCH (venue)<-[:HAS_SUB_VENUE]-(surVenue:Venue)

	OPTIONAL MATCH (production)<-[:HAS_SUB_PRODUCTION]-(surProduction:Production)

	WITH person, materials, producerProductions, castMemberProductions, production, venue, surVenue, surProduction,
		COLLECT({
			model: 'CREATIVE_CREDIT',
			name: entityRel.credit,
			employerCompany: creditedEmployerCompany,
			coEntities: coCreditedEntities
		}) AS creativeCredits
		ORDER BY production.startDate DESC, production.name, venue.name

	WITH person, materials, producerProductions, castMemberProductions,
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
						ELSE surProduction { model: 'PRODUCTION', .uuid, .name }
					END,
					creativeCredits
				}
			END
		) AS creativeProductions

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
			materials,
			producerProductions,
			castMemberProductions,
			creativeProductions,
			crewRel,
			production,
			crewCompanyRel,
			creditedEmployerCompany,
			coCreditedMember
			ORDER BY coCreditedMemberRel.memberPosition

		WITH
			person,
			materials,
			producerProductions,
			castMemberProductions,
			creativeProductions,
			crewRel,
			production,
			crewCompanyRel,
			creditedEmployerCompany,
			COLLECT(coCreditedMember { model: 'PERSON', .uuid, .name }) AS coCreditedMembers

	WITH
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		production,
		CASE creditedEmployerCompany WHEN NULL
			THEN null
			ELSE creditedEmployerCompany { model: 'COMPANY', .uuid, .name, coMembers: coCreditedMembers }
		END AS creditedEmployerCompany,
		COALESCE(creditedEmployerCompany, person) AS entity,
		COALESCE(crewCompanyRel, crewRel) AS entityRel

	OPTIONAL MATCH (production)-[coCreditedEntityRel:HAS_CREW_ENTITY]->(coCreditedEntity)
		WHERE
			(coCreditedEntity:Person OR coCreditedEntity:Company) AND
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
			person,
			materials,
			producerProductions,
			castMemberProductions,
			creativeProductions,
			production,
			entityRel,
			creditedEmployerCompany,
			coCreditedEntityRel,
			coCreditedEntity,
			coCreditedCompanyCreditedMember
			ORDER BY coCreditedCompanyCreditedMemberRel.memberPosition

		WITH
			person,
			materials,
			producerProductions,
			castMemberProductions,
			creativeProductions,
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
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		production,
		entityRel,
		creditedEmployerCompany,
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
		ORDER BY entityRel.creditPosition

	WITH
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		production,
		entityRel,
		creditedEmployerCompany,
		[coCreditedEntity IN coCreditedEntities | CASE coCreditedEntity.model WHEN 'COMPANY'
			THEN coCreditedEntity
			ELSE coCreditedEntity { .model, .uuid, .name }
		END] AS coCreditedEntities

	OPTIONAL MATCH (production)-[:PLAYS_AT]->(venue:Venue)

	OPTIONAL MATCH (venue)<-[:HAS_SUB_VENUE]-(surVenue:Venue)

	OPTIONAL MATCH (production)<-[:HAS_SUB_PRODUCTION]-(surProduction:Production)

	WITH
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		production,
		venue,
		surVenue,
		surProduction,
		COLLECT({
			model: 'CREW_CREDIT',
			name: entityRel.credit,
			employerCompany: creditedEmployerCompany,
			coEntities: coCreditedEntities
		}) AS crewCredits
		ORDER BY production.startDate DESC, production.name, venue.name

	WITH
		person,
		materials,
		producerProductions,
		castMemberProductions,
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
						ELSE surProduction { model: 'PRODUCTION', .uuid, .name }
					END,
					crewCredits
				}
			END
		) AS crewProductions

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

	WITH
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
		nomineeRel,
		category,
		categoryRel,
		ceremony

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
			materials,
			producerProductions,
			castMemberProductions,
			creativeProductions,
			crewProductions,
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
			materials,
			producerProductions,
			castMemberProductions,
			creativeProductions,
			crewProductions,
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
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
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
			person,
			materials,
			producerProductions,
			castMemberProductions,
			creativeProductions,
			crewProductions,
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
			person,
			materials,
			producerProductions,
			castMemberProductions,
			creativeProductions,
			crewProductions,
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
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
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
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
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
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
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
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
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
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
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
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
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
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
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
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
		ceremony,
		award,
		COLLECT(category { model: 'AWARD_CEREMONY_CATEGORY', .name, nominations }) AS categories
		ORDER BY ceremony.name DESC

	WITH
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
		award,
		COLLECT(ceremony { model: 'AWARD_CEREMONY', .uuid, .name, categories }) AS ceremonies
		ORDER BY award.name

	WITH
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
		COLLECT(award { model: 'AWARD', .uuid, .name, ceremonies }) AS awards

	OPTIONAL MATCH (person)<-[:HAS_WRITING_ENTITY]-(:Material)
		<-[:SUBSEQUENT_VERSION_OF]-(nominatedSubsequentVersionMaterial:Material)
		<-[nomineeRel:HAS_NOMINEE]-(category:AwardCeremonyCategory)
		<-[categoryRel:PRESENTS_CATEGORY]-(ceremony:AwardCeremony)

	OPTIONAL MATCH (nominatedSubsequentVersionMaterial)
		<-[:HAS_SUB_MATERIAL]-(nominatedSubsequentVersionSurMaterial:Material)

	OPTIONAL MATCH (ceremony)<-[:PRESENTED_AT]-(subsequentVersionMaterialAward:Award)

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
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
		awards,
		nominatedSubsequentVersionMaterial,
		nominatedSubsequentVersionSurMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		subsequentVersionMaterialAward,
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
				person,
				materials,
				producerProductions,
				castMemberProductions,
				creativeProductions,
				crewProductions,
				awards,
				nominatedSubsequentVersionMaterial,
				nominatedSubsequentVersionSurMaterial,
				nomineeRel,
				category,
				categoryRel,
				ceremony,
				subsequentVersionMaterialAward,
				nominatedEntityRel,
				nominatedEntity,
				nominatedMember
				ORDER BY nominatedMemberRel.memberPosition

			WITH
				person,
				materials,
				producerProductions,
				castMemberProductions,
				creativeProductions,
				crewProductions,
				awards,
				nominatedSubsequentVersionMaterial,
				nominatedSubsequentVersionSurMaterial,
				nomineeRel,
				category,
				categoryRel,
				ceremony,
				subsequentVersionMaterialAward,
				nominatedEntityRel,
				nominatedEntity,
				COLLECT(nominatedMember { model: 'PERSON', .uuid, .name }) AS nominatedMembers

	WITH
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
		awards,
		nominatedSubsequentVersionMaterial,
		nominatedSubsequentVersionSurMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		subsequentVersionMaterialAward,
		nominatedEntityRel,
		nominatedEntity,
		nominatedMembers
		ORDER BY nominatedEntityRel.nominationPosition, nominatedEntityRel.entityPosition

	WITH
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
		awards,
		nominatedSubsequentVersionMaterial,
		nominatedSubsequentVersionSurMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		subsequentVersionMaterialAward,
		COLLECT(
			CASE nominatedEntity WHEN NULL
				THEN null
				ELSE nominatedEntity { .model, .uuid, .name, members: nominatedMembers }
			END
		) AS nominatedEntities

	WITH
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
		awards,
		nominatedSubsequentVersionMaterial,
		nominatedSubsequentVersionSurMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		subsequentVersionMaterialAward,
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
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
		awards,
		nominatedSubsequentVersionMaterial,
		nominatedSubsequentVersionSurMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		subsequentVersionMaterialAward,
		nominatedEntities,
		nominatedProductionRel,
		nominatedProduction,
		venue,
		surVenue,
		surProduction
		ORDER BY nominatedProductionRel.productionPosition

	WITH
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
		awards,
		nominatedSubsequentVersionMaterial,
		nominatedSubsequentVersionSurMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		subsequentVersionMaterialAward,
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
			nominatedMaterialRel.uuid <> nominatedSubsequentVersionMaterial.uuid

	OPTIONAL MATCH (nominatedMaterial)<-[:HAS_SUB_MATERIAL]-(nominatedSurMaterial:Material)

	WITH
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
		awards,
		nominatedSubsequentVersionMaterial,
		nominatedSubsequentVersionSurMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		subsequentVersionMaterialAward,
		nominatedEntities,
		nominatedProductions,
		nominatedMaterialRel,
		nominatedMaterial,
		nominatedSurMaterial
		ORDER BY nominatedMaterialRel.materialPosition

	WITH
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
		awards,
		nominatedSubsequentVersionMaterial,
		nominatedSubsequentVersionSurMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		subsequentVersionMaterialAward,
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
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
		awards,
		nomineeRel.isWinner AS isWinner,
		nomineeRel.customType AS customType,
		category,
		categoryRel,
		ceremony,
		subsequentVersionMaterialAward,
		nominatedEntities,
		nominatedProductions,
		nominatedMaterials,
		COLLECT(
			CASE nominatedSubsequentVersionMaterial WHEN NULL
				THEN null
				ELSE nominatedSubsequentVersionMaterial {
					model: 'MATERIAL',
					.uuid,
					.name,
					.format,
					.year,
					surMaterial: CASE nominatedSubsequentVersionSurMaterial WHEN NULL
						THEN null
						ELSE nominatedSubsequentVersionSurMaterial { model: 'MATERIAL', .uuid, .name }
					END
				}
			END
		) AS nominatedSubsequentVersionMaterials

	WITH
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
		awards,
		category,
		categoryRel,
		ceremony,
		subsequentVersionMaterialAward,
		COLLECT({
			model: 'NOMINATION',
			isWinner: COALESCE(isWinner, false),
			type: COALESCE(customType, CASE WHEN isWinner THEN 'Winner' ELSE 'Nomination' END),
			entities: nominatedEntities,
			productions: nominatedProductions,
			materials: nominatedMaterials,
			subsequentVersionMaterials: nominatedSubsequentVersionMaterials
		}) AS nominations
		ORDER BY categoryRel.position

	WITH
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
		awards,
		ceremony,
		subsequentVersionMaterialAward,
		COLLECT(category { model: 'AWARD_CEREMONY_CATEGORY', .name, nominations }) AS categories
		ORDER BY ceremony.name DESC

	WITH
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
		awards,
		subsequentVersionMaterialAward,
		COLLECT(ceremony { model: 'AWARD_CEREMONY', .uuid, .name, categories }) AS ceremonies
		ORDER BY subsequentVersionMaterialAward.name

	WITH
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
		awards,
		COLLECT(subsequentVersionMaterialAward {
			model: 'AWARD',
			.uuid,
			.name,
			ceremonies
		}) AS subsequentVersionMaterialAwards

	OPTIONAL MATCH path=(person)
		<-[writingRel:HAS_WRITING_ENTITY]-(:Material)<-[:USES_SOURCE_MATERIAL*0..1]-(nominatedSourcingMaterial:Material)
		<-[nomineeRel:HAS_NOMINEE]-(category:AwardCeremonyCategory)
		<-[categoryRel:PRESENTS_CATEGORY]-(ceremony:AwardCeremony)
	WHERE
		writingRel.creditType = 'NON_SPECIFIC_SOURCE_MATERIAL' OR
		ANY(rel IN RELATIONSHIPS(path) WHERE TYPE(rel) = 'USES_SOURCE_MATERIAL')

	OPTIONAL MATCH (nominatedSourcingMaterial)<-[:HAS_SUB_MATERIAL]-(nominatedSourcingSurMaterial:Material)

	OPTIONAL MATCH (ceremony)<-[:PRESENTED_AT]-(sourcingMaterialAward:Award)

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
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
		awards,
		subsequentVersionMaterialAwards,
		nominatedSourcingMaterial,
		nominatedSourcingSurMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		sourcingMaterialAward,
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
				person,
				materials,
				producerProductions,
				castMemberProductions,
				creativeProductions,
				crewProductions,
				awards,
				subsequentVersionMaterialAwards,
				nominatedSourcingMaterial,
				nominatedSourcingSurMaterial,
				nomineeRel,
				category,
				categoryRel,
				ceremony,
				sourcingMaterialAward,
				nominatedEntityRel,
				nominatedEntity,
				nominatedMember
				ORDER BY nominatedMemberRel.memberPosition

			WITH
				person,
				materials,
				producerProductions,
				castMemberProductions,
				creativeProductions,
				crewProductions,
				awards,
				subsequentVersionMaterialAwards,
				nominatedSourcingMaterial,
				nominatedSourcingSurMaterial,
				nomineeRel,
				category,
				categoryRel,
				ceremony,
				sourcingMaterialAward,
				nominatedEntityRel,
				nominatedEntity,
				COLLECT(nominatedMember { model: 'PERSON', .uuid, .name }) AS nominatedMembers

	WITH
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
		awards,
		subsequentVersionMaterialAwards,
		nominatedSourcingMaterial,
		nominatedSourcingSurMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		sourcingMaterialAward,
		nominatedEntityRel,
		nominatedEntity,
		nominatedMembers
		ORDER BY nominatedEntityRel.nominationPosition, nominatedEntityRel.entityPosition

	WITH
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
		awards,
		subsequentVersionMaterialAwards,
		nominatedSourcingMaterial,
		nominatedSourcingSurMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		sourcingMaterialAward,
		COLLECT(
			CASE nominatedEntity WHEN NULL
				THEN null
				ELSE nominatedEntity { .model, .uuid, .name, members: nominatedMembers }
			END
		) AS nominatedEntities

	WITH
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
		awards,
		subsequentVersionMaterialAwards,
		nominatedSourcingMaterial,
		nominatedSourcingSurMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		sourcingMaterialAward,
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
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
		awards,
		subsequentVersionMaterialAwards,
		nominatedSourcingMaterial,
		nominatedSourcingSurMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		sourcingMaterialAward,
		nominatedEntities,
		nominatedProductionRel,
		nominatedProduction,
		venue,
		surVenue,
		surProduction
		ORDER BY nominatedProductionRel.productionPosition

	WITH
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
		awards,
		subsequentVersionMaterialAwards,
		nominatedSourcingMaterial,
		nominatedSourcingSurMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		sourcingMaterialAward,
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
			nominatedMaterialRel.uuid <> nominatedSourcingMaterial.uuid

	OPTIONAL MATCH (nominatedMaterial)<-[:HAS_SUB_MATERIAL]-(nominatedSurMaterial:Material)

	WITH
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
		awards,
		subsequentVersionMaterialAwards,
		nominatedSourcingMaterial,
		nominatedSourcingSurMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		sourcingMaterialAward,
		nominatedEntities,
		nominatedProductions,
		nominatedMaterialRel,
		nominatedMaterial,
		nominatedSurMaterial
		ORDER BY nominatedMaterialRel.materialPosition

	WITH
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
		awards,
		subsequentVersionMaterialAwards,
		nominatedSourcingMaterial,
		nominatedSourcingSurMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		sourcingMaterialAward,
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
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
		awards,
		subsequentVersionMaterialAwards,
		nomineeRel.isWinner AS isWinner,
		nomineeRel.customType AS customType,
		category,
		categoryRel,
		ceremony,
		sourcingMaterialAward,
		nominatedEntities,
		nominatedProductions,
		nominatedMaterials,
		COLLECT(
			CASE nominatedSourcingMaterial WHEN NULL
				THEN null
				ELSE nominatedSourcingMaterial {
					model: 'MATERIAL',
					.uuid,
					.name,
					.format,
					.year,
					surMaterial: CASE nominatedSourcingSurMaterial WHEN NULL
						THEN null
						ELSE nominatedSourcingSurMaterial { model: 'MATERIAL', .uuid, .name }
					END
				}
			END
		) AS nominatedSourcingMaterials

	WITH
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
		awards,
		subsequentVersionMaterialAwards,
		category,
		categoryRel,
		ceremony,
		sourcingMaterialAward,
		COLLECT({
			model: 'NOMINATION',
			isWinner: COALESCE(isWinner, false),
			type: COALESCE(customType, CASE WHEN isWinner THEN 'Winner' ELSE 'Nomination' END),
			entities: nominatedEntities,
			productions: nominatedProductions,
			materials: nominatedMaterials,
			sourcingMaterials: nominatedSourcingMaterials
		}) AS nominations
		ORDER BY categoryRel.position

	WITH
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
		awards,
		subsequentVersionMaterialAwards,
		ceremony,
		sourcingMaterialAward,
		COLLECT(category { model: 'AWARD_CEREMONY_CATEGORY', .name, nominations }) AS categories
		ORDER BY ceremony.name DESC

	WITH
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
		awards,
		subsequentVersionMaterialAwards,
		sourcingMaterialAward,
		COLLECT(ceremony { model: 'AWARD_CEREMONY', .uuid, .name, categories }) AS ceremonies
		ORDER BY sourcingMaterialAward.name

	WITH
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
		awards,
		subsequentVersionMaterialAwards,
		COLLECT(sourcingMaterialAward { model: 'AWARD', .uuid, .name, ceremonies }) AS sourcingMaterialAwards

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
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
		awards,
		subsequentVersionMaterialAwards,
		sourcingMaterialAwards,
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
				person,
				materials,
				producerProductions,
				castMemberProductions,
				creativeProductions,
				crewProductions,
				awards,
				subsequentVersionMaterialAwards,
				sourcingMaterialAwards,
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
				person,
				materials,
				producerProductions,
				castMemberProductions,
				creativeProductions,
				crewProductions,
				awards,
				subsequentVersionMaterialAwards,
				sourcingMaterialAwards,
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
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
		awards,
		subsequentVersionMaterialAwards,
		sourcingMaterialAwards,
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
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
		awards,
		subsequentVersionMaterialAwards,
		sourcingMaterialAwards,
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
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
		awards,
		subsequentVersionMaterialAwards,
		sourcingMaterialAwards,
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
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
		awards,
		subsequentVersionMaterialAwards,
		sourcingMaterialAwards,
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
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
		awards,
		subsequentVersionMaterialAwards,
		sourcingMaterialAwards,
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
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
		awards,
		subsequentVersionMaterialAwards,
		sourcingMaterialAwards,
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
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
		awards,
		subsequentVersionMaterialAwards,
		sourcingMaterialAwards,
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
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
		awards,
		subsequentVersionMaterialAwards,
		sourcingMaterialAwards,
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
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
		awards,
		subsequentVersionMaterialAwards,
		sourcingMaterialAwards,
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
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
		awards,
		subsequentVersionMaterialAwards,
		sourcingMaterialAwards,
		ceremony,
		rightsGrantorMaterialAward,
		COLLECT(category { model: 'AWARD_CEREMONY_CATEGORY', .name, nominations }) AS categories
		ORDER BY ceremony.name DESC

	WITH
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
		awards,
		subsequentVersionMaterialAwards,
		sourcingMaterialAwards,
		rightsGrantorMaterialAward,
		COLLECT(ceremony { model: 'AWARD_CEREMONY', .uuid, .name, categories }) AS ceremonies
		ORDER BY rightsGrantorMaterialAward.name

	RETURN
		'PERSON' AS model,
		person.uuid AS uuid,
		person.name AS name,
		person.differentiator AS differentiator,
		[
			material IN materials WHERE
				material.hasDirectCredit AND
				NOT material.isSubsequentVersion AND
				material.creditType IS NULL |
			material { .model, .uuid, .name, .format, .year, .writingCredits, .surMaterial }
		] AS materials,
		[
			material IN materials WHERE material.isSubsequentVersion |
			material { .model, .uuid, .name, .format, .year, .writingCredits, .surMaterial }
		] AS subsequentVersionMaterials,
		[
			material IN materials WHERE
				material.isSourcingMaterial OR
				material.creditType = 'NON_SPECIFIC_SOURCE_MATERIAL' |
			material { .model, .uuid, .name, .format, .year, .writingCredits, .surMaterial }
		] AS sourcingMaterials,
		[
			material IN materials WHERE material.creditType = 'RIGHTS_GRANTOR' |
			material { .model, .uuid, .name, .format, .year, .writingCredits, .surMaterial }
		] AS rightsGrantorMaterials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
		awards,
		subsequentVersionMaterialAwards,
		sourcingMaterialAwards,
		COLLECT(rightsGrantorMaterialAward { model: 'AWARD', .uuid, .name, ceremonies }) AS rightsGrantorMaterialAwards
`;
