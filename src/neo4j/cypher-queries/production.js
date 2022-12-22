import { ACTIONS } from '../../utils/constants';

const getCreateUpdateQuery = action => {

	const createUpdateQueryOpeningMap = {
		[ACTIONS.CREATE]: `
			CREATE (production:Production {
				uuid: $uuid,
				name: $name,
				startDate: $startDate,
				pressDate: $pressDate,
				endDate: $endDate
			})
		`,
		[ACTIONS.UPDATE]: `
			MATCH (production:Production { uuid: $uuid })

			OPTIONAL MATCH (production)-[relationship]-()
				WHERE NOT EXISTS((production)<-[relationship:HAS_SUB_PRODUCTION]-(:Production))

			DELETE relationship

			WITH DISTINCT production

			SET
				production.name = $name,
				production.startDate = $startDate,
				production.pressDate = $pressDate,
				production.endDate = $endDate
		`
	};

	return `
		${createUpdateQueryOpeningMap[action]}

		WITH production

		OPTIONAL MATCH (existingMaterial:Material { name: $material.name })
			WHERE
				($material.differentiator IS NULL AND existingMaterial.differentiator IS NULL) OR
				$material.differentiator = existingMaterial.differentiator

		FOREACH (item IN CASE $material.name WHEN NULL THEN [] ELSE [1] END |
			MERGE (material:Material {
				uuid: COALESCE(existingMaterial.uuid, $material.uuid),
				name: $material.name
			})
				ON CREATE SET material.differentiator = $material.differentiator

			CREATE (production)-[:PRODUCTION_OF]->(material)
		)

		WITH production

		OPTIONAL MATCH (existingVenue:Venue { name: $venue.name })
			WHERE
				($venue.differentiator IS NULL AND existingVenue.differentiator IS NULL) OR
				$venue.differentiator = existingVenue.differentiator

		FOREACH (item IN CASE $venue.name WHEN NULL THEN [] ELSE [1] END |
			MERGE (venue:Venue {
				uuid: COALESCE(existingVenue.uuid, $venue.uuid),
				name: $venue.name
			})
				ON CREATE SET venue.differentiator = $venue.differentiator

			CREATE (production)-[:PLAYS_AT]->(venue)
		)

		WITH DISTINCT production

			UNWIND (CASE $subProductions WHEN [] THEN [null] ELSE $subProductions END) AS subProductionParam

				OPTIONAL MATCH (existingSubProduction:Production { uuid: subProductionParam.uuid })

				FOREACH (item IN CASE existingSubProduction WHEN NULL THEN [] ELSE [1] END |
					CREATE (production)-[:HAS_SUB_PRODUCTION { position: subProductionParam.position }]->
						(existingSubProduction)
				)

		WITH DISTINCT production

		UNWIND (CASE $producerCredits WHEN [] THEN [{ entities: [] }] ELSE $producerCredits END) AS producerCredit

			UNWIND
				CASE SIZE([entity IN producerCredit.entities WHERE entity.model = 'PERSON']) WHEN 0
					THEN [null]
					ELSE [entity IN producerCredit.entities WHERE entity.model = 'PERSON']
				END AS producerPersonParam

				OPTIONAL MATCH (existingProducerPerson:Person { name: producerPersonParam.name })
					WHERE
						(
							producerPersonParam.differentiator IS NULL AND
							existingProducerPerson.differentiator IS NULL
						) OR
						producerPersonParam.differentiator = existingProducerPerson.differentiator

				FOREACH (item IN CASE producerPersonParam WHEN NULL THEN [] ELSE [1] END |
					MERGE (producerPerson:Person {
						uuid: COALESCE(existingProducerPerson.uuid, producerPersonParam.uuid),
						name: producerPersonParam.name
					})
						ON CREATE SET producerPerson.differentiator = producerPersonParam.differentiator

					CREATE (production)-
						[:HAS_PRODUCER_ENTITY {
							creditPosition: producerCredit.position,
							entityPosition: producerPersonParam.position,
							credit: producerCredit.name
						}]->(producerPerson)
				)

			WITH DISTINCT production, producerCredit

			UNWIND
				CASE SIZE([entity IN producerCredit.entities WHERE entity.model = 'COMPANY']) WHEN 0
					THEN [null]
					ELSE [entity IN producerCredit.entities WHERE entity.model = 'COMPANY']
				END AS producerCompanyParam

				OPTIONAL MATCH (existingProducerCompany:Company { name: producerCompanyParam.name })
					WHERE
						(
							producerCompanyParam.differentiator IS NULL AND
							existingProducerCompany.differentiator IS NULL
						) OR
						producerCompanyParam.differentiator = existingProducerCompany.differentiator

				FOREACH (item IN CASE producerCompanyParam WHEN NULL THEN [] ELSE [1] END |
					MERGE (producerCompany:Company {
						uuid: COALESCE(existingProducerCompany.uuid, producerCompanyParam.uuid),
						name: producerCompanyParam.name
					})
						ON CREATE SET producerCompany.differentiator = producerCompanyParam.differentiator

					CREATE (production)-
						[:HAS_PRODUCER_ENTITY {
							creditPosition: producerCredit.position,
							entityPosition: producerCompanyParam.position,
							credit: producerCredit.name
						}]->(producerCompany)
				)

				WITH production, producerCredit, producerCompanyParam

				UNWIND
					CASE WHEN producerCompanyParam IS NOT NULL AND SIZE(producerCompanyParam.members) > 0
						THEN producerCompanyParam.members
						ELSE [null]
					END AS creditedMemberParam

					OPTIONAL MATCH (creditedCompany:Company { name: producerCompanyParam.name })
						WHERE
							(producerCompanyParam.differentiator IS NULL AND creditedCompany.differentiator IS NULL) OR
							producerCompanyParam.differentiator = creditedCompany.differentiator

					OPTIONAL MATCH (creditedCompany)<-[producerCompanyRel:HAS_PRODUCER_ENTITY]-(production)
						WHERE
							producerCredit.position IS NULL OR
							producerCredit.position = producerCompanyRel.creditPosition

					OPTIONAL MATCH (existingPerson:Person { name: creditedMemberParam.name })
						WHERE
							(creditedMemberParam.differentiator IS NULL AND existingPerson.differentiator IS NULL) OR
							creditedMemberParam.differentiator = existingPerson.differentiator

					FOREACH (item IN CASE WHEN SIZE(producerCompanyParam.members) > 0 THEN [1] ELSE [] END |
						SET producerCompanyRel.creditedMemberUuids = []
					)

					FOREACH (item IN CASE creditedMemberParam WHEN NULL THEN [] ELSE [1] END |
						MERGE (creditedMember:Person {
							uuid: COALESCE(existingPerson.uuid, creditedMemberParam.uuid),
							name: creditedMemberParam.name
						})
							ON CREATE SET creditedMember.differentiator = creditedMemberParam.differentiator

						CREATE (production)-
							[:HAS_PRODUCER_ENTITY {
								creditPosition: producerCredit.position,
								memberPosition: creditedMemberParam.position,
								creditedCompanyUuid: creditedCompany.uuid
							}]->(creditedMember)

						SET producerCompanyRel.creditedMemberUuids =
							producerCompanyRel.creditedMemberUuids + creditedMember.uuid
					)

		WITH DISTINCT production

		UNWIND (CASE $cast WHEN [] THEN [null] ELSE $cast END) AS castMemberParam

			OPTIONAL MATCH (existingPerson:Person { name: castMemberParam.name })
				WHERE
					(castMemberParam.differentiator IS NULL AND existingPerson.differentiator IS NULL) OR
					castMemberParam.differentiator = existingPerson.differentiator

			FOREACH (item IN CASE castMemberParam WHEN NULL THEN [] ELSE [1] END |
				MERGE (castMember:Person {
					uuid: COALESCE(existingPerson.uuid, castMemberParam.uuid),
					name: castMemberParam.name
				})
					ON CREATE SET castMember.differentiator = castMemberParam.differentiator

				FOREACH (role IN CASE castMemberParam.roles WHEN [] THEN [{}] ELSE castMemberParam.roles END |
					CREATE (production)
						-[:HAS_CAST_MEMBER {
							castMemberPosition: castMemberParam.position,
							rolePosition: role.position,
							roleName: role.name,
							characterName: role.characterName,
							characterDifferentiator: role.characterDifferentiator,
							qualifier: role.qualifier,
							isAlternate: role.isAlternate
						}]->(castMember)
				)
			)

		WITH DISTINCT production

		UNWIND (CASE $creativeCredits WHEN [] THEN [{ entities: [] }] ELSE $creativeCredits END) AS creativeCredit

			UNWIND
				CASE SIZE([entity IN creativeCredit.entities WHERE entity.model = 'PERSON']) WHEN 0
					THEN [null]
					ELSE [entity IN creativeCredit.entities WHERE entity.model = 'PERSON']
				END AS creativePersonParam

				OPTIONAL MATCH (existingCreativePerson:Person { name: creativePersonParam.name })
					WHERE
						(
							creativePersonParam.differentiator IS NULL AND
							existingCreativePerson.differentiator IS NULL
						) OR
						creativePersonParam.differentiator = existingCreativePerson.differentiator

				FOREACH (item IN CASE creativePersonParam WHEN NULL THEN [] ELSE [1] END |
					MERGE (creativePerson:Person {
						uuid: COALESCE(existingCreativePerson.uuid, creativePersonParam.uuid),
						name: creativePersonParam.name
					})
						ON CREATE SET creativePerson.differentiator = creativePersonParam.differentiator

					CREATE (production)-
						[:HAS_CREATIVE_ENTITY {
							creditPosition: creativeCredit.position,
							entityPosition: creativePersonParam.position,
							credit: creativeCredit.name
						}]->(creativePerson)
				)

			WITH DISTINCT production, creativeCredit

			UNWIND
				CASE SIZE([entity IN creativeCredit.entities WHERE entity.model = 'COMPANY']) WHEN 0
					THEN [null]
					ELSE [entity IN creativeCredit.entities WHERE entity.model = 'COMPANY']
				END AS creativeCompanyParam

				OPTIONAL MATCH (existingCreativeCompany:Company { name: creativeCompanyParam.name })
					WHERE
						(
							creativeCompanyParam.differentiator IS NULL AND
							existingCreativeCompany.differentiator IS NULL
						) OR
						creativeCompanyParam.differentiator = existingCreativeCompany.differentiator

				FOREACH (item IN CASE creativeCompanyParam WHEN NULL THEN [] ELSE [1] END |
					MERGE (creativeCompany:Company {
						uuid: COALESCE(existingCreativeCompany.uuid, creativeCompanyParam.uuid),
						name: creativeCompanyParam.name
					})
						ON CREATE SET creativeCompany.differentiator = creativeCompanyParam.differentiator

					CREATE (production)-
						[:HAS_CREATIVE_ENTITY {
							creditPosition: creativeCredit.position,
							entityPosition: creativeCompanyParam.position,
							credit: creativeCredit.name
						}]->(creativeCompany)
				)

				WITH production, creativeCredit, creativeCompanyParam

				UNWIND
					CASE WHEN creativeCompanyParam IS NOT NULL AND SIZE(creativeCompanyParam.members) > 0
						THEN creativeCompanyParam.members
						ELSE [null]
					END AS creditedMemberParam

					OPTIONAL MATCH (creditedCompany:Company { name: creativeCompanyParam.name })
						WHERE
							(creativeCompanyParam.differentiator IS NULL AND creditedCompany.differentiator IS NULL) OR
							creativeCompanyParam.differentiator = creditedCompany.differentiator

					OPTIONAL MATCH (creditedCompany)<-[creativeCompanyRel:HAS_CREATIVE_ENTITY]-(production)
						WHERE
							creativeCredit.position IS NULL OR
							creativeCredit.position = creativeCompanyRel.creditPosition

					OPTIONAL MATCH (existingPerson:Person { name: creditedMemberParam.name })
						WHERE
							(creditedMemberParam.differentiator IS NULL AND existingPerson.differentiator IS NULL) OR
							creditedMemberParam.differentiator = existingPerson.differentiator

					FOREACH (item IN CASE WHEN SIZE(creativeCompanyParam.members) > 0 THEN [1] ELSE [] END |
						SET creativeCompanyRel.creditedMemberUuids = []
					)

					FOREACH (item IN CASE creditedMemberParam WHEN NULL THEN [] ELSE [1] END |
						MERGE (creditedMember:Person {
							uuid: COALESCE(existingPerson.uuid, creditedMemberParam.uuid),
							name: creditedMemberParam.name
						})
							ON CREATE SET creditedMember.differentiator = creditedMemberParam.differentiator

						CREATE (production)-
							[:HAS_CREATIVE_ENTITY {
								creditPosition: creativeCredit.position,
								memberPosition: creditedMemberParam.position,
								creditedCompanyUuid: creditedCompany.uuid
							}]->(creditedMember)

						SET creativeCompanyRel.creditedMemberUuids =
							creativeCompanyRel.creditedMemberUuids + creditedMember.uuid
					)

		WITH DISTINCT production

		UNWIND (CASE $crewCredits WHEN [] THEN [{ entities: [] }] ELSE $crewCredits END) AS crewCredit

			UNWIND
				CASE SIZE([entity IN crewCredit.entities WHERE entity.model = 'PERSON']) WHEN 0
					THEN [null]
					ELSE [entity IN crewCredit.entities WHERE entity.model = 'PERSON']
				END AS crewPersonParam

				OPTIONAL MATCH (existingCrewPerson:Person { name: crewPersonParam.name })
					WHERE
						(
							crewPersonParam.differentiator IS NULL AND
							existingCrewPerson.differentiator IS NULL
						) OR
						crewPersonParam.differentiator = existingCrewPerson.differentiator

				FOREACH (item IN CASE crewPersonParam WHEN NULL THEN [] ELSE [1] END |
					MERGE (crewPerson:Person {
						uuid: COALESCE(existingCrewPerson.uuid, crewPersonParam.uuid),
						name: crewPersonParam.name
					})
						ON CREATE SET crewPerson.differentiator = crewPersonParam.differentiator

					CREATE (production)-
						[:HAS_CREW_ENTITY {
							creditPosition: crewCredit.position,
							entityPosition: crewPersonParam.position,
							credit: crewCredit.name
						}]->(crewPerson)
				)

			WITH DISTINCT production, crewCredit

			UNWIND
				CASE SIZE([entity IN crewCredit.entities WHERE entity.model = 'COMPANY']) WHEN 0
					THEN [null]
					ELSE [entity IN crewCredit.entities WHERE entity.model = 'COMPANY']
				END AS crewCompanyParam

				OPTIONAL MATCH (existingCrewCompany:Company { name: crewCompanyParam.name })
					WHERE
						(
							crewCompanyParam.differentiator IS NULL AND
							existingCrewCompany.differentiator IS NULL
						) OR
						crewCompanyParam.differentiator = existingCrewCompany.differentiator

				FOREACH (item IN CASE crewCompanyParam WHEN NULL THEN [] ELSE [1] END |
					MERGE (crewCompany:Company {
						uuid: COALESCE(existingCrewCompany.uuid, crewCompanyParam.uuid),
						name: crewCompanyParam.name
					})
						ON CREATE SET crewCompany.differentiator = crewCompanyParam.differentiator

					CREATE (production)-
						[:HAS_CREW_ENTITY {
							creditPosition: crewCredit.position,
							entityPosition: crewCompanyParam.position,
							credit: crewCredit.name
						}]->(crewCompany)
				)

				WITH production, crewCredit, crewCompanyParam

				UNWIND
					CASE WHEN crewCompanyParam IS NOT NULL AND SIZE(crewCompanyParam.members) > 0
						THEN crewCompanyParam.members
						ELSE [null]
					END AS creditedMemberParam

					OPTIONAL MATCH (creditedCompany:Company { name: crewCompanyParam.name })
						WHERE
							(crewCompanyParam.differentiator IS NULL AND creditedCompany.differentiator IS NULL) OR
							crewCompanyParam.differentiator = creditedCompany.differentiator

					OPTIONAL MATCH (creditedCompany)<-[crewCompanyRel:HAS_CREW_ENTITY]-(production)
						WHERE
							crewCredit.position IS NULL OR
							crewCredit.position = crewCompanyRel.creditPosition

					OPTIONAL MATCH (existingPerson:Person { name: creditedMemberParam.name })
						WHERE
							(creditedMemberParam.differentiator IS NULL AND existingPerson.differentiator IS NULL) OR
							creditedMemberParam.differentiator = existingPerson.differentiator

					FOREACH (item IN CASE WHEN SIZE(crewCompanyParam.members) > 0 THEN [1] ELSE [] END |
						SET crewCompanyRel.creditedMemberUuids = []
					)

					FOREACH (item IN CASE creditedMemberParam WHEN NULL THEN [] ELSE [1] END |
						MERGE (creditedMember:Person {
							uuid: COALESCE(existingPerson.uuid, creditedMemberParam.uuid),
							name: creditedMemberParam.name
						})
							ON CREATE SET creditedMember.differentiator = creditedMemberParam.differentiator

						CREATE (production)-
							[:HAS_CREW_ENTITY {
								creditPosition: crewCredit.position,
								memberPosition: creditedMemberParam.position,
								creditedCompanyUuid: creditedCompany.uuid
							}]->(creditedMember)

						SET crewCompanyRel.creditedMemberUuids =
							crewCompanyRel.creditedMemberUuids + creditedMember.uuid
					)

		WITH DISTINCT production

		${getEditQuery()}
	`;

};

const getCreateQuery = () => getCreateUpdateQuery(ACTIONS.CREATE);

const getEditQuery = () => `
	MATCH (production:Production { uuid: $uuid })

	OPTIONAL MATCH (production)-[:PRODUCTION_OF]->(material:Material)

	OPTIONAL MATCH (production)-[:PLAYS_AT]->(venue:Venue)

	OPTIONAL MATCH (production)-[subProductionRel:HAS_SUB_PRODUCTION]->(subProduction:Production)

	WITH production, material, venue, subProductionRel, subProduction
		ORDER BY subProductionRel.position

	WITH production, material, venue,
		COLLECT(CASE subProduction WHEN NULL THEN null ELSE subProduction { .uuid } END) + [{}] AS subProductions

	OPTIONAL MATCH (production)-[producerEntityRel:HAS_PRODUCER_ENTITY]->(producerEntity)
		WHERE
			(producerEntity:Person AND producerEntityRel.creditedCompanyUuid IS NULL) OR
			producerEntity:Company

	WITH production, material, venue, subProductions, producerEntityRel,
		COLLECT(producerEntity {
			model: TOUPPER(HEAD(LABELS(producerEntity))),
			.name,
			.differentiator,
			creditedMemberUuids: producerEntityRel.creditedMemberUuids
		}) AS producerEntities

	UNWIND (CASE producerEntities WHEN [] THEN [null] ELSE producerEntities END) AS producerEntity

		UNWIND (COALESCE(producerEntity.creditedMemberUuids, [null])) AS creditedMemberUuid

			OPTIONAL MATCH (production)-[creditedMemberRel:HAS_PRODUCER_ENTITY]->
				(creditedMember:Person { uuid: creditedMemberUuid })
				WHERE
					producerEntityRel.creditPosition IS NULL OR
					producerEntityRel.creditPosition = creditedMemberRel.creditPosition

			WITH production, material, venue, subProductions, producerEntityRel, producerEntity, creditedMember
				ORDER BY creditedMemberRel.memberPosition

			WITH production, material, venue, subProductions, producerEntityRel, producerEntity,
				COLLECT(creditedMember { .name, .differentiator }) + [{}] AS creditedMembers

	WITH production, material, venue, subProductions, producerEntityRel, producerEntity, creditedMembers
		ORDER BY producerEntityRel.creditPosition, producerEntityRel.entityPosition

	WITH production, material, venue, subProductions, producerEntityRel.credit AS producerCreditName,
		COLLECT(
			CASE producerEntity WHEN NULL
				THEN null
				ELSE producerEntity { .model, .name, .differentiator, members: creditedMembers }
			END
		) AS producerEntities

	WITH production, material, venue, subProductions, producerCreditName,
		[producerEntity IN producerEntities | CASE producerEntity.model WHEN 'COMPANY'
			THEN producerEntity
			ELSE producerEntity { .model, .name, .differentiator }
		END] + [{}] AS producerEntities

	WITH production, material, venue, subProductions,
		COLLECT(
			CASE WHEN producerCreditName IS NULL AND SIZE(producerEntities) = 1
				THEN null
				ELSE { name: producerCreditName, entities: producerEntities }
			END
		) + [{ entities: [{}] }] AS producerCredits

	OPTIONAL MATCH (production)-[role:HAS_CAST_MEMBER]->(castMember:Person)

	WITH production, material, venue, subProductions, producerCredits, role, castMember
		ORDER BY role.castMemberPosition, role.rolePosition

	WITH production, material, venue, subProductions, producerCredits, castMember,
		COLLECT(
			CASE role.roleName WHEN NULL
				THEN null
				ELSE {
					name: role.roleName,
					characterName: COALESCE(role.characterName, ''),
					characterDifferentiator: COALESCE(role.characterDifferentiator, ''),
					qualifier: COALESCE(role.qualifier, ''),
					isAlternate: COALESCE(role.isAlternate, false)
				}
			END
		) + [{}] AS roles

	WITH production, material, venue, subProductions, producerCredits,
		COLLECT(
			CASE castMember WHEN NULL
				THEN null
				ELSE castMember { .name, .differentiator, roles: roles }
			END
		) + [{ roles: [{}] }] AS cast

	OPTIONAL MATCH (production)-[creativeEntityRel:HAS_CREATIVE_ENTITY]->(creativeEntity)
		WHERE
			(creativeEntity:Person AND creativeEntityRel.creditedCompanyUuid IS NULL) OR
			creativeEntity:Company

	WITH production, material, venue, subProductions, producerCredits, cast, creativeEntityRel,
		COLLECT(creativeEntity {
			model: TOUPPER(HEAD(LABELS(creativeEntity))),
			.name,
			.differentiator,
			creditedMemberUuids: creativeEntityRel.creditedMemberUuids
		}) AS creativeEntities

	UNWIND (CASE creativeEntities WHEN [] THEN [null] ELSE creativeEntities END) AS creativeEntity

		UNWIND (COALESCE(creativeEntity.creditedMemberUuids, [null])) AS creditedMemberUuid

			OPTIONAL MATCH (production)-[creditedMemberRel:HAS_CREATIVE_ENTITY]->
				(creditedMember:Person { uuid: creditedMemberUuid })
				WHERE
					creativeEntityRel.creditPosition IS NULL OR
					creativeEntityRel.creditPosition = creditedMemberRel.creditPosition

			WITH
				production,
				material,
				venue,
				subProductions,
				producerCredits,
				cast,
				creativeEntityRel,
				creativeEntity,
				creditedMember
				ORDER BY creditedMemberRel.memberPosition

			WITH production, material, venue, subProductions, producerCredits, cast, creativeEntityRel, creativeEntity,
				COLLECT(creditedMember { .name, .differentiator }) + [{}] AS creditedMembers

	WITH
		production,
		material,
		venue,
		subProductions,
		producerCredits,
		cast,
		creativeEntityRel,
		creativeEntity,
		creditedMembers
		ORDER BY creativeEntityRel.creditPosition, creativeEntityRel.entityPosition

	WITH
		production,
		material,
		venue,
		subProductions,
		producerCredits,
		cast,
		creativeEntityRel.credit AS creativeCreditName,
		COLLECT(
			CASE creativeEntity WHEN NULL
				THEN null
				ELSE creativeEntity { .model, .name, .differentiator, members: creditedMembers }
			END
		) AS creativeEntities

	WITH
		production,
		material,
		venue,
		subProductions,
		producerCredits,
		cast,
		creativeCreditName,
		[creativeEntity IN creativeEntities | CASE creativeEntity.model WHEN 'COMPANY'
			THEN creativeEntity
			ELSE creativeEntity { .model, .name, .differentiator }
		END] + [{}] AS creativeEntities

	WITH production, material, venue, subProductions, producerCredits, cast,
		COLLECT(
			CASE WHEN creativeCreditName IS NULL AND SIZE(creativeEntities) = 1
				THEN null
				ELSE { name: creativeCreditName, entities: creativeEntities }
			END
		) + [{ entities: [{}] }] AS creativeCredits

	OPTIONAL MATCH (production)-[crewEntityRel:HAS_CREW_ENTITY]->(crewEntity)
		WHERE
			(crewEntity:Person AND crewEntityRel.creditedCompanyUuid IS NULL) OR
			crewEntity:Company

	WITH production, material, venue, subProductions, producerCredits, cast, creativeCredits, crewEntityRel,
		COLLECT(crewEntity {
			model: TOUPPER(HEAD(LABELS(crewEntity))),
			.name,
			.differentiator,
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
				subProductions,
				producerCredits,
				cast,
				creativeCredits,
				crewEntityRel,
				crewEntity,
				creditedMember
				ORDER BY creditedMemberRel.memberPosition

			WITH
				production,
				material,
				venue,
				subProductions,
				producerCredits,
				cast,
				creativeCredits,
				crewEntityRel,
				crewEntity,
				COLLECT(creditedMember { .name, .differentiator }) + [{}] AS creditedMembers

	WITH
		production,
		material,
		venue,
		subProductions,
		producerCredits,
		cast,
		creativeCredits,
		crewEntityRel,
		crewEntity,
		creditedMembers
		ORDER BY crewEntityRel.creditPosition, crewEntityRel.entityPosition

	WITH
		production,
		material,
		venue,
		subProductions,
		producerCredits,
		cast,
		creativeCredits,
		crewEntityRel.credit AS crewCreditName,
		COLLECT(
			CASE crewEntity WHEN NULL
				THEN null
				ELSE crewEntity { .model, .name, .differentiator, members: creditedMembers }
			END
		) AS crewEntities

	WITH
		production,
		material,
		venue,
		subProductions,
		producerCredits,
		cast,
		creativeCredits,
		crewCreditName,
		[crewEntity IN crewEntities | CASE crewEntity.model WHEN 'COMPANY'
			THEN crewEntity
			ELSE crewEntity { .model, .name, .differentiator }
		END] + [{}] AS crewEntities

	RETURN
		production.uuid AS uuid,
		production.name AS name,
		production.startDate AS startDate,
		production.pressDate AS pressDate,
		production.endDate AS endDate,
		{ name: COALESCE(material.name, ''), differentiator: COALESCE(material.differentiator, '') } AS material,
		{ name: COALESCE(venue.name, ''), differentiator: COALESCE(venue.differentiator, '') } AS venue,
		subProductions,
		producerCredits,
		cast,
		creativeCredits,
		COLLECT(
			CASE WHEN crewCreditName IS NULL AND SIZE(crewEntities) = 1
				THEN null
				ELSE { name: crewCreditName, entities: crewEntities }
			END
		) + [{ entities: [{}] }] AS crewCredits
`;

const getUpdateQuery = () => getCreateUpdateQuery(ACTIONS.UPDATE);

const getShowQuery = () => `
	MATCH (production:Production { uuid: $uuid })

	OPTIONAL MATCH (production)-[:PLAYS_AT]->(venue:Venue)

	OPTIONAL MATCH (venue)<-[:HAS_SUB_VENUE]-(surVenue:Venue)

	WITH production,
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

	OPTIONAL MATCH (production)-[materialRel:PRODUCTION_OF]->(material:Material)

	OPTIONAL MATCH (material)-[entityRel:HAS_WRITING_ENTITY|USES_SOURCE_MATERIAL]->(entity)
		WHERE entity:Person OR entity:Company OR entity:Material

	OPTIONAL MATCH (entity:Material)<-[:HAS_SUB_MATERIAL]-(entitySurMaterial:Material)

	OPTIONAL MATCH (entity:Material)-[sourceMaterialWriterRel:HAS_WRITING_ENTITY]->(sourceMaterialWriter)
		WHERE sourceMaterialWriter:Person OR sourceMaterialWriter:Company

	WITH
		production,
		venue,
		material,
		entityRel,
		entity,
		entitySurMaterial,
		sourceMaterialWriterRel,
		sourceMaterialWriter
		ORDER BY sourceMaterialWriterRel.creditPosition, sourceMaterialWriterRel.entityPosition

	WITH
		production,
		venue,
		material,
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

	WITH production, venue, material, entityRel, entity, entitySurMaterial,
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

	WITH production, venue, material, entityRel.credit AS writingCreditName,
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

	WITH production, venue, material, writingCreditName,
		[entity IN entities | CASE entity.model WHEN 'MATERIAL'
			THEN entity
			ELSE entity { .model, .uuid, .name }
		END] AS entities

	WITH production, venue, material,
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

	OPTIONAL MATCH (production)-[role:HAS_CAST_MEMBER]->(castMember:Person)

	OPTIONAL MATCH (castMember)<-[role]-(production)-[materialRel]->
		(material)-[characterRel:DEPICTS]->(character:Character)
		WHERE
			(
				role.roleName IN [character.name, characterRel.displayName] OR
				role.characterName IN [character.name, characterRel.displayName]
			) AND
			(role.characterDifferentiator IS NULL OR role.characterDifferentiator = character.differentiator)

	OPTIONAL MATCH (material)<-[:HAS_SUB_MATERIAL]-(surMaterial:Material)

	WITH DISTINCT production, venue, material, surMaterial, writingCredits, castMember, role, character
		ORDER BY role.castMemberPosition, role.rolePosition

	WITH production, venue, castMember,
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
		END AS material,
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

	WITH production, material, venue,
		COLLECT(
			CASE castMember WHEN NULL
				THEN null
				ELSE castMember { model: 'PERSON', .uuid, .name, roles }
			END
		) AS cast

	OPTIONAL MATCH (production)<-[:HAS_SUB_PRODUCTION]-(surProduction:Production)

	OPTIONAL MATCH (surProduction)-[:PLAYS_AT]->(surProductionVenue:Venue)

	OPTIONAL MATCH (surProductionVenue)-[:HAS_SUB_VENUE]-(surProductionSurVenue:Venue)

	WITH
		production,
		venue,
		material,
		cast,
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
		cast,
		subProductionRel,
		subProduction,
		subProductionVenue,
		subProductionSurVenue
		ORDER BY subProduction.startDate DESC, subProductionRel.position

	WITH production, material, venue, cast, surProduction,
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

	WITH production, material, venue, surProduction, subProductions, cast, producerEntityRel,
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

			WITH production, material, venue, surProduction, subProductions, cast, producerEntityRel, producerEntity, creditedMember
				ORDER BY creditedMemberRel.memberPosition

			WITH production, material, venue, surProduction, subProductions, cast, producerEntityRel, producerEntity,
				COLLECT(creditedMember { model: 'PERSON', .uuid, .name }) AS creditedMembers

	WITH production, material, venue, surProduction, subProductions, cast, producerEntityRel, producerEntity, creditedMembers
		ORDER BY producerEntityRel.creditPosition, producerEntityRel.entityPosition

	WITH production, material, venue, surProduction, subProductions, cast, producerEntityRel.credit AS producerCreditName,
		COLLECT(
			CASE producerEntity WHEN NULL
				THEN null
				ELSE producerEntity { .model, .uuid, .name, members: creditedMembers }
			END
		) AS producerEntities

	WITH production, material, venue, surProduction, subProductions, cast, producerCreditName,
		[producerEntity IN producerEntities | CASE producerEntity.model WHEN 'COMPANY'
			THEN producerEntity
			ELSE producerEntity { .model, .uuid, .name }
		END] AS producerEntities

	WITH production, material, venue, surProduction, subProductions, cast,
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

	OPTIONAL MATCH (production)-[creativeEntityRel:HAS_CREATIVE_ENTITY]->(creativeEntity)
		WHERE
			(creativeEntity:Person AND creativeEntityRel.creditedCompanyUuid IS NULL) OR
			creativeEntity:Company

	WITH production, material, venue, surProduction, subProductions, cast, producerCredits, creativeEntityRel,
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

			WITH production, material, venue, surProduction, subProductions, cast, producerCredits, creativeEntityRel, creativeEntity, creditedMember
				ORDER BY creditedMemberRel.memberPosition

			WITH production, material, venue, surProduction, subProductions, cast, producerCredits, creativeEntityRel, creativeEntity,
				COLLECT(creditedMember { model: 'PERSON', .uuid, .name }) AS creditedMembers

	WITH production, material, venue, surProduction, subProductions, cast, producerCredits, creativeEntityRel, creativeEntity, creditedMembers
		ORDER BY creativeEntityRel.creditPosition, creativeEntityRel.entityPosition

	WITH production, material, venue, surProduction, subProductions, cast, producerCredits, creativeEntityRel.credit AS creativeCreditName,
		COLLECT(
			CASE creativeEntity WHEN NULL
				THEN null
				ELSE creativeEntity { .model, .uuid, .name, members: creditedMembers }
			END
		) AS creativeEntities

	WITH production, material, venue, surProduction, subProductions, cast, producerCredits, creativeCreditName,
		[creativeEntity IN creativeEntities | CASE creativeEntity.model WHEN 'COMPANY'
			THEN creativeEntity
			ELSE creativeEntity { .model, .uuid, .name }
		END] AS creativeEntities

	WITH production, material, venue, surProduction, subProductions, cast, producerCredits,
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

	WITH production, material, venue, surProduction, subProductions, cast, producerCredits, creativeCredits, crewEntityRel,
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
				venue, surProduction, subProductions,
				cast,
				producerCredits,
				creativeCredits,
				crewEntityRel,
				crewEntity,
				creditedMember
				ORDER BY creditedMemberRel.memberPosition

			WITH production, material, venue, surProduction, subProductions, cast, producerCredits, creativeCredits, crewEntityRel, crewEntity,
				COLLECT(creditedMember { model: 'PERSON', .uuid, .name }) AS creditedMembers

	WITH
		production,
		material,
		venue, surProduction, subProductions,
		cast,
		producerCredits,
		creativeCredits,
		crewEntityRel,
		crewEntity,
		creditedMembers
		ORDER BY crewEntityRel.creditPosition, crewEntityRel.entityPosition

	WITH production, material, venue, surProduction, subProductions, cast, producerCredits, creativeCredits, crewEntityRel.credit AS crewCreditName,
		COLLECT(
			CASE crewEntity WHEN NULL
				THEN null
				ELSE crewEntity { .model, .uuid, .name, members: creditedMembers }
			END
		) AS crewEntities

	WITH production, material, venue, surProduction, subProductions, cast, producerCredits, creativeCredits, crewCreditName,
		[crewEntity IN crewEntities | CASE crewEntity.model WHEN 'COMPANY'
			THEN crewEntity
			ELSE crewEntity { .model, .uuid, .name }
		END] AS crewEntities

	WITH
		production,
		material,
		venue, surProduction, subProductions,
		cast,
		producerCredits,
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
		cast,
		producerCredits,
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
				cast,
				producerCredits,
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
				cast,
				producerCredits,
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
		cast,
		producerCredits,
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
		cast,
		producerCredits,
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
		cast,
		producerCredits,
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
		cast,
		producerCredits,
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
		cast,
		producerCredits,
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
		cast,
		producerCredits,
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
		cast,
		producerCredits,
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
		cast,
		producerCredits,
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

	WITH production, material, venue, surProduction, subProductions, cast, producerCredits, creativeCredits, crewCredits, ceremony, award,
		COLLECT(category { model: 'AWARD_CEREMONY_CATEGORY', .name, nominations }) AS categories
		ORDER BY ceremony.name DESC

	WITH production, material, venue, surProduction, subProductions, cast, producerCredits, creativeCredits, crewCredits, award,
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
		venue, surProduction, subProductions,
		producerCredits,
		cast,
		creativeCredits,
		crewCredits,
		COLLECT(award { model: 'AWARD', .uuid, .name, ceremonies }) AS awards
`;

const getListQuery = () => `
	MATCH (production:Production)
		WHERE NOT EXISTS((production)-[:HAS_SUB_PRODUCTION]->(:Production))

	OPTIONAL MATCH (production)-[:PLAYS_AT]->(venue:Venue)

	OPTIONAL MATCH (venue)<-[:HAS_SUB_VENUE]-(surVenue:Venue)

	OPTIONAL MATCH (production)<-[:HAS_SUB_PRODUCTION]-(surProduction:Production)

	RETURN
		'PRODUCTION' AS model,
		production.uuid AS uuid,
		production.name AS name,
		production.startDate AS startDate,
		production.endDate AS endDate,
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
		END AS venue,
		CASE surProduction WHEN NULL
			THEN null
			ELSE surProduction { model: 'PRODUCTION', .uuid, .name }
		END AS surProduction

	ORDER BY production.startDate DESC, production.name, venue.name

	LIMIT 100
`;

export {
	getCreateQuery,
	getEditQuery,
	getUpdateQuery,
	getShowQuery,
	getListQuery
};
