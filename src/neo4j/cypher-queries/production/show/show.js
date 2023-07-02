export default () => `
	MATCH (production:Production { uuid: $uuid })

	OPTIONAL MATCH (production)<-[:HAS_SUB_PRODUCTION*1..2]-(surProduction:Production)

	OPTIONAL MATCH (production)-[:HAS_SUB_PRODUCTION*1..2]->(subProduction:Production)

	WITH
		production,
		COLLECT(surProduction) AS surProductions,
		COLLECT(subProduction) AS subProductions

	WITH
		production,
		[production] + surProductions + subProductions AS collectionProductions

	UNWIND (CASE collectionProductions WHEN [] THEN [null] ELSE collectionProductions END) AS collectionProduction

		OPTIONAL MATCH (collectionProduction)-[surProductionRel:HAS_SUB_PRODUCTION]->(production)

		OPTIONAL MATCH (collectionProduction)-[surSurProductionRel:HAS_SUB_PRODUCTION]->
			(:Production)-[:HAS_SUB_PRODUCTION]->(production)

		OPTIONAL MATCH (collectionProduction)<-[subProductionRel:HAS_SUB_PRODUCTION]-(production)

		OPTIONAL MATCH (collectionProduction)<-[subSubProductionRel:HAS_SUB_PRODUCTION]-
			(subSubProductionSurProduction:Production)<-[:HAS_SUB_PRODUCTION]-(production)

		WITH
			production,
			collectionProduction,
			CASE WHEN production = collectionProduction THEN true ELSE false END AS isSubjectProduction,
			CASE WHEN surProductionRel IS NULL THEN false ELSE true END AS isSurProduction,
			CASE WHEN surSurProductionRel IS NULL THEN false ELSE true END AS isSurSurProduction,
			CASE WHEN subProductionRel IS NULL THEN false ELSE true END AS isSubProduction,
			subProductionRel.position AS subProductionPosition,
			CASE WHEN subSubProductionRel IS NULL THEN false ELSE true END AS isSubSubProduction,
			subSubProductionRel.position AS subSubProductionPosition,
			subSubProductionSurProduction.uuid AS subSubProductionSurProductionUuid

		OPTIONAL MATCH (collectionProduction)-[:PRODUCTION_OF]->(material:Material)

		OPTIONAL MATCH (material)<-[:HAS_SUB_MATERIAL]-(surMaterial:Material)

		OPTIONAL MATCH (surMaterial)<-[:HAS_SUB_MATERIAL]-(surSurMaterial:Material)

		OPTIONAL MATCH (material)-[entityRel:HAS_WRITING_ENTITY|USES_SOURCE_MATERIAL]->(entity:Person|Company|Material)

		OPTIONAL MATCH (entity:Material)<-[:HAS_SUB_MATERIAL]-(entitySurMaterial:Material)

		OPTIONAL MATCH (entitySurMaterial)<-[:HAS_SUB_MATERIAL]-(entitySurSurMaterial:Material)

		OPTIONAL MATCH (entity:Material)-[sourceMaterialWriterRel:HAS_WRITING_ENTITY]->
			(sourceMaterialWriter:Person|Company)

		WITH
			production,
			collectionProduction,
			isSubjectProduction,
			isSurProduction,
			isSurSurProduction,
			isSubProduction,
			subProductionPosition,
			isSubSubProduction,
			subSubProductionPosition,
			subSubProductionSurProductionUuid,
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
			collectionProduction,
			isSubjectProduction,
			isSurProduction,
			isSurSurProduction,
			isSubProduction,
			subProductionPosition,
			isSubSubProduction,
			subSubProductionPosition,
			subSubProductionSurProductionUuid,
			material,
			surMaterial,
			surSurMaterial,
			entityRel,
			entity,
			entitySurMaterial,
			entitySurSurMaterial,
			sourceMaterialWriterRel.credit AS sourceMaterialWritingCreditName,
			COLLECT(
				CASE WHEN sourceMaterialWriter IS NULL
					THEN null
					ELSE sourceMaterialWriter { model: TOUPPER(HEAD(LABELS(sourceMaterialWriter))), .uuid, .name }
				END
			) AS sourceMaterialWriters

		WITH
			production,
			collectionProduction,
			isSubjectProduction,
			isSurProduction,
			isSurSurProduction,
			isSubProduction,
			subProductionPosition,
			isSubSubProduction,
			subSubProductionPosition,
			subSubProductionSurProductionUuid,
			material,
			surMaterial,
			surSurMaterial,
			entityRel,
			entity,
			entitySurMaterial,
			entitySurSurMaterial,
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
			production,
			collectionProduction,
			isSubjectProduction,
			isSurProduction,
			isSurSurProduction,
			isSubProduction,
			subProductionPosition,
			isSubSubProduction,
			subSubProductionPosition,
			subSubProductionSurProductionUuid,
			material,
			surMaterial,
			surSurMaterial,
			entityRel.credit AS writingCreditName,
			COLLECT(
				CASE WHEN entity IS NULL
					THEN null
					ELSE entity {
						model: TOUPPER(HEAD(LABELS(entity))),
						.uuid,
						.name,
						.format,
						.year,
						surMaterial: CASE WHEN entitySurMaterial IS NULL
							THEN null
							ELSE entitySurMaterial {
								model: 'MATERIAL',
								.uuid,
								.name,
								surMaterial: CASE WHEN entitySurSurMaterial IS NULL
									THEN null
									ELSE entitySurSurMaterial { model: 'MATERIAL', .uuid, .name }
								END
							}
						END,
						writingCredits: sourceMaterialWritingCredits
					}
				END
			) AS entities

		WITH
			production,
			collectionProduction,
			isSubjectProduction,
			isSurProduction,
			isSurSurProduction,
			isSubProduction,
			subProductionPosition,
			isSubSubProduction,
			subSubProductionPosition,
			subSubProductionSurProductionUuid,
			material,
			surMaterial,
			surSurMaterial,
			writingCreditName,
			[entity IN entities | CASE entity.model WHEN 'MATERIAL'
				THEN entity
				ELSE entity { .model, .uuid, .name }
			END] AS entities

		WITH
			production,
			collectionProduction,
			isSubjectProduction,
			isSurProduction,
			isSurSurProduction,
			isSubProduction,
			subProductionPosition,
			isSubSubProduction,
			subSubProductionPosition,
			subSubProductionSurProductionUuid,
			material,
			surMaterial,
			surSurMaterial,
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

		WITH
			production,
			collectionProduction,
			isSubjectProduction,
			isSurProduction,
			isSurSurProduction,
			isSubProduction,
			subProductionPosition,
			isSubSubProduction,
			subSubProductionPosition,
			subSubProductionSurProductionUuid,
			CASE WHEN material IS NULL
				THEN null
				ELSE material {
					model: 'MATERIAL',
					.uuid,
					.name,
					.format,
					.year,
					surMaterial: CASE WHEN surMaterial IS NULL
						THEN null
						ELSE surMaterial {
							model: 'MATERIAL',
							.uuid,
							.name,
							surMaterial: CASE WHEN surSurMaterial IS NULL
								THEN null
								ELSE surSurMaterial { model: 'MATERIAL', .uuid, .name }
							END
						}
					END,
					writingCredits
				}
			END AS material

		OPTIONAL MATCH (collectionProduction)-[:PLAYS_AT]->(venue:Venue)

		OPTIONAL MATCH (venue)<-[:HAS_SUB_VENUE]-(surVenue:Venue)

		WITH
			production,
			collectionProduction,
			isSubjectProduction,
			isSurProduction,
			isSurSurProduction,
			isSubProduction,
			subProductionPosition,
			isSubSubProduction,
			subSubProductionPosition,
			subSubProductionSurProductionUuid,
			material,
			CASE WHEN venue IS NULL
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
			END AS venue

		OPTIONAL MATCH (collectionProduction)-[producerEntityRel:HAS_PRODUCER_ENTITY]->(producerEntity)
			WHERE
				(producerEntity:Person AND producerEntityRel.creditedCompanyUuid IS NULL) OR
				producerEntity:Company

		WITH
			production,
			collectionProduction,
			isSubjectProduction,
			isSurProduction,
			isSurSurProduction,
			isSubProduction,
			subProductionPosition,
			isSubSubProduction,
			subSubProductionPosition,
			subSubProductionSurProductionUuid,
			material,
			venue,
			producerEntityRel,
			COLLECT(producerEntity {
				model: TOUPPER(HEAD(LABELS(producerEntity))),
				.uuid,
				.name,
				creditedMemberUuids: producerEntityRel.creditedMemberUuids
			}) AS producerEntities

		UNWIND (CASE producerEntities WHEN [] THEN [null] ELSE producerEntities END) AS producerEntity

			UNWIND (COALESCE(producerEntity.creditedMemberUuids, [null])) AS creditedMemberUuid

				OPTIONAL MATCH (collectionProduction)-[creditedMemberRel:HAS_PRODUCER_ENTITY]->
					(creditedMember:Person { uuid: creditedMemberUuid })
					WHERE
						producerEntityRel.creditPosition IS NULL OR
						producerEntityRel.creditPosition = creditedMemberRel.creditPosition

				WITH
					production,
					collectionProduction,
					isSubjectProduction,
					isSurProduction,
					isSurSurProduction,
					isSubProduction,
					subProductionPosition,
					isSubSubProduction,
					subSubProductionPosition,
					subSubProductionSurProductionUuid,
					material,
					venue,
					producerEntityRel,
					producerEntity,
					creditedMember
					ORDER BY creditedMemberRel.memberPosition

				WITH
					production,
					collectionProduction,
					isSubjectProduction,
					isSurProduction,
					isSurSurProduction,
					isSubProduction,
					subProductionPosition,
					isSubSubProduction,
					subSubProductionPosition,
					subSubProductionSurProductionUuid,
					material,
					venue,
					producerEntityRel,
					producerEntity,
					COLLECT(creditedMember { model: 'PERSON', .uuid, .name }) AS creditedMembers

		WITH
			production,
			collectionProduction,
			isSubjectProduction,
			isSurProduction,
			isSurSurProduction,
			isSubProduction,
			subProductionPosition,
			isSubSubProduction,
			subSubProductionPosition,
			subSubProductionSurProductionUuid,
			material,
			venue,
			producerEntityRel,
			producerEntity,
			creditedMembers
			ORDER BY producerEntityRel.creditPosition, producerEntityRel.entityPosition

		WITH
			production,
			collectionProduction,
			isSubjectProduction,
			isSurProduction,
			isSurSurProduction,
			isSubProduction,
			subProductionPosition,
			isSubSubProduction,
			subSubProductionPosition,
			subSubProductionSurProductionUuid,
			material,
			venue,
			producerEntityRel.credit AS producerCreditName,
			COLLECT(
				CASE WHEN producerEntity IS NULL
					THEN null
					ELSE producerEntity { .model, .uuid, .name, members: creditedMembers }
				END
			) AS producerEntities

		WITH
			production,
			collectionProduction,
			isSubjectProduction,
			isSurProduction,
			isSurSurProduction,
			isSubProduction,
			subProductionPosition,
			isSubSubProduction,
			subSubProductionPosition,
			subSubProductionSurProductionUuid,
			material,
			venue,
			producerCreditName,
			[producerEntity IN producerEntities | CASE producerEntity.model WHEN 'COMPANY'
				THEN producerEntity
				ELSE producerEntity { .model, .uuid, .name }
			END] AS producerEntities

		WITH
			production,
			collectionProduction,
			isSubjectProduction,
			isSurProduction,
			isSurSurProduction,
			isSubProduction,
			subProductionPosition,
			isSubSubProduction,
			subSubProductionPosition,
			subSubProductionSurProductionUuid,
			material,
			venue,
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

		OPTIONAL MATCH (collectionProduction)-[role:HAS_CAST_MEMBER]->(castMember:Person)

		OPTIONAL MATCH (castMember)<-[role]-(collectionProduction)-[:PRODUCTION_OF]->
			(:Material)-[characterRel:DEPICTS]->(character:Character)
			WHERE
				(
					role.roleName IN [character.name, characterRel.displayName] OR
					role.characterName IN [character.name, characterRel.displayName]
				) AND
				(role.characterDifferentiator IS NULL OR role.characterDifferentiator = character.differentiator)

		WITH DISTINCT
			production,
			collectionProduction,
			isSubjectProduction,
			isSurProduction,
			isSurSurProduction,
			isSubProduction,
			subProductionPosition,
			isSubSubProduction,
			subSubProductionPosition,
			subSubProductionSurProductionUuid,
			material,
			venue,
			producerCredits,
			castMember,
			role,
			character
			ORDER BY role.castMemberPosition, role.rolePosition

		WITH
			production,
			collectionProduction,
			isSubjectProduction,
			isSurProduction,
			isSurSurProduction,
			isSubProduction,
			subProductionPosition,
			isSubSubProduction,
			subSubProductionPosition,
			subSubProductionSurProductionUuid,
			material,
			venue,
			producerCredits,
			castMember,
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

		WITH
			production,
			collectionProduction,
			isSubjectProduction,
			isSurProduction,
			isSurSurProduction,
			isSubProduction,
			subProductionPosition,
			isSubSubProduction,
			subSubProductionPosition,
			subSubProductionSurProductionUuid,
			material,
			venue,
			producerCredits,
				COLLECT(
					CASE WHEN castMember IS NULL
						THEN null
						ELSE castMember { model: 'PERSON', .uuid, .name, roles }
					END
				) AS cast

		OPTIONAL MATCH (collectionProduction)-[creativeEntityRel:HAS_CREATIVE_ENTITY]->(creativeEntity)
			WHERE
				(creativeEntity:Person AND creativeEntityRel.creditedCompanyUuid IS NULL) OR
				creativeEntity:Company

		WITH
			production,
			collectionProduction,
			isSubjectProduction,
			isSurProduction,
			isSurSurProduction,
			isSubProduction,
			subProductionPosition,
			isSubSubProduction,
			subSubProductionPosition,
			subSubProductionSurProductionUuid,
			material,
			venue,
			producerCredits,
			cast,
			creativeEntityRel,
			COLLECT(creativeEntity {
				model: TOUPPER(HEAD(LABELS(creativeEntity))),
				.uuid,
				.name,
				creditedMemberUuids: creativeEntityRel.creditedMemberUuids
			}) AS creativeEntities

		UNWIND (CASE creativeEntities WHEN [] THEN [null] ELSE creativeEntities END) AS creativeEntity

			UNWIND (COALESCE(creativeEntity.creditedMemberUuids, [null])) AS creditedMemberUuid

				OPTIONAL MATCH (collectionProduction)-[creditedMemberRel:HAS_CREATIVE_ENTITY]->
					(creditedMember:Person { uuid: creditedMemberUuid })
					WHERE
						creativeEntityRel.creditPosition IS NULL OR
						creativeEntityRel.creditPosition = creditedMemberRel.creditPosition

				WITH
					production,
					collectionProduction,
					isSubjectProduction,
					isSurProduction,
					isSurSurProduction,
					isSubProduction,
					subProductionPosition,
					isSubSubProduction,
					subSubProductionPosition,
					subSubProductionSurProductionUuid,
					material,
					venue,
					producerCredits,
					cast,
					creativeEntityRel,
					creativeEntity,
					creditedMember
					ORDER BY creditedMemberRel.memberPosition

				WITH
					production,
					collectionProduction,
					isSubjectProduction,
					isSurProduction,
					isSurSurProduction,
					isSubProduction,
					subProductionPosition,
					isSubSubProduction,
					subSubProductionPosition,
					subSubProductionSurProductionUuid,
					material,
					venue,
					producerCredits,
					cast,
					creativeEntityRel,
					creativeEntity,
					COLLECT(creditedMember { model: 'PERSON', .uuid, .name }) AS creditedMembers

		WITH
			production,
			collectionProduction,
			isSubjectProduction,
			isSurProduction,
			isSurSurProduction,
			isSubProduction,
			subProductionPosition,
			isSubSubProduction,
			subSubProductionPosition,
			subSubProductionSurProductionUuid,
			material,
			venue,
			producerCredits,
			cast,
			creativeEntityRel,
			creativeEntity,
			creditedMembers
			ORDER BY creativeEntityRel.creditPosition, creativeEntityRel.entityPosition

		WITH
			production,
			collectionProduction,
			isSubjectProduction,
			isSurProduction,
			isSurSurProduction,
			isSubProduction,
			subProductionPosition,
			isSubSubProduction,
			subSubProductionPosition,
			subSubProductionSurProductionUuid,
			material,
			venue,
			producerCredits,
			cast,
			creativeEntityRel.credit AS creativeCreditName,
			COLLECT(
				CASE WHEN creativeEntity IS NULL
					THEN null
					ELSE creativeEntity { .model, .uuid, .name, members: creditedMembers }
				END
			) AS creativeEntities

		WITH
			production,
			collectionProduction,
			isSubjectProduction,
			isSurProduction,
			isSurSurProduction,
			isSubProduction,
			subProductionPosition,
			isSubSubProduction,
			subSubProductionPosition,
			subSubProductionSurProductionUuid,
			material,
			venue,
			producerCredits,
			cast,
			creativeCreditName,
			[creativeEntity IN creativeEntities | CASE creativeEntity.model WHEN 'COMPANY'
				THEN creativeEntity
				ELSE creativeEntity { .model, .uuid, .name }
			END] AS creativeEntities

		WITH
			production,
			collectionProduction,
			isSubjectProduction,
			isSurProduction,
			isSurSurProduction,
			isSubProduction,
			subProductionPosition,
			isSubSubProduction,
			subSubProductionPosition,
			subSubProductionSurProductionUuid,
			material,
			venue,
			producerCredits,
			cast,
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

		OPTIONAL MATCH (collectionProduction)-[crewEntityRel:HAS_CREW_ENTITY]->(crewEntity)
			WHERE
				(crewEntity:Person AND crewEntityRel.creditedCompanyUuid IS NULL) OR
				crewEntity:Company

		WITH
			production,
			collectionProduction,
			isSubjectProduction,
			isSurProduction,
			isSurSurProduction,
			isSubProduction,
			subProductionPosition,
			isSubSubProduction,
			subSubProductionPosition,
			subSubProductionSurProductionUuid,
			material,
			venue,
			producerCredits,
			cast,
			creativeCredits,
			crewEntityRel,
			COLLECT(crewEntity {
				model: TOUPPER(HEAD(LABELS(crewEntity))),
				.uuid,
				.name,
				creditedMemberUuids: crewEntityRel.creditedMemberUuids
			}) AS crewEntities

		UNWIND (CASE crewEntities WHEN [] THEN [null] ELSE crewEntities END) AS crewEntity

			UNWIND (COALESCE(crewEntity.creditedMemberUuids, [null])) AS creditedMemberUuid

				OPTIONAL MATCH (collectionProduction)-[creditedMemberRel:HAS_CREW_ENTITY]->
					(creditedMember:Person { uuid: creditedMemberUuid })
					WHERE
						crewEntityRel.creditPosition IS NULL OR
						crewEntityRel.creditPosition = creditedMemberRel.creditPosition

				WITH
					production,
					collectionProduction,
					isSubjectProduction,
					isSurProduction,
					isSurSurProduction,
					isSubProduction,
					subProductionPosition,
					isSubSubProduction,
					subSubProductionPosition,
					subSubProductionSurProductionUuid,
					material,
					venue,
					producerCredits,
					cast,
					creativeCredits,
					crewEntityRel,
					crewEntity,
					creditedMember
					ORDER BY creditedMemberRel.memberPosition

				WITH
					production,
					collectionProduction,
					isSubjectProduction,
					isSurProduction,
					isSurSurProduction,
					isSubProduction,
					subProductionPosition,
					isSubSubProduction,
					subSubProductionPosition,
					subSubProductionSurProductionUuid,
					material,
					venue,
					producerCredits,
					cast,
					creativeCredits,
					crewEntityRel,
					crewEntity,
					COLLECT(creditedMember { model: 'PERSON', .uuid, .name }) AS creditedMembers

		WITH
			production,
			collectionProduction,
			isSubjectProduction,
			isSurProduction,
			isSurSurProduction,
			isSubProduction,
			subProductionPosition,
			isSubSubProduction,
			subSubProductionPosition,
			subSubProductionSurProductionUuid,
			material,
			venue,
			producerCredits,
			cast,
			creativeCredits,
			crewEntityRel,
			crewEntity,
			creditedMembers
			ORDER BY crewEntityRel.creditPosition, crewEntityRel.entityPosition

		WITH
			production,
			collectionProduction,
			isSubjectProduction,
			isSurProduction,
			isSurSurProduction,
			isSubProduction,
			subProductionPosition,
			isSubSubProduction,
			subSubProductionPosition,
			subSubProductionSurProductionUuid,
			material,
			venue,
			producerCredits,
			cast,
			creativeCredits,
			crewEntityRel.credit AS crewCreditName,
			COLLECT(
				CASE WHEN crewEntity IS NULL
					THEN null
					ELSE crewEntity { .model, .uuid, .name, members: creditedMembers }
				END
			) AS crewEntities

		WITH
			production,
			collectionProduction,
			isSubjectProduction,
			isSurProduction,
			isSurSurProduction,
			isSubProduction,
			subProductionPosition,
			isSubSubProduction,
			subSubProductionPosition,
			subSubProductionSurProductionUuid,
			material,
			venue,
			producerCredits,
			cast,
			creativeCredits,
			crewCreditName,
			[crewEntity IN crewEntities | CASE crewEntity.model WHEN 'COMPANY'
				THEN crewEntity
				ELSE crewEntity { .model, .uuid, .name }
			END] AS crewEntities

		WITH
			production,
			collectionProduction,
			isSubjectProduction,
			isSurProduction,
			isSurSurProduction,
			isSubProduction,
			subProductionPosition,
			isSubSubProduction,
			subSubProductionPosition,
			subSubProductionSurProductionUuid,
			material,
			venue,
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
			ORDER BY subProductionPosition, subSubProductionPosition

		WITH production,
			COLLECT(
				collectionProduction {
					model: 'PRODUCTION',
					.uuid,
					.name,
					.startDate,
					.pressDate,
					.endDate,
					isSubjectProduction,
					isSurProduction,
					isSurSurProduction,
					isSubProduction,
					isSubSubProduction,
					subSubProductionSurProductionUuid,
					material,
					venue,
					producerCredits,
					cast,
					creativeCredits,
					crewCredits
				}
			) AS collectionProductions

		WITH production,
			HEAD([
				collectionProduction IN collectionProductions WHERE collectionProduction.isSubjectProduction |
				collectionProduction {
					.material,
					.venue,
					.producerCredits,
					.cast,
					.creativeCredits,
					.crewCredits
				}
			]) AS subjectProduction,
			HEAD([
				collectionProduction IN collectionProductions WHERE collectionProduction.isSurProduction |
				collectionProduction {
					.model,
					.uuid,
					.name,
					.startDate,
					.pressDate,
					.endDate,
					.material,
					.venue,
					surProduction: HEAD([
						surSurProduction IN collectionProductions WHERE surSurProduction.isSurSurProduction |
							surSurProduction {
								.model,
								.uuid,
								.name,
								.startDate,
								.pressDate,
								.endDate,
								.material,
								.venue,
								.producerCredits,
								.cast,
								.creativeCredits,
								.crewCredits
							}
					]),
					.producerCredits,
					.cast,
					.creativeCredits,
					.crewCredits
				}
			]) AS surProduction,
			[
				collectionProduction IN collectionProductions WHERE collectionProduction.isSubProduction |
				collectionProduction {
					.model,
					.uuid,
					.name,
					.startDate,
					.pressDate,
					.endDate,
					.material,
					.venue,
					subProductions: [
						subSubProduction IN collectionProductions
							WHERE
								subSubProduction.isSubSubProduction AND
								subSubProduction.subSubProductionSurProductionUuid = collectionProduction.uuid |
							subSubProduction {
								.model,
								.uuid,
								.name,
								.startDate,
								.pressDate,
								.endDate,
								.material,
								.venue,
								.producerCredits,
								.cast,
								.creativeCredits,
								.crewCredits
							}
					],
					.producerCredits,
					.cast,
					.creativeCredits,
					.crewCredits
				}
			] AS subProductions

	RETURN
		'PRODUCTION' AS model,
		production.uuid AS uuid,
		production.name AS name,
		production.startDate AS startDate,
		production.pressDate AS pressDate,
		production.endDate AS endDate,
		subjectProduction.material AS material,
		subjectProduction.venue AS venue,
		surProduction,
		subProductions,
		subjectProduction.producerCredits AS producerCredits,
		subjectProduction.cast AS cast,
		subjectProduction.creativeCredits AS creativeCredits,
		subjectProduction.crewCredits AS crewCredits
`;
