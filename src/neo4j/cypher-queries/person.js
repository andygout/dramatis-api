const getShowQuery = () => `
	MATCH (person:Person { uuid: $uuid })

	OPTIONAL MATCH (person)<-[:HAS_WRITING_ENTITY|USES_SOURCE_MATERIAL*1..2]-(material:Material)

	WITH person, COLLECT(DISTINCT(material)) AS materials

	UNWIND (CASE materials WHEN [] THEN [null] ELSE materials END) AS material

		OPTIONAL MATCH (person)<-[writerRel:HAS_WRITING_ENTITY]-(material)

		OPTIONAL MATCH (person)<-[:HAS_WRITING_ENTITY]-(:Material)
			<-[subsequentVersionRel:SUBSEQUENT_VERSION_OF]-(material)

		OPTIONAL MATCH (person)<-[:HAS_WRITING_ENTITY]-(:Material)
			<-[sourcingMaterialRel:USES_SOURCE_MATERIAL]-(material)

		OPTIONAL MATCH (material)-[entityRel:HAS_WRITING_ENTITY|USES_SOURCE_MATERIAL]->(entity)
			WHERE entity:Person OR entity:Company OR entity:Material

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
			sourceMaterialWriterRel.credit AS sourceMaterialWritingCreditName,
			COLLECT(
				CASE sourceMaterialWriter WHEN NULL
					THEN null
					ELSE sourceMaterialWriter {
						model: TOUPPER(HEAD(LABELS(sourceMaterialWriter))),
						uuid: CASE sourceMaterialWriter.uuid WHEN person.uuid
							THEN null
							ELSE sourceMaterialWriter.uuid
						END,
						.name
					}
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
			[entity IN COLLECT(
				CASE entity WHEN NULL
					THEN null
					ELSE entity {
						model: TOUPPER(HEAD(LABELS(entity))),
						uuid: CASE entity.uuid WHEN person.uuid THEN null ELSE entity.uuid END,
						.name,
						.format,
						.year,
						writingCredits: sourceMaterialWritingCredits
					}
				END
			) | CASE entity.model WHEN 'MATERIAL'
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

	UNWIND (CASE WHEN entityRel IS NOT NULL AND EXISTS(entityRel.creditedMemberUuids)
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
			COLLECT(DISTINCT(creditedMember {
				model: 'PERSON',
				uuid: CASE creditedMember.uuid WHEN person.uuid THEN null ELSE creditedMember.uuid END,
				.name
			})) AS creditedMembers
		ORDER BY entityRel.creditPosition, entityRel.entityPosition

	WITH person, materials, production, entityRel.credit AS producerCreditName,
		[entity IN COLLECT(
			CASE entity WHEN NULL
				THEN null
				ELSE entity {
					model: TOUPPER(HEAD(LABELS(entity))),
					uuid: CASE entity.uuid WHEN person.uuid THEN null ELSE entity.uuid END,
					.name,
					members: creditedMembers
				}
			END
		) | CASE entity.model WHEN 'COMPANY'
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

	WITH person, materials, production, producerCredits, venue, surVenue
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
					producerCredits
				}
			END
		) AS producerProductions

	OPTIONAL MATCH (person)<-[role:HAS_CAST_MEMBER]-(production:Production)

	OPTIONAL MATCH (production)-[:PLAYS_AT]->(venue:Venue)

	OPTIONAL MATCH (venue)<-[:HAS_SUB_VENUE]-(surVenue:Venue)

	OPTIONAL MATCH (production)-[:PRODUCTION_OF]->(:Material)-[characterRel:DEPICTS]->(character:Character)
		WHERE
			(
				role.roleName IN [character.name, characterRel.displayName] OR
				role.characterName IN [character.name, characterRel.displayName]
			) AND
			(role.characterDifferentiator IS NULL OR role.characterDifferentiator = character.differentiator)

	WITH DISTINCT person, materials, producerProductions, production, venue, surVenue, role, character
		ORDER BY role.rolePosition

	WITH person, materials, producerProductions, production, venue, surVenue,
		COLLECT(
			CASE role.roleName WHEN NULL
				THEN { name: 'Performer' }
				ELSE role { model: 'CHARACTER', uuid: character.uuid, name: role.roleName, .qualifier, .isAlternate }
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
					roles
				}
			END
		) AS castMemberProductions

	OPTIONAL MATCH (person)<-[personRel:HAS_CREATIVE_ENTITY]-(production:Production)

	OPTIONAL MATCH (production)-[companyRel:HAS_CREATIVE_ENTITY]->
		(creditedEmployerCompany:Company { uuid: personRel.creditedCompanyUuid })
		WHERE
			personRel.creditPosition IS NULL OR
			personRel.creditPosition = companyRel.creditPosition

	UNWIND (CASE WHEN companyRel IS NOT NULL AND EXISTS(companyRel.creditedMemberUuids)
		THEN [uuid IN companyRel.creditedMemberUuids]
		ELSE [null]
	END) AS coCreditedMemberUuid

		OPTIONAL MATCH (production)-[coCreditedMemberRel:HAS_CREATIVE_ENTITY]->
			(coCreditedMember:Person { uuid: coCreditedMemberUuid })
			WHERE
				coCreditedMember.uuid <> person.uuid AND
				(
					companyRel.creditPosition IS NULL OR
					companyRel.creditPosition = coCreditedMemberRel.creditPosition
				)

		WITH
			person,
			materials,
			producerProductions,
			castMemberProductions,
			personRel,
			production,
			companyRel,
			creditedEmployerCompany,
			coCreditedMember
			ORDER BY coCreditedMemberRel.memberPosition

		WITH
			person,
			materials,
			producerProductions,
			castMemberProductions,
			personRel,
			production,
			companyRel,
			creditedEmployerCompany,
			COLLECT(coCreditedMember { model: 'PERSON', .uuid, .name }) AS coCreditedMembers

	WITH
		person,
		materials,
		producerProductions,
		castMemberProductions,
		personRel,
		production,
		CASE creditedEmployerCompany WHEN NULL
			THEN null
			ELSE creditedEmployerCompany { model: 'COMPANY', .uuid, .name, coMembers: coCreditedMembers }
		END AS creditedEmployerCompany,
		COALESCE(creditedEmployerCompany, person) AS entity,
		COALESCE(companyRel, personRel) AS entityRel

	OPTIONAL MATCH (production)-[coCreditedEntityRel:HAS_CREATIVE_ENTITY]->(coCreditedEntity)
		WHERE
			(coCreditedEntity:Person OR coCreditedEntity:Company) AND
			coCreditedEntityRel.creditedCompanyUuid IS NULL AND
			(
				entityRel.creditPosition IS NULL OR
				entityRel.creditPosition = coCreditedEntityRel.creditPosition
			) AND
			coCreditedEntity.uuid <> entity.uuid

	UNWIND (CASE WHEN coCreditedEntityRel IS NOT NULL AND EXISTS(coCreditedEntityRel.creditedMemberUuids)
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
		[coCreditedEntity IN COLLECT(
			CASE coCreditedEntity WHEN NULL
				THEN null
				ELSE coCreditedEntity {
					model: TOUPPER(HEAD(LABELS(coCreditedEntity))),
					.uuid,
					.name,
					members: coCreditedCompanyCreditedMembers
				}
			END
		) | CASE coCreditedEntity.model WHEN 'COMPANY'
			THEN coCreditedEntity
			ELSE coCreditedEntity { .model, .uuid, .name }
		END] AS coCreditedEntities
		ORDER BY entityRel.creditPosition

	OPTIONAL MATCH (production)-[:PLAYS_AT]->(venue:Venue)

	OPTIONAL MATCH (venue)<-[:HAS_SUB_VENUE]-(surVenue:Venue)

	WITH person, materials, producerProductions, castMemberProductions, production, venue, surVenue,
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
					creativeCredits
				}
			END
		) AS creativeProductions

	OPTIONAL MATCH (person)<-[personRel:HAS_CREW_ENTITY]-(production:Production)

	OPTIONAL MATCH (production)-[companyRel:HAS_CREW_ENTITY]->
		(creditedEmployerCompany:Company { uuid: personRel.creditedCompanyUuid })
		WHERE
			personRel.creditPosition IS NULL OR
			personRel.creditPosition = companyRel.creditPosition

	UNWIND (CASE WHEN companyRel IS NOT NULL AND EXISTS(companyRel.creditedMemberUuids)
		THEN [uuid IN companyRel.creditedMemberUuids]
		ELSE [null]
	END) AS coCreditedMemberUuid

		OPTIONAL MATCH (production)-[coCreditedMemberRel:HAS_CREW_ENTITY]->
			(coCreditedMember:Person { uuid: coCreditedMemberUuid })
			WHERE
				coCreditedMember.uuid <> person.uuid AND
				(
					companyRel.creditPosition IS NULL OR
					companyRel.creditPosition = coCreditedMemberRel.creditPosition
				)

		WITH
			person,
			materials,
			producerProductions,
			castMemberProductions,
			creativeProductions,
			personRel,
			production,
			companyRel,
			creditedEmployerCompany,
			coCreditedMember
			ORDER BY coCreditedMemberRel.memberPosition

		WITH
			person,
			materials,
			producerProductions,
			castMemberProductions,
			creativeProductions,
			personRel,
			production,
			companyRel,
			creditedEmployerCompany,
			COLLECT(coCreditedMember { model: 'PERSON', .uuid, .name }) AS coCreditedMembers

	WITH
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		personRel,
		production,
		CASE creditedEmployerCompany WHEN NULL
			THEN null
			ELSE creditedEmployerCompany { model: 'COMPANY', .uuid, .name, coMembers: coCreditedMembers }
		END AS creditedEmployerCompany,
		COALESCE(creditedEmployerCompany, person) AS entity,
		COALESCE(companyRel, personRel) AS entityRel

	OPTIONAL MATCH (production)-[coCreditedEntityRel:HAS_CREW_ENTITY]->(coCreditedEntity)
		WHERE
			(coCreditedEntity:Person OR coCreditedEntity:Company) AND
			coCreditedEntityRel.creditedCompanyUuid IS NULL AND
			(
				entityRel.creditPosition IS NULL OR
				entityRel.creditPosition = coCreditedEntityRel.creditPosition
			) AND
			coCreditedEntity.uuid <> entity.uuid

	UNWIND (CASE WHEN coCreditedEntityRel IS NOT NULL AND EXISTS(coCreditedEntityRel.creditedMemberUuids)
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
		[coCreditedEntity IN COLLECT(
			CASE coCreditedEntity WHEN NULL
				THEN null
				ELSE coCreditedEntity {
					model: TOUPPER(HEAD(LABELS(coCreditedEntity))),
					.uuid,
					.name,
					members: coCreditedCompanyCreditedMembers
				}
			END
		) | CASE coCreditedEntity.model WHEN 'COMPANY'
			THEN coCreditedEntity
			ELSE coCreditedEntity { .model, .uuid, .name }
		END] AS coCreditedEntities
		ORDER BY entityRel.creditPosition

	OPTIONAL MATCH (production)-[:PLAYS_AT]->(venue:Venue)

	OPTIONAL MATCH (venue)<-[:HAS_SUB_VENUE]-(surVenue:Venue)

	WITH
		person,
		materials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		production,
		venue,
		surVenue,
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
					crewCredits
				}
			END
		) AS crewProductions

	OPTIONAL MATCH (person)<-[personRel:HAS_NOMINEE]-(category:AwardCeremonyCategory)
		<-[categoryRel:PRESENTS_CATEGORY]-(ceremony:AwardCeremony)

	OPTIONAL MATCH (ceremony)<-[:PRESENTED_AT]-(award:Award)

	OPTIONAL MATCH (category)-[companyRel:HAS_NOMINEE]->
		(nominatedEmployerCompany:Company { uuid: personRel.nominatedCompanyUuid })
		WHERE
			personRel.nominationPosition IS NULL OR
			personRel.nominationPosition = companyRel.nominationPosition

	UNWIND (CASE WHEN companyRel IS NOT NULL AND EXISTS(companyRel.nominatedMemberUuids)
		THEN [uuid IN companyRel.nominatedMemberUuids]
		ELSE [null]
	END) AS coNominatedMemberUuid

		OPTIONAL MATCH (category)-[coNominatedMemberRel:HAS_NOMINEE]->
			(coNominatedMember:Person { uuid: coNominatedMemberUuid })
			WHERE
				coNominatedMember.uuid <> person.uuid AND
				(
					companyRel.nominationPosition IS NULL OR
					companyRel.nominationPosition = coNominatedMemberRel.nominationPosition
				)

		WITH
			person,
			materials,
			producerProductions,
			castMemberProductions,
			creativeProductions,
			crewProductions,
			personRel,
			companyRel,
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
			personRel,
			companyRel,
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
		COALESCE(companyRel, personRel) AS entityRel

	OPTIONAL MATCH (category)-[coNominatedEntityRel:HAS_NOMINEE]->(coNominatedEntity)
		WHERE
			(coNominatedEntity:Person OR coNominatedEntity:Company) AND
			coNominatedEntityRel.nominatedCompanyUuid IS NULL AND
			(
				entityRel.nominationPosition IS NULL OR
				entityRel.nominationPosition = coNominatedEntityRel.nominationPosition
			) AND
			coNominatedEntity.uuid <> entity.uuid

	UNWIND (CASE WHEN coNominatedEntityRel IS NOT NULL AND EXISTS(coNominatedEntityRel.nominatedMemberUuids)
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
		[coNominatedEntity IN COLLECT(
			CASE coNominatedEntity WHEN NULL
				THEN null
				ELSE coNominatedEntity {
					model: TOUPPER(HEAD(LABELS(coNominatedEntity))),
					.uuid,
					.name,
					members: coNominatedCompanyNominatedMembers
				}
			END
		) | CASE coNominatedEntity.model WHEN 'COMPANY'
			THEN coNominatedEntity
			ELSE coNominatedEntity { .model, .uuid, .name }
		END] AS coNominatedEntities
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
			employerCompany: nominatedEmployerCompany,
			coEntities: coNominatedEntities
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
			material { .model, .uuid, .name, .format, .year, .writingCredits }
		] AS materials,
		[
			material IN materials WHERE material.isSubsequentVersion |
			material { .model, .uuid, .name, .format, .year, .writingCredits }
		] AS subsequentVersionMaterials,
		[
			material IN materials WHERE
				material.isSourcingMaterial OR
				material.creditType = 'NON_SPECIFIC_SOURCE_MATERIAL' |
			material { .model, .uuid, .name, .format, .year, .writingCredits }
		] AS sourcingMaterials,
		[
			material IN materials WHERE material.creditType = 'RIGHTS_GRANTOR' |
			material { .model, .uuid, .name, .format, .year, .writingCredits }
		] AS rightsGrantorMaterials,
		producerProductions,
		castMemberProductions,
		creativeProductions,
		crewProductions,
		COLLECT(award { model: 'AWARD', .uuid, .name, ceremonies }) AS awards
`;

export {
	getShowQuery
};
