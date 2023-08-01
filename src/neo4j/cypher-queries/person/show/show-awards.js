export default () => `
	MATCH (person:Person { uuid: $uuid })

	CALL {
		WITH person

		OPTIONAL MATCH path=(person)
			<-[:HAS_WRITING_ENTITY*0..1]-(creditingMaterial)-[:HAS_SUB_MATERIAL*0..2]-(nominatedMaterial)
			<-[nomineeRel:HAS_NOMINEE]-(category:AwardCeremonyCategory)
			<-[categoryRel:PRESENTS_CATEGORY]-(ceremony:AwardCeremony)
			WHERE
				(NONE(rel IN RELATIONSHIPS(path)
					WHERE COALESCE(rel.creditType IN ['NON_SPECIFIC_SOURCE_MATERIAL', 'RIGHTS_GRANTOR'], false)
				)) AND
				NOT EXISTS(
					(person)
					<-[:HAS_WRITING_ENTITY]-(:Material)
					<-[:SUBSEQUENT_VERSION_OF]-(:Material)-[:HAS_SUB_MATERIAL*0..2]-(:Material)
					<-[:HAS_NOMINEE]-(category)
				) AND (
					(creditingMaterial)-[:HAS_SUB_MATERIAL*0..2]->(nominatedMaterial) OR
					(creditingMaterial)<-[:HAS_SUB_MATERIAL*0..2]-(nominatedMaterial)
				)

		WITH person, nomineeRel, category, categoryRel, ceremony

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
				nomineeRel,
				nominatedCompanyRel,
				nominatedEmployerCompany,
				category,
				categoryRel,
				ceremony,
				coNominatedMember
				ORDER BY coNominatedMemberRel.memberPosition

			WITH person, nomineeRel, nominatedCompanyRel, nominatedEmployerCompany, category, categoryRel, ceremony,
				COLLECT(coNominatedMember { model: 'PERSON', .uuid, .name }) AS coNominatedMembers

		WITH
			person,
			category,
			categoryRel,
			ceremony,
			CASE WHEN nominatedEmployerCompany IS NULL
				THEN null
				ELSE nominatedEmployerCompany { model: 'COMPANY', .uuid, .name, coMembers: coNominatedMembers }
			END AS nominatedEmployerCompany,
			COALESCE(nominatedEmployerCompany, person) AS entity,
			COALESCE(nominatedCompanyRel, nomineeRel) AS entityRel

		OPTIONAL MATCH (category)-[coNominatedEntityRel:HAS_NOMINEE]->(coNominatedEntity:Person|Company)
			WHERE
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
				entityRel,
				nominatedEmployerCompany,
				category,
				categoryRel,
				ceremony,
				coNominatedEntityRel,
				coNominatedEntity,
				coNominatedCompanyNominatedMember
				ORDER BY coNominatedCompanyNominatedMemberRel.memberPosition

			WITH
				entityRel,
				nominatedEmployerCompany,
				category,
				categoryRel,
				ceremony,
				coNominatedEntityRel,
				coNominatedEntity,
				COLLECT(coNominatedCompanyNominatedMember {
					model: 'PERSON', .uuid, .name
				}) AS coNominatedCompanyNominatedMembers
				ORDER BY coNominatedEntityRel.entityPosition

		WITH entityRel, nominatedEmployerCompany, category, categoryRel, ceremony,
			COLLECT(
				CASE WHEN coNominatedEntity IS NULL
					THEN null
					ELSE coNominatedEntity {
						model: TOUPPER(HEAD(LABELS(coNominatedEntity))),
						.uuid,
						.name,
						members: coNominatedCompanyNominatedMembers
					}
				END
			) AS coNominatedEntities

		WITH entityRel, nominatedEmployerCompany, category, categoryRel, ceremony,
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

		OPTIONAL MATCH (surProduction)<-[:HAS_SUB_PRODUCTION]-(surSurProduction:Production)

		WITH
			entityRel,
			nominatedEmployerCompany,
			category,
			categoryRel,
			ceremony,
			coNominatedEntities,
			nominatedProductionRel,
			nominatedProduction,
			venue,
			surVenue,
			surProduction,
			surSurProduction
			ORDER BY nominatedProductionRel.productionPosition

		WITH entityRel, nominatedEmployerCompany, category, categoryRel, ceremony, coNominatedEntities,
			COLLECT(
				CASE WHEN nominatedProduction IS NULL
					THEN null
					ELSE nominatedProduction {
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

		WITH
			entityRel,
			nominatedEmployerCompany,
			category,
			categoryRel,
			ceremony,
			coNominatedEntities,
			nominatedProductions,
			nominatedMaterialRel,
			nominatedMaterial
			ORDER BY nominatedMaterialRel.materialPosition

		OPTIONAL MATCH (nominatedMaterial)<-[:HAS_SUB_MATERIAL]-(nominatedSurMaterial:Material)

		OPTIONAL MATCH (nominatedSurMaterial)<-[:HAS_SUB_MATERIAL]-(nominatedSurSurMaterial:Material)

		WITH
			entityRel,
			nominatedEmployerCompany,
			category,
			categoryRel,
			ceremony,
			coNominatedEntities,
			nominatedProductions,
			COLLECT(
				CASE WHEN nominatedMaterial IS NULL
					THEN null
					ELSE nominatedMaterial {
						model: 'MATERIAL',
						.uuid,
						.name,
						.format,
						.year,
						surMaterial: CASE WHEN nominatedSurMaterial IS NULL
							THEN null
							ELSE nominatedSurMaterial {
								model: 'MATERIAL',
								.uuid,
								.name,
								surMaterial: CASE WHEN nominatedSurSurMaterial IS NULL
									THEN null
									ELSE nominatedSurSurMaterial { model: 'MATERIAL', .uuid, .name }
								END
							}
						END
					}
				END
			) AS nominatedMaterials
			ORDER BY entityRel.nominationPosition

		WITH category, categoryRel, ceremony,
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

		WITH ceremony, COLLECT(category { model: 'AWARD_CEREMONY_CATEGORY', .name, nominations }) AS categories
			ORDER BY ceremony.name DESC

		OPTIONAL MATCH (ceremony)<-[:PRESENTED_AT]-(award:Award)

		WITH award, COLLECT(ceremony { model: 'AWARD_CEREMONY', .uuid, .name, categories }) AS ceremonies
			ORDER BY award.name

		RETURN
			COLLECT(award { model: 'AWARD', .uuid, .name, ceremonies }) AS awards
	}

	RETURN
		awards
`;
