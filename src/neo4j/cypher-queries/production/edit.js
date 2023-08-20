export default () => `
	MATCH (production:Production { uuid: $uuid })

	OPTIONAL MATCH (production)-[:PRODUCTION_OF]->(material:Material)

	OPTIONAL MATCH (production)-[:PLAYS_AT]->(venue:Venue)

	OPTIONAL MATCH (production)-[:PART_OF_SEASON]->(season:Season)

	OPTIONAL MATCH (production)-[subProductionRel:HAS_SUB_PRODUCTION]->(subProduction:Production)

	WITH production, material, venue, season, subProductionRel, subProduction
		ORDER BY subProductionRel.position

	WITH production, material, venue, season,
		COLLECT(CASE WHEN subProduction IS NULL THEN null ELSE subProduction { .uuid } END) + [{}] AS subProductions

	OPTIONAL MATCH (production)-[producerEntityRel:HAS_PRODUCER_ENTITY]->(producerEntity)
		WHERE
			(producerEntity:Person AND producerEntityRel.creditedCompanyUuid IS NULL) OR
			producerEntity:Company

	WITH production, material, venue, season, subProductions, producerEntityRel,
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

			WITH production, material, venue, season, subProductions, producerEntityRel, producerEntity, creditedMember
				ORDER BY creditedMemberRel.memberPosition

			WITH production, material, venue, season, subProductions, producerEntityRel, producerEntity,
				COLLECT(creditedMember { .name, .differentiator }) + [{}] AS creditedMembers

	WITH production, material, venue, season, subProductions, producerEntityRel, producerEntity, creditedMembers
		ORDER BY producerEntityRel.creditPosition, producerEntityRel.entityPosition

	WITH production, material, venue, season, subProductions, producerEntityRel.credit AS producerCreditName,
		COLLECT(
			CASE WHEN producerEntity IS NULL
				THEN null
				ELSE producerEntity { .model, .name, .differentiator, members: creditedMembers }
			END
		) AS producerEntities

	WITH production, material, venue, season, subProductions, producerCreditName,
		[producerEntity IN producerEntities | CASE producerEntity.model WHEN 'COMPANY'
			THEN producerEntity
			ELSE producerEntity { .model, .name, .differentiator }
		END] + [{}] AS producerEntities

	WITH production, material, venue, season, subProductions,
		COLLECT(
			CASE WHEN producerCreditName IS NULL AND SIZE(producerEntities) = 1
				THEN null
				ELSE { name: producerCreditName, entities: producerEntities }
			END
		) + [{ entities: [{}] }] AS producerCredits

	OPTIONAL MATCH (production)-[role:HAS_CAST_MEMBER]->(castMember:Person)

	WITH production, material, venue, season, subProductions, producerCredits, role, castMember
		ORDER BY role.castMemberPosition, role.rolePosition

	WITH production, material, venue, season, subProductions, producerCredits, castMember,
		COLLECT(
			CASE WHEN role.roleName IS NULL
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

	WITH production, material, venue, season, subProductions, producerCredits,
		COLLECT(
			CASE WHEN castMember IS NULL
				THEN null
				ELSE castMember { .name, .differentiator, roles: roles }
			END
		) + [{ roles: [{}] }] AS cast

	OPTIONAL MATCH (production)-[creativeEntityRel:HAS_CREATIVE_ENTITY]->(creativeEntity)
		WHERE
			(creativeEntity:Person AND creativeEntityRel.creditedCompanyUuid IS NULL) OR
			creativeEntity:Company

	WITH production, material, venue, season, subProductions, producerCredits, cast, creativeEntityRel,
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
				season,
				subProductions,
				producerCredits,
				cast,
				creativeEntityRel,
				creativeEntity,
				creditedMember
				ORDER BY creditedMemberRel.memberPosition

			WITH
				production,
				material,
				venue,
				season,
				subProductions,
				producerCredits,
				cast,
				creativeEntityRel,
				creativeEntity,
				COLLECT(creditedMember { .name, .differentiator }) + [{}] AS creditedMembers

	WITH
		production,
		material,
		venue,
		season,
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
		season,
		subProductions,
		producerCredits,
		cast,
		creativeEntityRel.credit AS creativeCreditName,
		COLLECT(
			CASE WHEN creativeEntity IS NULL
				THEN null
				ELSE creativeEntity { .model, .name, .differentiator, members: creditedMembers }
			END
		) AS creativeEntities

	WITH
		production,
		material,
		venue,
		season,
		subProductions,
		producerCredits,
		cast,
		creativeCreditName,
		[creativeEntity IN creativeEntities | CASE creativeEntity.model WHEN 'COMPANY'
			THEN creativeEntity
			ELSE creativeEntity { .model, .name, .differentiator }
		END] + [{}] AS creativeEntities

	WITH production, material, venue, season, subProductions, producerCredits, cast,
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

	WITH production, material, venue, season, subProductions, producerCredits, cast, creativeCredits, crewEntityRel,
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
				season,
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
				season,
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
		season,
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
		season,
		subProductions,
		producerCredits,
		cast,
		creativeCredits,
		crewEntityRel.credit AS crewCreditName,
		COLLECT(
			CASE WHEN crewEntity IS NULL
				THEN null
				ELSE crewEntity { .model, .name, .differentiator, members: creditedMembers }
			END
		) AS crewEntities

	WITH
		production,
		material,
		venue,
		season,
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
		{ name: COALESCE(season.name, ''), differentiator: COALESCE(season.differentiator, '') } AS season,
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
