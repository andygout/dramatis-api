export default () => `
	MATCH (production:Production { uuid: $uuid })

	OPTIONAL MATCH (production)-[materialRel:PRODUCTION_OF]->(material:Material)

	OPTIONAL MATCH (material)<-[:HAS_SUB_MATERIAL]-(surMaterial:Material)

	OPTIONAL MATCH (surMaterial)<-[:HAS_SUB_MATERIAL]-(surSurMaterial:Material)

	OPTIONAL MATCH (material)-[entityRel:HAS_WRITING_ENTITY|USES_SOURCE_MATERIAL]->(entity)
		WHERE entity:Person OR entity:Company OR entity:Material

	OPTIONAL MATCH (entity:Material)<-[:HAS_SUB_MATERIAL]-(entitySurMaterial:Material)

	OPTIONAL MATCH (entitySurMaterial)<-[:HAS_SUB_MATERIAL]-(entitySurSurMaterial:Material)

	OPTIONAL MATCH (entity:Material)-[sourceMaterialWriterRel:HAS_WRITING_ENTITY]->(sourceMaterialWriter)
		WHERE sourceMaterialWriter:Person OR sourceMaterialWriter:Company

	WITH
		production,
		material,
		surMaterial,
		surSurMaterial,
		entityRel,
		entity,
		entitySurMaterial,
		entitySurSurMaterial,
		sourceMaterialWriterRel,
		sourceMaterialWriter
		ORDER BY sourceMaterialWriterRel.creditPosition, sourceMaterialWriterRel.entityPosition

	WITH
		production,
		material,
		surMaterial,
		surSurMaterial,
		entityRel,
		entity,
		entitySurMaterial,
		entitySurSurMaterial,
		sourceMaterialWriterRel.credit AS sourceMaterialWritingCreditName,
		COLLECT(
			CASE sourceMaterialWriter WHEN NULL
				THEN null
				ELSE sourceMaterialWriter { model: TOUPPER(HEAD(LABELS(sourceMaterialWriter))), .uuid, .name }
			END
		) AS sourceMaterialWriters

	WITH production, material, surMaterial, surSurMaterial, entityRel, entity, entitySurMaterial, entitySurSurMaterial,
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

	WITH production, material, surMaterial, surSurMaterial, entityRel.credit AS writingCreditName,
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
						ELSE entitySurMaterial {
							model: 'MATERIAL',
							.uuid,
							.name,
							surMaterial: CASE entitySurSurMaterial WHEN NULL
								THEN null
								ELSE entitySurSurMaterial { model: 'MATERIAL', .uuid, .name }
							END
						}
					END,
					writingCredits: sourceMaterialWritingCredits
				}
			END
		) AS entities

	WITH production, material, surMaterial, surSurMaterial, writingCreditName,
		[entity IN entities | CASE entity.model WHEN 'MATERIAL'
			THEN entity
			ELSE entity { .model, .uuid, .name }
		END] AS entities

	WITH production, material, surMaterial, surSurMaterial,
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
					ELSE surMaterial {
						model: 'MATERIAL',
						.uuid,
						.name,
						surMaterial: CASE surSurMaterial WHEN NULL
							THEN null
							ELSE surSurMaterial { model: 'MATERIAL', .uuid, .name }
						END
					}
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
`;
