export default () => [`
	MATCH (ceremony:AwardCeremony { uuid: $uuid })

	OPTIONAL MATCH (ceremony)<-[:PRESENTED_AT]-(award:Award)

	OPTIONAL MATCH (ceremony)-[categoryRel:PRESENTS_CATEGORY]->(category:AwardCeremonyCategory)

	OPTIONAL MATCH (category)-[nomineeRel:HAS_NOMINEE]->(nominee)
		WHERE
			(nominee:Person AND nomineeRel.nominatedCompanyUuid IS NULL) OR
			nominee:Company OR
			nominee:Production OR
			nominee:Material

	OPTIONAL MATCH (nominee:Production)-[:PLAYS_AT]->(venue:Venue)

	OPTIONAL MATCH (venue)<-[:HAS_SUB_VENUE]-(surVenue:Venue)

	OPTIONAL MATCH (nominee:Production)<-[:HAS_SUB_PRODUCTION]-(surProduction:Production)

	OPTIONAL MATCH (surProduction)<-[:HAS_SUB_PRODUCTION]-(surSurProduction:Production)

	OPTIONAL MATCH (nominee:Material)<-[:HAS_SUB_MATERIAL]-(surMaterial:Material)

	OPTIONAL MATCH (surMaterial)<-[:HAS_SUB_MATERIAL]-(surSurMaterial:Material)

	OPTIONAL MATCH (nominee:Material)-[entityRel:HAS_WRITING_ENTITY|USES_SOURCE_MATERIAL]->(entity)
		WHERE entity:Person OR entity:Company OR entity:Material

	OPTIONAL MATCH (entity:Material)-[sourceMaterialWriterRel:HAS_WRITING_ENTITY]->(sourceMaterialWriter)
		WHERE sourceMaterialWriter:Person OR sourceMaterialWriter:Company

	OPTIONAL MATCH (entity:Material)<-[:HAS_SUB_MATERIAL]-(entitySurMaterial:Material)

	OPTIONAL MATCH (entitySurMaterial)<-[:HAS_SUB_MATERIAL]-(entitySurSurMaterial:Material)

	WITH
		ceremony,
		award,
		categoryRel,
		category,
		nomineeRel,
		nominee,
		venue,
		surVenue,
		surProduction,
		surSurProduction,
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
		ceremony,
		award,
		categoryRel,
		category,
		nomineeRel,
		nominee,
		venue,
		surVenue,
		surProduction,
		surSurProduction,
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

	WITH
		ceremony,
		award,
		categoryRel,
		category,
		nomineeRel,
		nominee,
		venue,
		surVenue,
		surProduction,
		surSurProduction,
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
		ceremony,
		award,
		categoryRel,
		category,
		nomineeRel,
		nominee,
		venue,
		surVenue,
		surProduction,
		surSurProduction,
		surMaterial,
		surSurMaterial,
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

	WITH
		ceremony,
		award,
		categoryRel,
		category,
		nomineeRel,
		nominee,
		venue,
		surVenue,
		surProduction,
		surSurProduction,
		surMaterial,
		surSurMaterial,
		writingCreditName,
		[entity IN entities | CASE entity.model WHEN 'MATERIAL'
			THEN entity
			ELSE entity { .model, .uuid, .name }
		END] AS entities

	WITH
		ceremony,
		award,
		categoryRel,
		category,
		nomineeRel,
		nominee,
		venue,
		surVenue,
		surProduction,
		surSurProduction,
		CASE surMaterial WHEN NULL
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
		END AS surMaterial,
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

	WITH ceremony, award, categoryRel, category, nomineeRel,
		COLLECT(nominee {
			model: TOUPPER(HEAD(LABELS(nominee))),
			.uuid,
			.name,
			.startDate,
			.endDate,
			nominatedMemberUuids: nomineeRel.nominatedMemberUuids,
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
			.format,
			.year,
			surMaterial,
			writingCredits
		}) AS nominees

	UNWIND (CASE nominees WHEN [] THEN [null] ELSE nominees END) AS nominee

		UNWIND (COALESCE(nominee.nominatedMemberUuids, [null])) AS nominatedMemberUuid

			OPTIONAL MATCH (category)-[nominatedMemberRel:HAS_NOMINEE]->
				(nominatedMember:Person { uuid: nominatedMemberUuid })
				WHERE
					nomineeRel.nominationPosition IS NULL OR
					nomineeRel.nominationPosition = nominatedMemberRel.nominationPosition

			WITH ceremony, award, categoryRel, category, nomineeRel, nominee, nominatedMember
				ORDER BY nominatedMemberRel.memberPosition

			WITH ceremony, award, categoryRel, category, nomineeRel, nominee,
				COLLECT(nominatedMember { model: 'PERSON', .uuid, .name }) AS nominatedMembers

	WITH ceremony, award, categoryRel, category, nomineeRel, nominee, nominatedMembers
		ORDER BY
			nomineeRel.nominationPosition,
			nomineeRel.entityPosition,
			nomineeRel.productionPosition,
			nomineeRel.materialPosition

	WITH
		ceremony,
		award,
		categoryRel,
		category,
		nomineeRel.nominationPosition AS nominationPosition,
		nomineeRel.isWinner AS isWinner,
		nomineeRel.customType AS customType,
		COLLECT(
			CASE nominee WHEN NULL
				THEN null
				ELSE nominee {
					.model,
					.uuid,
					.name,
					members: nominatedMembers,
					.startDate,
					.endDate,
					.venue,
					.surProduction,
					.format,
					.year,
					.surMaterial,
					.writingCredits
				}
			END
		) AS nominees

	WITH
		ceremony,
		award,
		categoryRel,
		category,
		nominationPosition,
		isWinner,
		customType,
		[nominee IN nominees | CASE nominee.model
			WHEN 'COMPANY' THEN nominee { .model, .uuid, .name, .members }
			WHEN 'PERSON' THEN nominee { .model, .uuid, .name }
			WHEN 'PRODUCTION' THEN nominee { .model, .uuid, .name, .startDate, .endDate, .venue, .surProduction }
			WHEN 'MATERIAL' THEN nominee { .model, .uuid, .name, .format, .year, .surMaterial, .writingCredits }
		END] AS nominees

	WITH
		ceremony,
		award,
		categoryRel,
		category,
		isWinner,
		customType,
		[nominee IN nominees WHERE nominee.model = 'PERSON' OR nominee.model = 'COMPANY'] AS nomineeEntities,
		[nominee IN nominees WHERE nominee.model = 'PRODUCTION'] AS nomineeProductions,
		[nominee IN nominees WHERE nominee.model = 'MATERIAL'] AS nomineeMaterials

	WITH ceremony, award, categoryRel, category,
		COLLECT(
			CASE WHEN SIZE(nomineeEntities) = 0 AND SIZE(nomineeProductions) = 0 AND SIZE(nomineeMaterials) = 0
				THEN null
				ELSE {
					model: 'NOMINATION',
					isWinner: COALESCE(isWinner, false),
					type: COALESCE(customType, CASE WHEN isWinner THEN 'Winner' ELSE 'Nomination' END),
					entities: nomineeEntities,
					productions: nomineeProductions,
					materials: nomineeMaterials
				}
			END
		) AS nominations
		ORDER BY categoryRel.position

	RETURN
		'AWARD_CEREMONY' AS model,
		ceremony.uuid AS uuid,
		ceremony.name AS name,
		CASE award WHEN NULL THEN null ELSE award { model: 'AWARD', .uuid, .name } END AS award,
		COLLECT(
			CASE category WHEN NULL
				THEN null
				ELSE category { model: 'AWARD_CEREMONY_CATEGORY', .name, nominations }
			END
		) AS categories
`];
