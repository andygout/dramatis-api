export default () => `
	MATCH (production:Production { uuid: $uuid })

	OPTIONAL MATCH (production)-[materialRel:PRODUCTION_OF]->(material:Material)

	OPTIONAL MATCH (material)<-[:HAS_SUB_MATERIAL]-(surMaterial:Material)

	OPTIONAL MATCH (material)-[entityRel:HAS_WRITING_ENTITY|USES_SOURCE_MATERIAL]->(entity)
		WHERE entity:Person OR entity:Company OR entity:Material

	OPTIONAL MATCH (entity:Material)<-[:HAS_SUB_MATERIAL]-(entitySurMaterial:Material)

	OPTIONAL MATCH (entity:Material)-[sourceMaterialWriterRel:HAS_WRITING_ENTITY]->(sourceMaterialWriter)
		WHERE sourceMaterialWriter:Person OR sourceMaterialWriter:Company

	WITH
		production,
		material,
		surMaterial,
		entityRel,
		entity,
		entitySurMaterial,
		sourceMaterialWriterRel,
		sourceMaterialWriter
		ORDER BY sourceMaterialWriterRel.creditPosition, sourceMaterialWriterRel.entityPosition

	WITH
		production,
		material,
		surMaterial,
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

	WITH production, material, surMaterial, entityRel, entity, entitySurMaterial,
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

	WITH production, material, surMaterial, entityRel.credit AS writingCreditName,
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

	WITH production, material, surMaterial, writingCreditName,
		[entity IN entities | CASE entity.model WHEN 'MATERIAL'
			THEN entity
			ELSE entity { .model, .uuid, .name }
		END] AS entities

	WITH production, material, surMaterial,
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

	WITH production,
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
				writingCredits
			}
		END AS material

	OPTIONAL MATCH (production)-[:PLAYS_AT]->(venue:Venue)

	OPTIONAL MATCH (venue)<-[:HAS_SUB_VENUE]-(surVenue:Venue)

	WITH production, material,
		CASE venue WHEN NULL
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
		END AS venue

	OPTIONAL MATCH (production)<-[:HAS_SUB_PRODUCTION]-(surProduction:Production)

	OPTIONAL MATCH (surProduction)-[:PLAYS_AT]->(surProductionVenue:Venue)

	OPTIONAL MATCH (surProductionVenue)-[:HAS_SUB_VENUE]-(surProductionSurVenue:Venue)

	WITH
		production,
		venue,
		material,
		CASE surProduction WHEN NULL
			THEN null
			ELSE surProduction {
				model: 'PRODUCTION',
				.uuid,
				.name,
				.startDate,
				.endDate,
				venue: CASE surProductionVenue WHEN NULL
					THEN null
					ELSE surProductionVenue {
						model: 'VENUE',
						.uuid,
						.name,
						surVenue: CASE surProductionSurVenue WHEN NULL
							THEN null
							ELSE surProductionSurVenue { model: 'VENUE', .uuid, .name }
						END
					}
				END
			}
		END AS surProduction

	OPTIONAL MATCH (production)-[subProductionRel:HAS_SUB_PRODUCTION]->(subProduction:Production)

	OPTIONAL MATCH (subProduction)-[:PLAYS_AT]->(subProductionVenue:Venue)

	OPTIONAL MATCH (subProductionVenue)-[:HAS_SUB_VENUE]-(subProductionSurVenue:Venue)

	WITH
		production,
		material,
		venue,
		surProduction,
		subProductionRel,
		subProduction,
		subProductionVenue,
		subProductionSurVenue
		ORDER BY subProduction.startDate DESC, subProductionRel.position

	WITH production, material, venue, surProduction,
		COLLECT(
			CASE subProduction WHEN NULL
				THEN null
				ELSE subProduction {
					model: 'PRODUCTION',
					.uuid,
					.name,
					.startDate,
					.endDate,
					venue: CASE subProductionVenue WHEN NULL
						THEN null
						ELSE subProductionVenue {
							model: 'VENUE',
							.uuid,
							.name,
							surVenue: CASE subProductionSurVenue WHEN NULL
								THEN null
								ELSE subProductionSurVenue { model: 'VENUE', .uuid, .name }
							END
						}
					END
				}
			END
		) AS subProductions

	OPTIONAL MATCH (production)-[producerEntityRel:HAS_PRODUCER_ENTITY]->(producerEntity)
		WHERE
			(producerEntity:Person AND producerEntityRel.creditedCompanyUuid IS NULL) OR
			producerEntity:Company

	WITH production, material, venue, surProduction, subProductions, producerEntityRel,
		COLLECT(producerEntity {
			model: TOUPPER(HEAD(LABELS(producerEntity))),
			.uuid,
			.name,
			creditedMemberUuids: producerEntityRel.creditedMemberUuids
		}) AS producerEntities

	UNWIND (CASE producerEntities WHEN [] THEN [null] ELSE producerEntities END) AS producerEntity

		UNWIND (COALESCE(producerEntity.creditedMemberUuids, [null])) AS creditedMemberUuid

			OPTIONAL MATCH (production)-[creditedMemberRel:HAS_PRODUCER_ENTITY]->
				(creditedMember:Person { uuid: creditedMemberUuid })
				WHERE
					producerEntityRel.creditPosition IS NULL OR
					producerEntityRel.creditPosition = creditedMemberRel.creditPosition

			WITH production, material, venue, surProduction, subProductions, producerEntityRel, producerEntity, creditedMember
				ORDER BY creditedMemberRel.memberPosition

			WITH production, material, venue, surProduction, subProductions, producerEntityRel, producerEntity,
				COLLECT(creditedMember { model: 'PERSON', .uuid, .name }) AS creditedMembers

	WITH production, material, venue, surProduction, subProductions, producerEntityRel, producerEntity, creditedMembers
		ORDER BY producerEntityRel.creditPosition, producerEntityRel.entityPosition

	WITH production, material, venue, surProduction, subProductions, producerEntityRel.credit AS producerCreditName,
		COLLECT(
			CASE producerEntity WHEN NULL
				THEN null
				ELSE producerEntity { .model, .uuid, .name, members: creditedMembers }
			END
		) AS producerEntities

	WITH production, material, venue, surProduction, subProductions, producerCreditName,
		[producerEntity IN producerEntities | CASE producerEntity.model WHEN 'COMPANY'
			THEN producerEntity
			ELSE producerEntity { .model, .uuid, .name }
		END] AS producerEntities

	WITH production, material, venue, surProduction, subProductions,
		COLLECT(
			CASE SIZE(producerEntities) WHEN 0
				THEN null
				ELSE {
					model: 'PRODUCER_CREDIT',
					name: COALESCE(producerCreditName, 'produced by'),
					entities: producerEntities
				}
			END
		) AS producerCredits

	OPTIONAL MATCH (production)-[role:HAS_CAST_MEMBER]->(castMember:Person)

	OPTIONAL MATCH (castMember)<-[role]-(production)-[:PRODUCTION_OF]->
		(:Material)-[characterRel:DEPICTS]->(character:Character)
		WHERE
			(
				role.roleName IN [character.name, characterRel.displayName] OR
				role.characterName IN [character.name, characterRel.displayName]
			) AND
			(role.characterDifferentiator IS NULL OR role.characterDifferentiator = character.differentiator)

	WITH DISTINCT production, material, venue, surProduction, subProductions, producerCredits, castMember, role, character
		ORDER BY role.castMemberPosition, role.rolePosition

	WITH production, material, venue, surProduction, subProductions, producerCredits, castMember,
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

	WITH production, material, venue, surProduction, subProductions, producerCredits,
		COLLECT(
			CASE castMember WHEN NULL
				THEN null
				ELSE castMember { model: 'PERSON', .uuid, .name, roles }
			END
		) AS cast

	OPTIONAL MATCH (production)-[creativeEntityRel:HAS_CREATIVE_ENTITY]->(creativeEntity)
		WHERE
			(creativeEntity:Person AND creativeEntityRel.creditedCompanyUuid IS NULL) OR
			creativeEntity:Company

	WITH production, material, venue, surProduction, subProductions, producerCredits, cast, creativeEntityRel,
		COLLECT(creativeEntity {
			model: TOUPPER(HEAD(LABELS(creativeEntity))),
			.uuid,
			.name,
			creditedMemberUuids: creativeEntityRel.creditedMemberUuids
		}) AS creativeEntities

	UNWIND (CASE creativeEntities WHEN [] THEN [null] ELSE creativeEntities END) AS creativeEntity

		UNWIND (COALESCE(creativeEntity.creditedMemberUuids, [null])) AS creditedMemberUuid

			OPTIONAL MATCH (production)-[creditedMemberRel:HAS_CREATIVE_ENTITY]->
				(creditedMember:Person { uuid: creditedMemberUuid })
				WHERE
					creativeEntityRel.creditPosition IS NULL OR
					creativeEntityRel.creditPosition = creditedMemberRel.creditPosition

			WITH production, material, venue, surProduction, subProductions, producerCredits, cast, creativeEntityRel, creativeEntity, creditedMember
				ORDER BY creditedMemberRel.memberPosition

			WITH production, material, venue, surProduction, subProductions, producerCredits, cast, creativeEntityRel, creativeEntity,
				COLLECT(creditedMember { model: 'PERSON', .uuid, .name }) AS creditedMembers

	WITH production, material, venue, surProduction, subProductions, producerCredits, cast, creativeEntityRel, creativeEntity, creditedMembers
		ORDER BY creativeEntityRel.creditPosition, creativeEntityRel.entityPosition

	WITH production, material, venue, surProduction, subProductions, producerCredits, cast, creativeEntityRel.credit AS creativeCreditName,
		COLLECT(
			CASE creativeEntity WHEN NULL
				THEN null
				ELSE creativeEntity { .model, .uuid, .name, members: creditedMembers }
			END
		) AS creativeEntities

	WITH production, material, venue, surProduction, subProductions, producerCredits, cast, creativeCreditName,
		[creativeEntity IN creativeEntities | CASE creativeEntity.model WHEN 'COMPANY'
			THEN creativeEntity
			ELSE creativeEntity { .model, .uuid, .name }
		END] AS creativeEntities

	WITH production, material, venue, surProduction, subProductions, producerCredits, cast,
		COLLECT(
			CASE SIZE(creativeEntities) WHEN 0
				THEN null
				ELSE {
					model: 'CREATIVE_CREDIT',
					name: creativeCreditName,
					entities: creativeEntities
				}
			END
		) AS creativeCredits

	OPTIONAL MATCH (production)-[crewEntityRel:HAS_CREW_ENTITY]->(crewEntity)
		WHERE
			(crewEntity:Person AND crewEntityRel.creditedCompanyUuid IS NULL) OR
			crewEntity:Company

	WITH production, material, venue, surProduction, subProductions, producerCredits, cast, creativeCredits, crewEntityRel,
		COLLECT(crewEntity {
			model: TOUPPER(HEAD(LABELS(crewEntity))),
			.uuid,
			.name,
			creditedMemberUuids: crewEntityRel.creditedMemberUuids
		}) AS crewEntities

	UNWIND (CASE crewEntities WHEN [] THEN [null] ELSE crewEntities END) AS crewEntity

		UNWIND (COALESCE(crewEntity.creditedMemberUuids, [null])) AS creditedMemberUuid

			OPTIONAL MATCH (production)-[creditedMemberRel:HAS_CREW_ENTITY]->
				(creditedMember:Person { uuid: creditedMemberUuid })
				WHERE
					crewEntityRel.creditPosition IS NULL OR
					crewEntityRel.creditPosition = creditedMemberRel.creditPosition

			WITH
				production,
				material,
				venue,
				surProduction,
				subProductions,
				producerCredits,
				cast,
				creativeCredits,
				crewEntityRel,
				crewEntity,
				creditedMember
				ORDER BY creditedMemberRel.memberPosition

			WITH production, material, venue, surProduction, subProductions, producerCredits, cast, creativeCredits, crewEntityRel, crewEntity,
				COLLECT(creditedMember { model: 'PERSON', .uuid, .name }) AS creditedMembers

	WITH
		production,
		material,
		venue,
		surProduction,
		subProductions,
		producerCredits,
		cast,
		creativeCredits,
		crewEntityRel,
		crewEntity,
		creditedMembers
		ORDER BY crewEntityRel.creditPosition, crewEntityRel.entityPosition

	WITH production, material, venue, surProduction, subProductions, producerCredits, cast, creativeCredits, crewEntityRel.credit AS crewCreditName,
		COLLECT(
			CASE crewEntity WHEN NULL
				THEN null
				ELSE crewEntity { .model, .uuid, .name, members: creditedMembers }
			END
		) AS crewEntities

	WITH production, material, venue, surProduction, subProductions, producerCredits, cast, creativeCredits, crewCreditName,
		[crewEntity IN crewEntities | CASE crewEntity.model WHEN 'COMPANY'
			THEN crewEntity
			ELSE crewEntity { .model, .uuid, .name }
		END] AS crewEntities

	WITH production, material, venue, surProduction, subProductions, cast, producerCredits, creativeCredits,
		COLLECT(
			CASE SIZE(crewEntities) WHEN 0
				THEN null
				ELSE {
					model: 'CREW_CREDIT',
					name: crewCreditName,
					entities: crewEntities
				}
			END
		) AS crewCredits

	OPTIONAL MATCH (production)-[:HAS_SUB_PRODUCTION*0..1]-(productionLinkedToCategory:Production)
		<-[nomineeRel:HAS_NOMINEE]-(category:AwardCeremonyCategory)
		<-[categoryRel:PRESENTS_CATEGORY]-(ceremony:AwardCeremony)

	OPTIONAL MATCH (productionLinkedToCategory)-[:PLAYS_AT]->(productionLinkedToCategoryVenue:Venue)

	OPTIONAL MATCH (productionLinkedToCategoryVenue)<-[:HAS_SUB_VENUE]-(productionLinkedToCategorySurVenue:Venue)

	OPTIONAL MATCH (ceremony)<-[:PRESENTED_AT]-(award:Award)

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
		production,
		material,
		venue,
		surProduction,
		subProductions,
		producerCredits,
		cast,
		creativeCredits,
		crewCredits,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		award,
		nominatedEntityRel,
		CASE WHEN production <> productionLinkedToCategory
			THEN productionLinkedToCategory {
				model: 'PRODUCTION',
				.uuid,
				.name,
				.startDate,
				.endDate,
				venue: CASE productionLinkedToCategoryVenue WHEN NULL
					THEN null
					ELSE productionLinkedToCategoryVenue {
						model: 'VENUE',
						.uuid,
						.name,
						surVenue: CASE productionLinkedToCategorySurVenue WHEN NULL
							THEN null
							ELSE productionLinkedToCategorySurVenue { model: 'VENUE', .uuid, .name }
						END
					}
				END
			}
			ELSE null
		END AS recipientProduction,
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
				production,
				material,
				venue,
				surProduction,
				subProductions,
				producerCredits,
				cast,
				creativeCredits,
				crewCredits,
				recipientProduction,
				nomineeRel,
				category,
				categoryRel,
				ceremony,
				award,
				nominatedEntityRel,
				nominatedEntity,
				nominatedMember
				ORDER BY nominatedMemberRel.memberPosition

			WITH
				production,
				material,
				venue,
				surProduction,
				subProductions,
				producerCredits,
				cast,
				creativeCredits,
				crewCredits,
				recipientProduction,
				nomineeRel,
				category,
				categoryRel,
				ceremony,
				award,
				nominatedEntityRel,
				nominatedEntity,
				COLLECT(nominatedMember { model: 'PERSON', .uuid, .name }) AS nominatedMembers

	WITH
		production,
		material,
		venue,
		surProduction,
		subProductions,
		producerCredits,
		cast,
		creativeCredits,
		crewCredits,
		recipientProduction,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		award,
		nominatedEntityRel,
		nominatedEntity,
		nominatedMembers
		ORDER BY nominatedEntityRel.nominationPosition, nominatedEntityRel.entityPosition

	WITH
		production,
		material,
		venue,
		surProduction,
		subProductions,
		producerCredits,
		cast,
		creativeCredits,
		crewCredits,
		recipientProduction,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		award,
		COLLECT(
			CASE nominatedEntity WHEN NULL
				THEN null
				ELSE nominatedEntity { .model, .uuid, .name, members: nominatedMembers }
			END
		) AS nominatedEntities

	WITH
		production,
		material,
		venue,
		surProduction,
		subProductions,
		producerCredits,
		cast,
		creativeCredits,
		crewCredits,
		recipientProduction,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		award,
		[nominatedEntity IN nominatedEntities | CASE nominatedEntity.model WHEN 'COMPANY'
			THEN nominatedEntity
			ELSE nominatedEntity { .model, .uuid, .name }
		END] AS nominatedEntities

	OPTIONAL MATCH (category)-[coNominatedProductionRel:HAS_NOMINEE]->(coNominatedProduction:Production)
		WHERE
			(
				nomineeRel.nominationPosition IS NULL OR
				nomineeRel.nominationPosition = coNominatedProductionRel.nominationPosition
			) AND
			coNominatedProduction.uuid <> production.uuid AND
			NOT EXISTS((production)-[:HAS_SUB_PRODUCTION]-(coNominatedProduction))

	OPTIONAL MATCH (coNominatedProduction)-[:PLAYS_AT]->(coNominatedProductionVenue:Venue)

	OPTIONAL MATCH (coNominatedProductionVenue)<-[:HAS_SUB_VENUE]-(coNominatedProductionSurVenue:Venue)

	OPTIONAL MATCH (coNominatedProduction)<-[:HAS_SUB_PRODUCTION]-(coNominatedProductionSurProduction:Production)

	WITH
		production,
		material,
		venue,
		surProduction,
		subProductions,
		producerCredits,
		cast,
		creativeCredits,
		crewCredits,
		recipientProduction,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		award,
		nominatedEntities,
		coNominatedProductionRel,
		coNominatedProduction,
		coNominatedProductionVenue,
		coNominatedProductionSurVenue,
		coNominatedProductionSurProduction
		ORDER BY coNominatedProductionRel.productionPosition

	WITH
		production,
		material,
		venue,
		surProduction,
		subProductions,
		producerCredits,
		cast,
		creativeCredits,
		crewCredits,
		recipientProduction,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		award,
		nominatedEntities,
		COLLECT(
			CASE coNominatedProduction WHEN NULL
				THEN null
				ELSE coNominatedProduction {
					model: 'PRODUCTION',
					.uuid,
					.name,
					.startDate,
					.endDate,
					venue: CASE coNominatedProductionVenue WHEN NULL
						THEN null
						ELSE coNominatedProductionVenue {
							model: 'VENUE',
							.uuid,
							.name,
							surVenue: CASE coNominatedProductionSurVenue WHEN NULL
								THEN null
								ELSE coNominatedProductionSurVenue { model: 'VENUE', .uuid, .name }
							END
						}
					END,
					surProduction: CASE coNominatedProductionSurProduction WHEN NULL
						THEN null
						ELSE coNominatedProductionSurProduction { model: 'PRODUCTION', .uuid, .name }
					END
				}
			END
		) AS coNominatedProductions

	OPTIONAL MATCH (category)-[nominatedMaterialRel:HAS_NOMINEE]->(nominatedMaterial:Material)
		WHERE
			(
				nomineeRel.nominationPosition IS NULL OR
				nomineeRel.nominationPosition = nominatedMaterialRel.nominationPosition
			)

	OPTIONAL MATCH (nominatedMaterial)<-[:HAS_SUB_MATERIAL]-(nominatedSurMaterial:Material)

	WITH
		production,
		material,
		venue,
		surProduction,
		subProductions,
		producerCredits,
		cast,
		creativeCredits,
		crewCredits,
		recipientProduction,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		award,
		nominatedEntities,
		coNominatedProductions,
		nominatedMaterialRel,
		nominatedMaterial,
		nominatedSurMaterial
		ORDER BY nominatedMaterialRel.materialPosition

	WITH
		production,
		material,
		venue,
		surProduction,
		subProductions,
		producerCredits,
		cast,
		creativeCredits,
		crewCredits,
		recipientProduction,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		award,
		nominatedEntities,
		coNominatedProductions,
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
		ORDER BY nomineeRel.nominationPosition

	WITH
		production,
		material,
		venue,
		surProduction,
		subProductions,
		producerCredits,
		cast,
		creativeCredits,
		crewCredits,
		category,
		categoryRel,
		ceremony,
		award,
		COLLECT({
			model: 'NOMINATION',
			isWinner: COALESCE(nomineeRel.isWinner, false),
			type: COALESCE(nomineeRel.customType, CASE WHEN nomineeRel.isWinner THEN 'Winner' ELSE 'Nomination' END),
			recipientProduction: CASE recipientProduction WHEN NULL THEN null ELSE recipientProduction END,
			entities: nominatedEntities,
			coProductions: coNominatedProductions,
			materials: nominatedMaterials
		}) AS nominations
		ORDER BY categoryRel.position

	WITH production, material, venue, surProduction, subProductions, producerCredits, cast, creativeCredits, crewCredits, ceremony, award,
		COLLECT(category { model: 'AWARD_CEREMONY_CATEGORY', .name, nominations }) AS categories
		ORDER BY ceremony.name DESC

	WITH production, material, venue, surProduction, subProductions, producerCredits, cast, creativeCredits, crewCredits, award,
		COLLECT(ceremony { model: 'AWARD_CEREMONY', .uuid, .name, categories }) AS ceremonies
		ORDER BY award.name

	RETURN
		'PRODUCTION' AS model,
		production.uuid AS uuid,
		production.name AS name,
		production.startDate AS startDate,
		production.pressDate AS pressDate,
		production.endDate AS endDate,
		material,
		venue,
		surProduction,
		subProductions,
		producerCredits,
		cast,
		creativeCredits,
		crewCredits,
		COLLECT(award { model: 'AWARD', .uuid, .name, ceremonies }) AS awards
`;
