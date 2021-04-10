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
						model: TOLOWER(HEAD(LABELS(sourceMaterialWriter))),
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
						model: 'writingCredit',
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
						model: TOLOWER(HEAD(LABELS(entity))),
						uuid: CASE entity.uuid WHEN person.uuid THEN null ELSE entity.uuid END,
						.name,
						.format,
						writingCredits: sourceMaterialWritingCredits
					}
				END
			) | CASE entity.model WHEN 'material'
				THEN entity
				ELSE entity { .model, .uuid, .name }
			END] AS entities

		WITH person, material, creditType, hasDirectCredit, isSubsequentVersion, isSourcingMaterial,
			COLLECT(
				CASE SIZE(entities) WHEN 0
					THEN null
					ELSE {
						model: 'writingCredit',
						name: COALESCE(writingCreditName, 'by'),
						entities: entities
					}
				END
			) AS writingCredits
			ORDER BY material.name

		WITH person,
			COLLECT(
				CASE material WHEN NULL
					THEN null
					ELSE material {
						model: 'material',
						.uuid,
						.name,
						.format,
						writingCredits: writingCredits,
						creditType: creditType,
						hasDirectCredit: hasDirectCredit,
						isSubsequentVersion: isSubsequentVersion,
						isSourcingMaterial: isSourcingMaterial
					}
				END
			) AS materials

	OPTIONAL MATCH (person)<-[role:HAS_CAST_MEMBER]-(production:Production)

	OPTIONAL MATCH (production)-[:PLAYS_AT]->(theatre:Theatre)

	OPTIONAL MATCH (theatre)<-[:HAS_SUB_THEATRE]-(surTheatre:Theatre)

	OPTIONAL MATCH (production)-[:PRODUCTION_OF]->(:Material)-[characterRel:HAS_CHARACTER]->(character:Character)
		WHERE
			(
				role.roleName IN [character.name, characterRel.displayName] OR
				role.characterName IN [character.name, characterRel.displayName]
			) AND
			(role.characterDifferentiator IS NULL OR role.characterDifferentiator = character.differentiator)

	WITH DISTINCT person, materials, production, theatre, surTheatre, role, character
		ORDER BY role.rolePosition

	WITH person, materials, production, theatre, surTheatre,
		COLLECT(
			CASE role.roleName WHEN NULL
				THEN { name: 'Performer' }
				ELSE role { model: 'character', uuid: character.uuid, name: role.roleName, .qualifier }
			END
		) AS roles
		ORDER BY production.name, theatre.name

	WITH person, materials,
		COLLECT(
			CASE production WHEN NULL
				THEN null
				ELSE production {
					model: 'production',
					.uuid,
					.name,
					theatre: CASE theatre WHEN NULL
						THEN null
						ELSE theatre {
							model: 'theatre',
							.uuid,
							.name,
							surTheatre: CASE surTheatre WHEN NULL
								THEN null
								ELSE surTheatre { model: 'theatre', .uuid, .name }
							END
						}
					END,
					roles: roles
				}
			END
		) AS castMemberProductions

	OPTIONAL MATCH (person)<-[personCreativeRel:HAS_CREATIVE_ENTITY]-(production:Production)

	OPTIONAL MATCH (production)-[companyCreativeRel:HAS_CREATIVE_ENTITY]->
		(creditedEmployerCompany:Company { uuid: personCreativeRel.creditedCompanyUuid })
		WHERE
			personCreativeRel.creditPosition IS NULL OR
			personCreativeRel.creditPosition = companyCreativeRel.creditPosition

	UNWIND (CASE WHEN companyCreativeRel IS NOT NULL AND EXISTS(companyCreativeRel.creditedMemberUuids)
		THEN [uuid IN companyCreativeRel.creditedMemberUuids]
		ELSE [null]
	END) AS coCreditedMemberUuid

		OPTIONAL MATCH (production)-[coCreditedMemberRel:HAS_CREATIVE_ENTITY]->
			(coCreditedMember:Person { uuid: coCreditedMemberUuid })
			WHERE
				coCreditedMember.uuid <> person.uuid AND
				(
					companyCreativeRel.creditPosition IS NULL OR
					companyCreativeRel.creditPosition = coCreditedMemberRel.creditPosition
				)

		WITH
			person,
			materials,
			castMemberProductions,
			personCreativeRel,
			production,
			companyCreativeRel,
			creditedEmployerCompany,
			coCreditedMember
			ORDER BY coCreditedMemberRel.memberPosition

		WITH
			person,
			materials,
			castMemberProductions,
			personCreativeRel,
			production,
			companyCreativeRel,
			creditedEmployerCompany,
			COLLECT(coCreditedMember { model: 'person', .uuid, .name }) AS coCreditedMembers

	WITH
		person,
		materials,
		castMemberProductions,
		personCreativeRel,
		production,
		CASE creditedEmployerCompany WHEN NULL
			THEN null
			ELSE creditedEmployerCompany { model: 'company', .uuid, .name, coCreditedMembers: coCreditedMembers }
		END AS creditedEmployerCompany,
		COALESCE(creditedEmployerCompany, person) AS entity,
		COALESCE(companyCreativeRel, personCreativeRel) AS entityCreativeRel

	OPTIONAL MATCH (production)-[coCreditedEntityRel:HAS_CREATIVE_ENTITY]->(coCreditedEntity)
		WHERE
			(coCreditedEntity:Person OR coCreditedEntity:Company) AND
			coCreditedEntityRel.creditedCompanyUuid IS NULL AND
			(
				entityCreativeRel.creditPosition IS NULL OR
				entityCreativeRel.creditPosition = coCreditedEntityRel.creditPosition
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
			castMemberProductions,
			production,
			entityCreativeRel,
			creditedEmployerCompany,
			coCreditedEntityRel,
			coCreditedEntity,
			coCreditedCompanyCreditedMember
			ORDER BY coCreditedCompanyCreditedMemberRel.memberPosition

		WITH
			person,
			materials,
			castMemberProductions,
			production,
			entityCreativeRel,
			creditedEmployerCompany,
			coCreditedEntityRel,
			coCreditedEntity,
			COLLECT(coCreditedCompanyCreditedMember {
				model: 'person',
				.uuid,
				.name
			}) AS coCreditedCompanyCreditedMembers
			ORDER BY coCreditedEntityRel.entityPosition

	WITH person, materials, castMemberProductions, production, entityCreativeRel, creditedEmployerCompany,
		[coCreditedEntity IN COLLECT(
			CASE coCreditedEntity WHEN NULL
				THEN null
				ELSE coCreditedEntity {
					model: TOLOWER(HEAD(LABELS(coCreditedEntity))),
					.uuid,
					.name,
					creditedMembers: coCreditedCompanyCreditedMembers
				}
			END
		) | CASE coCreditedEntity.model WHEN 'company'
			THEN coCreditedEntity
			ELSE coCreditedEntity { .model, .uuid, .name }
		END] AS coCreditedEntities
		ORDER BY entityCreativeRel.creditPosition

	OPTIONAL MATCH (production)-[:PLAYS_AT]->(theatre:Theatre)

	OPTIONAL MATCH (theatre)<-[:HAS_SUB_THEATRE]-(surTheatre:Theatre)

	WITH person, materials, castMemberProductions, production, theatre, surTheatre,
		COLLECT({
			model: 'creativeCredit',
			name: entityCreativeRel.credit,
			creditedEmployerCompany: creditedEmployerCompany,
			coCreditedEntities: coCreditedEntities
		}) AS creativeCredits
		ORDER BY production.name, theatre.name

	WITH person, materials, castMemberProductions,
		COLLECT(
			CASE production WHEN NULL
				THEN null
				ELSE production {
					model: 'production',
					.uuid,
					.name,
					theatre: CASE theatre WHEN NULL
						THEN null
						ELSE theatre {
							model: 'theatre',
							.uuid,
							.name,
							surTheatre: CASE surTheatre WHEN NULL
								THEN null
								ELSE surTheatre { model: 'theatre', .uuid, .name }
							END
						}
					END,
					creativeCredits: creativeCredits
				}
			END
		) AS creativeProductions

	OPTIONAL MATCH (person)<-[personCrewRel:HAS_CREW_ENTITY]-(production:Production)

	OPTIONAL MATCH (production)-[companyCrewRel:HAS_CREW_ENTITY]->
		(creditedEmployerCompany:Company { uuid: personCrewRel.creditedCompanyUuid })
		WHERE
			personCrewRel.creditPosition IS NULL OR
			personCrewRel.creditPosition = companyCrewRel.creditPosition

	UNWIND (CASE WHEN companyCrewRel IS NOT NULL AND EXISTS(companyCrewRel.creditedMemberUuids)
		THEN [uuid IN companyCrewRel.creditedMemberUuids]
		ELSE [null]
	END) AS coCreditedMemberUuid

		OPTIONAL MATCH (production)-[coCreditedMemberRel:HAS_CREW_ENTITY]->
			(coCreditedMember:Person { uuid: coCreditedMemberUuid })
			WHERE
				coCreditedMember.uuid <> person.uuid AND
				(
					companyCrewRel.creditPosition IS NULL OR
					companyCrewRel.creditPosition = coCreditedMemberRel.creditPosition
				)

		WITH
			person,
			materials,
			castMemberProductions,
			creativeProductions,
			personCrewRel,
			production,
			companyCrewRel,
			creditedEmployerCompany,
			coCreditedMember
			ORDER BY coCreditedMemberRel.memberPosition

		WITH
			person,
			materials,
			castMemberProductions,
			creativeProductions,
			personCrewRel,
			production,
			companyCrewRel,
			creditedEmployerCompany,
			COLLECT(coCreditedMember { model: 'person', .uuid, .name }) AS coCreditedMembers

	WITH
		person,
		materials,
		castMemberProductions,
		creativeProductions,
		personCrewRel,
		production,
		CASE creditedEmployerCompany WHEN NULL
			THEN null
			ELSE creditedEmployerCompany { model: 'company', .uuid, .name, coCreditedMembers: coCreditedMembers }
		END AS creditedEmployerCompany,
		COALESCE(creditedEmployerCompany, person) AS entity,
		COALESCE(companyCrewRel, personCrewRel) AS entityCrewRel

	OPTIONAL MATCH (production)-[coCreditedEntityRel:HAS_CREW_ENTITY]->(coCreditedEntity)
		WHERE
			(coCreditedEntity:Person OR coCreditedEntity:Company) AND
			coCreditedEntityRel.creditedCompanyUuid IS NULL AND
			(
				entityCrewRel.creditPosition IS NULL OR
				entityCrewRel.creditPosition = coCreditedEntityRel.creditPosition
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
			castMemberProductions,
			creativeProductions,
			production,
			entityCrewRel,
			creditedEmployerCompany,
			coCreditedEntityRel,
			coCreditedEntity,
			coCreditedCompanyCreditedMember
			ORDER BY coCreditedCompanyCreditedMemberRel.memberPosition

		WITH
			person,
			materials,
			castMemberProductions,
			creativeProductions,
			production,
			entityCrewRel,
			creditedEmployerCompany,
			coCreditedEntityRel,
			coCreditedEntity,
			COLLECT(coCreditedCompanyCreditedMember {
				model: 'person',
				.uuid,
				.name
			}) AS coCreditedCompanyCreditedMembers
			ORDER BY coCreditedEntityRel.entityPosition

	WITH
		person,
		materials,
		castMemberProductions,
		creativeProductions,
		production,
		entityCrewRel,
		creditedEmployerCompany,
		[coCreditedEntity IN COLLECT(
			CASE coCreditedEntity WHEN NULL
				THEN null
				ELSE coCreditedEntity {
					model: TOLOWER(HEAD(LABELS(coCreditedEntity))),
					.uuid,
					.name,
					creditedMembers: coCreditedCompanyCreditedMembers
				}
			END
		) | CASE coCreditedEntity.model WHEN 'company'
			THEN coCreditedEntity
			ELSE coCreditedEntity { .model, .uuid, .name }
		END] AS coCreditedEntities
		ORDER BY entityCrewRel.creditPosition

	OPTIONAL MATCH (production)-[:PLAYS_AT]->(theatre:Theatre)

	OPTIONAL MATCH (theatre)<-[:HAS_SUB_THEATRE]-(surTheatre:Theatre)

	WITH person, materials, castMemberProductions, creativeProductions, production, theatre, surTheatre,
		COLLECT({
			model: 'crewCredit',
			name: entityCrewRel.credit,
			creditedEmployerCompany: creditedEmployerCompany,
			coCreditedEntities: coCreditedEntities
		}) AS crewCredits
		ORDER BY production.name, theatre.name

	RETURN
		'person' AS model,
		person.uuid AS uuid,
		person.name AS name,
		person.differentiator AS differentiator,
		[
			material IN materials WHERE
				material.hasDirectCredit AND
				NOT material.isSubsequentVersion AND
				material.creditType IS NULL |
			material { .model, .uuid, .name, .format, .writingCredits }
		] AS materials,
		[
			material IN materials WHERE material.isSubsequentVersion |
			material { .model, .uuid, .name, .format, .writingCredits }
		] AS subsequentVersionMaterials,
		[
			material IN materials WHERE
				material.isSourcingMaterial OR
				material.creditType = 'NON_SPECIFIC_SOURCE_MATERIAL' |
			material { .model, .uuid, .name, .format, .writingCredits }
		] AS sourcingMaterials,
		[
			material IN materials WHERE material.creditType = 'RIGHTS_GRANTOR' |
			material { .model, .uuid, .name, .format, .writingCredits }
		] AS rightsGrantorMaterials,
		castMemberProductions,
		creativeProductions,
		COLLECT(
			CASE production WHEN NULL
				THEN null
				ELSE production {
					model: 'production',
					.uuid,
					.name,
					theatre: CASE theatre WHEN NULL
						THEN null
						ELSE theatre {
							model: 'theatre',
							.uuid,
							.name,
							surTheatre: CASE surTheatre WHEN NULL
								THEN null
								ELSE surTheatre { model: 'theatre', .uuid, .name }
							END
						}
					END,
					crewCredits: crewCredits
				}
			END
		) AS crewProductions
`;

export {
	getShowQuery
};
