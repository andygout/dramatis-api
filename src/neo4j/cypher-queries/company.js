const getShowQuery = () => `
	MATCH (company:Company { uuid: $uuid })

	OPTIONAL MATCH (company)<-[:HAS_WRITING_ENTITY|USES_SOURCE_MATERIAL*1..2]-(material:Material)

	WITH company, COLLECT(DISTINCT(material)) AS materials

	UNWIND (CASE materials WHEN [] THEN [null] ELSE materials END) AS material

		OPTIONAL MATCH (company)<-[writerRel:HAS_WRITING_ENTITY]-(material)

		OPTIONAL MATCH (company)<-[:HAS_WRITING_ENTITY]-(:Material)
			<-[subsequentVersionRel:SUBSEQUENT_VERSION_OF]-(material)

		OPTIONAL MATCH (company)<-[:HAS_WRITING_ENTITY]-(:Material)
			<-[sourcingMaterialRel:USES_SOURCE_MATERIAL]-(material)

		OPTIONAL MATCH (material)-[entityRel:HAS_WRITING_ENTITY|USES_SOURCE_MATERIAL]->(entity)
			WHERE entity:Person OR entity:Company OR entity:Material

		OPTIONAL MATCH (entity:Material)-[sourceMaterialWriterRel:HAS_WRITING_ENTITY]->(sourceMaterialWriter)
			WHERE sourceMaterialWriter:Person OR sourceMaterialWriter:Company

		WITH
			company,
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
			company,
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
						uuid: CASE sourceMaterialWriter.uuid WHEN company.uuid
							THEN null
							ELSE sourceMaterialWriter.uuid
						END,
						.name
					}
				END
			) AS sourceMaterialWriters

		WITH
			company,
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
			company,
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
						uuid: CASE entity.uuid WHEN company.uuid THEN null ELSE entity.uuid END,
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

		WITH company, material, creditType, hasDirectCredit, isSubsequentVersion, isSourcingMaterial,
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

		WITH company,
			COLLECT(
				CASE material WHEN NULL
					THEN null
					ELSE material {
						model: 'MATERIAL',
						.uuid,
						.name,
						.format,
						.year,
						writingCredits: writingCredits,
						creditType: creditType,
						hasDirectCredit: hasDirectCredit,
						isSubsequentVersion: isSubsequentVersion,
						isSourcingMaterial: isSourcingMaterial
					}
				END
			) AS materials

	OPTIONAL MATCH (company)<-[:HAS_PRODUCER_ENTITY]-(production:Production)

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

		WITH company, materials, production, entityRel, entity, creditedMember
			ORDER BY creditedMember.memberPosition

		WITH company, materials, production, entityRel, entity,
			COLLECT(DISTINCT(creditedMember {
				model: 'PERSON',
				.uuid,
				.name
			})) AS creditedMembers
		ORDER BY entityRel.creditPosition, entityRel.entityPosition

	WITH company, materials, production, entityRel.credit AS producerCreditName,
		[entity IN COLLECT(
			CASE entity WHEN NULL
				THEN null
				ELSE entity {
					model: TOUPPER(HEAD(LABELS(entity))),
					uuid: CASE entity.uuid WHEN company.uuid THEN null ELSE entity.uuid END,
					.name,
					members: creditedMembers
				}
			END
		) | CASE entity.model WHEN 'COMPANY'
			THEN entity
			ELSE entity { .model, .uuid, .name }
		END] AS entities

	WITH company, materials, production,
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

	WITH company, materials, production, producerCredits, venue, surVenue
		ORDER BY production.startDate DESC, production.name, venue.name

	WITH company, materials,
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
					producerCredits: producerCredits
				}
			END
		) AS producerProductions

	OPTIONAL MATCH (company)<-[creativeRel:HAS_CREATIVE_ENTITY]-(production:Production)

	UNWIND (CASE WHEN creativeRel IS NOT NULL AND EXISTS(creativeRel.creditedMemberUuids)
		THEN creativeRel.creditedMemberUuids
		ELSE [null]
	END) AS creditedMemberUuid

		OPTIONAL MATCH (production)-[creditedMemberRel:HAS_CREATIVE_ENTITY]->
			(creditedMember:Person { uuid: creditedMemberUuid })
			WHERE creativeRel.creditPosition IS NULL OR creativeRel.creditPosition = creditedMemberRel.creditPosition

		WITH company, materials, producerProductions, creativeRel, production, creditedMember
			ORDER BY creditedMemberRel.memberPosition

		WITH company, materials, producerProductions, creativeRel, production,
			COLLECT(creditedMember { model: 'PERSON', .uuid, .name }) AS creditedMembers

	OPTIONAL MATCH (production)-[coCreditedEntityRel:HAS_CREATIVE_ENTITY]->(coCreditedEntity)
		WHERE
			(coCreditedEntity:Person OR coCreditedEntity:Company) AND
			coCreditedEntityRel.creditedCompanyUuid IS NULL AND
			(creativeRel.creditPosition IS NULL OR creativeRel.creditPosition = coCreditedEntityRel.creditPosition) AND
			coCreditedEntity.uuid <> company.uuid

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
			company,
			materials,
			producerProductions,
			creativeRel,
			production,
			creditedMembers,
			coCreditedEntityRel,
			coCreditedEntity,
			coCreditedCompanyCreditedMember
			ORDER BY coCreditedCompanyCreditedMemberRel.memberPosition

		WITH
			company,
			materials,
			producerProductions,
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

	WITH company, materials, producerProductions, creativeRel, production, creditedMembers,
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
		ORDER BY creativeRel.creditPosition

	OPTIONAL MATCH (production)-[:PLAYS_AT]->(venue:Venue)

	OPTIONAL MATCH (venue)<-[:HAS_SUB_VENUE]-(surVenue:Venue)

	WITH company, materials, producerProductions, production, venue, surVenue,
		COLLECT({
			model: 'CREATIVE_CREDIT',
			name: creativeRel.credit,
			members: creditedMembers,
			coEntities: coCreditedEntities
		}) AS creativeCredits
		ORDER BY production.startDate DESC, production.name, venue.name

	WITH company, materials, producerProductions,
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
					creativeCredits: creativeCredits
				}
			END
		) AS creativeProductions

	OPTIONAL MATCH (company)<-[crewRel:HAS_CREW_ENTITY]-(production:Production)

	UNWIND (CASE WHEN crewRel IS NOT NULL AND EXISTS(crewRel.creditedMemberUuids)
		THEN crewRel.creditedMemberUuids
		ELSE [null]
	END) AS creditedMemberUuid

		OPTIONAL MATCH (production)-[creditedMemberRel:HAS_CREW_ENTITY]->
			(creditedMember:Person { uuid: creditedMemberUuid })
			WHERE crewRel.creditPosition IS NULL OR crewRel.creditPosition = creditedMemberRel.creditPosition

		WITH company, materials, producerProductions, creativeProductions, crewRel, production, creditedMember
			ORDER BY creditedMemberRel.memberPosition

		WITH company, materials, producerProductions, creativeProductions, crewRel, production,
			COLLECT(creditedMember { model: 'PERSON', .uuid, .name }) AS creditedMembers

	OPTIONAL MATCH (production)-[coCreditedEntityRel:HAS_CREW_ENTITY]->(coCreditedEntity)
		WHERE
			(coCreditedEntity:Person OR coCreditedEntity:Company) AND
			coCreditedEntityRel.creditedCompanyUuid IS NULL AND
			(crewRel.creditPosition IS NULL OR crewRel.creditPosition = coCreditedEntityRel.creditPosition) AND
			coCreditedEntity.uuid <> company.uuid

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
			company,
			materials,
			producerProductions,
			creativeProductions,
			crewRel,
			production,
			creditedMembers,
			coCreditedEntityRel,
			coCreditedEntity,
			coCreditedCompanyCreditedMember
			ORDER BY coCreditedCompanyCreditedMemberRel.memberPosition

		WITH
			company,
			materials,
			producerProductions,
			creativeProductions,
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

	WITH company, materials, producerProductions, creativeProductions, crewRel, production, creditedMembers,
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
		ORDER BY crewRel.creditPosition

	OPTIONAL MATCH (production)-[:PLAYS_AT]->(venue:Venue)

	OPTIONAL MATCH (venue)<-[:HAS_SUB_VENUE]-(surVenue:Venue)

	WITH company, materials, producerProductions, creativeProductions, production, venue, surVenue,
		COLLECT({
			model: 'CREW_CREDIT',
			name: crewRel.credit,
			members: creditedMembers,
			coEntities: coCreditedEntities
		}) AS crewCredits
		ORDER BY production.startDate DESC, production.name, venue.name

	WITH company, materials, producerProductions, creativeProductions,
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
					crewCredits: crewCredits
				}
			END
		) AS crewProductions

	OPTIONAL MATCH (company)<-[nomineeRel:HAS_NOMINEE]-(category:AwardCeremonyCategory)
		<-[categoryRel:PRESENTS_CATEGORY]-(ceremony:AwardCeremony)

	OPTIONAL MATCH (ceremony)<-[:PRESENTED_AT]-(award:Award)

	UNWIND (CASE WHEN nomineeRel IS NOT NULL AND EXISTS(nomineeRel.nominatedMemberUuids)
		THEN nomineeRel.nominatedMemberUuids
		ELSE [null]
	END) AS nominatedMemberUuid

		OPTIONAL MATCH (category)-[nominatedMemberRel:HAS_NOMINEE]->
			(nominatedMember:Person { uuid: nominatedMemberUuid })
			WHERE
				nomineeRel.nominationPosition IS NULL OR
				nomineeRel.nominationPosition = nominatedMemberRel.nominationPosition

		WITH
			company,
			materials,
			producerProductions,
			creativeProductions,
			crewProductions,
			nomineeRel,
			category,
			categoryRel,
			ceremony,
			award,
			nominatedMember
			ORDER BY nominatedMemberRel.memberPosition

		WITH
			company,
			materials,
			producerProductions,
			creativeProductions,
			crewProductions,
			nomineeRel,
			category,
			categoryRel,
			ceremony,
			award,
			COLLECT(nominatedMember { model: 'PERSON', .uuid, .name }) AS nominatedMembers

	OPTIONAL MATCH (category)-[coNominatedEntityRel:HAS_NOMINEE]->(coNominatedEntity)
		WHERE
			(coNominatedEntity:Person OR coNominatedEntity:Company) AND
			coNominatedEntityRel.nominatedCompanyUuid IS NULL AND
			(
				nomineeRel.nominationPosition IS NULL OR
				nomineeRel.nominationPosition = coNominatedEntityRel.nominationPosition
			) AND
			coNominatedEntity.uuid <> company.uuid

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
			company,
			materials,
			producerProductions,
			creativeProductions,
			crewProductions,
			nominatedMembers,
			nomineeRel,
			category,
			categoryRel,
			ceremony,
			award,
			coNominatedEntityRel,
			coNominatedEntity,
			coNominatedCompanyNominatedMember
			ORDER BY coNominatedCompanyNominatedMemberRel.memberPosition

		WITH
			company,
			materials,
			producerProductions,
			creativeProductions,
			crewProductions,
			nominatedMembers,
			nomineeRel,
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
		company,
		materials,
		producerProductions,
		creativeProductions,
		crewProductions,
		nominatedMembers,
		nomineeRel,
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
		ORDER BY nomineeRel.nominationPosition

	WITH
		company,
		materials,
		producerProductions,
		creativeProductions,
		crewProductions,
		category,
		categoryRel,
		ceremony,
		award,
		COLLECT({
			model: 'NOMINATION',
			members: nominatedMembers,
			coEntities: coNominatedEntities
		}) AS nominations
		ORDER BY categoryRel.position

	WITH
		company,
		materials,
		producerProductions,
		creativeProductions,
		crewProductions,
		ceremony,
		award,
		COLLECT(category { model: 'AWARD_CEREMONY_CATEGORY', .name, nominations }) AS categories
		ORDER BY ceremony.name DESC

	WITH
		company,
		materials,
		producerProductions,
		creativeProductions,
		crewProductions,
		award,
		COLLECT(ceremony { model: 'AWARD_CEREMONY', .uuid, .name, categories }) AS ceremonies
		ORDER BY award.name

	RETURN
		'COMPANY' AS model,
		company.uuid AS uuid,
		company.name AS name,
		company.differentiator AS differentiator,
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
		creativeProductions,
		crewProductions,
		COLLECT(award { model: 'AWARD', .uuid, .name, ceremonies }) AS awards
`;

export {
	getShowQuery
};
