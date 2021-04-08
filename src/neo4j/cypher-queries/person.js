const getShowQuery = () => `
	MATCH (person:Person { uuid: $uuid })

	OPTIONAL MATCH (person)<-[:WRITTEN_BY|USES_SOURCE_MATERIAL*1..2]-(material:Material)

	WITH person, COLLECT(DISTINCT(material)) AS materials

	UNWIND (CASE materials WHEN [] THEN [null] ELSE materials END) AS material

		OPTIONAL MATCH (person)<-[writerRel:WRITTEN_BY]-(material)

		OPTIONAL MATCH (person)<-[:WRITTEN_BY]-(:Material)<-[subsequentVersionRel:SUBSEQUENT_VERSION_OF]-(material)

		OPTIONAL MATCH (person)<-[:WRITTEN_BY]-(:Material)<-[sourcingMaterialRel:USES_SOURCE_MATERIAL]-(material)

		OPTIONAL MATCH (material)-[entityRel:WRITTEN_BY|USES_SOURCE_MATERIAL]->(entity)
			WHERE entity:Person OR entity:Company OR entity:Material

		OPTIONAL MATCH (entity:Material)-[sourceMaterialWriterRel:WRITTEN_BY]->(sourceMaterialWriter)

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

	OPTIONAL MATCH (person)<-[role:HAS_CAST_MEMBER]-(castMemberProduction:Production)

	OPTIONAL MATCH (castMemberProduction)-[:PLAYS_AT]->(theatre:Theatre)

	OPTIONAL MATCH (theatre)<-[:INCLUDES_SUB_THEATRE]-(surTheatre:Theatre)

	OPTIONAL MATCH (castMemberProduction)-[:PRODUCTION_OF]->
		(:Material)-[characterRel:INCLUDES_CHARACTER]->(character:Character)
		WHERE
			(
				role.roleName IN [character.name, characterRel.displayName] OR
				role.characterName IN [character.name, characterRel.displayName]
			) AND
			(role.characterDifferentiator IS NULL OR role.characterDifferentiator = character.differentiator)

	WITH DISTINCT person, materials, castMemberProduction, theatre, surTheatre, role, character
		ORDER BY role.rolePosition

	WITH person, materials, castMemberProduction, theatre, surTheatre,
		COLLECT(
			CASE role.roleName WHEN NULL
				THEN { name: 'Performer' }
				ELSE role { model: 'character', uuid: character.uuid, name: role.roleName, .qualifier }
			END
		) AS roles
		ORDER BY castMemberProduction.name, theatre.name

	WITH person, materials,
		COLLECT(
			CASE castMemberProduction WHEN NULL
				THEN null
				ELSE castMemberProduction {
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

	OPTIONAL MATCH (person)<-[personCreativeRel:HAS_CREATIVE_TEAM_MEMBER]-(creativeProduction:Production)

	OPTIONAL MATCH (creativeProduction)-[companyCreativeRel:HAS_CREATIVE_TEAM_MEMBER]->
		(creativeEmployerCompany:Company { uuid: personCreativeRel.creditedCompanyUuid })
		WHERE
			personCreativeRel.creditPosition IS NULL OR
			personCreativeRel.creditPosition = companyCreativeRel.creditPosition

	UNWIND (CASE WHEN companyCreativeRel IS NOT NULL AND EXISTS(companyCreativeRel.creditedMemberUuids)
		THEN [uuid IN companyCreativeRel.creditedMemberUuids]
		ELSE [null]
	END) AS coCreditedMemberUuid

		OPTIONAL MATCH (creativeProduction)-[coCreditedMemberRel:HAS_CREATIVE_TEAM_MEMBER]->
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
			creativeProduction,
			companyCreativeRel,
			creativeEmployerCompany,
			coCreditedMember
			ORDER BY coCreditedMemberRel.memberPosition

		WITH
			person,
			materials,
			castMemberProductions,
			personCreativeRel,
			creativeProduction,
			companyCreativeRel,
			creativeEmployerCompany,
			COLLECT(coCreditedMember { model: 'person', .uuid, .name }) AS coCreditedMembers

	WITH
		person,
		materials,
		castMemberProductions,
		personCreativeRel,
		creativeProduction,
		CASE creativeEmployerCompany WHEN NULL
			THEN null
			ELSE creativeEmployerCompany { model: 'company', .uuid, .name, coCreditedMembers: coCreditedMembers }
		END AS creativeEmployerCompany,
		COALESCE(creativeEmployerCompany, person) AS entity,
		COALESCE(companyCreativeRel, personCreativeRel) AS entityCreativeRel

	OPTIONAL MATCH (creativeProduction)-[coCreativeEntityRel:HAS_CREATIVE_TEAM_MEMBER]->(coCreativeEntity)
		WHERE
			(coCreativeEntity:Person OR coCreativeEntity:Company) AND
			coCreativeEntityRel.creditedCompanyUuid IS NULL AND
			(
				entityCreativeRel.creditPosition IS NULL OR
				entityCreativeRel.creditPosition = coCreativeEntityRel.creditPosition
			) AND
			coCreativeEntity.uuid <> entity.uuid

	UNWIND (CASE WHEN coCreativeEntityRel IS NOT NULL AND EXISTS(coCreativeEntityRel.creditedMemberUuids)
		THEN [uuid IN coCreativeEntityRel.creditedMemberUuids]
		ELSE [null]
	END) AS coCreativeCompanyCreditedMemberUuid

		OPTIONAL MATCH (creativeProduction)-[coCreativeCompanyCreditedMemberRel:HAS_CREATIVE_TEAM_MEMBER]->
			(coCreativeCompanyCreditedMember:Person { uuid: coCreativeCompanyCreditedMemberUuid })
			WHERE
				coCreativeEntityRel.creditPosition IS NULL OR
				coCreativeEntityRel.creditPosition = coCreativeCompanyCreditedMemberRel.creditPosition

		WITH
			person,
			materials,
			castMemberProductions,
			creativeProduction,
			entityCreativeRel,
			creativeEmployerCompany,
			coCreativeEntityRel,
			coCreativeEntity,
			coCreativeCompanyCreditedMember
			ORDER BY coCreativeCompanyCreditedMemberRel.memberPosition

		WITH
			person,
			materials,
			castMemberProductions,
			creativeProduction,
			entityCreativeRel,
			creativeEmployerCompany,
			coCreativeEntityRel,
			coCreativeEntity,
			COLLECT(coCreativeCompanyCreditedMember {
				model: 'person',
				.uuid,
				.name
			}) AS coCreativeCompanyCreditedMembers
			ORDER BY coCreativeEntityRel.entityPosition

	WITH person, materials, castMemberProductions, creativeProduction, entityCreativeRel, creativeEmployerCompany,
		[coCreditedEntity IN COLLECT(
			CASE coCreativeEntity WHEN NULL
				THEN null
				ELSE coCreativeEntity {
					model: TOLOWER(HEAD(LABELS(coCreativeEntity))),
					.uuid,
					.name,
					creditedMembers: coCreativeCompanyCreditedMembers
				}
			END
		) | CASE coCreditedEntity.model WHEN 'company'
			THEN coCreditedEntity
			ELSE coCreditedEntity { .model, .uuid, .name }
		END] AS coCreditedEntities
		ORDER BY entityCreativeRel.creditPosition

	OPTIONAL MATCH (creativeProduction)-[:PLAYS_AT]->(theatre:Theatre)

	OPTIONAL MATCH (theatre)<-[:INCLUDES_SUB_THEATRE]-(surTheatre:Theatre)

	WITH person, materials, castMemberProductions, creativeProduction, theatre, surTheatre,
		COLLECT({
			model: 'creativeCredit',
			name: entityCreativeRel.credit,
			creditedEmployerCompany: creativeEmployerCompany,
			coCreditedEntities: coCreditedEntities
		}) AS creativeCredits
		ORDER BY creativeProduction.name, theatre.name

	WITH person, materials, castMemberProductions,
		COLLECT(
			CASE creativeProduction WHEN NULL
				THEN null
				ELSE creativeProduction {
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

	OPTIONAL MATCH (person)<-[personCrewRel:HAS_CREW_MEMBER]-(crewProduction:Production)

	OPTIONAL MATCH (crewProduction)-[companyCrewRel:HAS_CREW_MEMBER]->
		(crewEmployerCompany:Company { uuid: personCrewRel.creditedCompanyUuid })
		WHERE
			personCrewRel.creditPosition IS NULL OR
			personCrewRel.creditPosition = companyCrewRel.creditPosition

	UNWIND (CASE WHEN companyCrewRel IS NOT NULL AND EXISTS(companyCrewRel.creditedMemberUuids)
		THEN [uuid IN companyCrewRel.creditedMemberUuids]
		ELSE [null]
	END) AS coCreditedMemberUuid

		OPTIONAL MATCH (crewProduction)-[coCreditedMemberRel:HAS_CREW_MEMBER]->
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
			crewProduction,
			companyCrewRel,
			crewEmployerCompany,
			coCreditedMember
			ORDER BY coCreditedMemberRel.memberPosition

		WITH
			person,
			materials,
			castMemberProductions,
			creativeProductions,
			personCrewRel,
			crewProduction,
			companyCrewRel,
			crewEmployerCompany,
			COLLECT(coCreditedMember { model: 'person', .uuid, .name }) AS coCreditedMembers

	WITH
		person,
		materials,
		castMemberProductions,
		creativeProductions,
		personCrewRel,
		crewProduction,
		CASE crewEmployerCompany WHEN NULL
			THEN null
			ELSE crewEmployerCompany { model: 'company', .uuid, .name, coCreditedMembers: coCreditedMembers }
		END AS crewEmployerCompany,
		COALESCE(crewEmployerCompany, person) AS entity,
		COALESCE(companyCrewRel, personCrewRel) AS entityCrewRel

	OPTIONAL MATCH (crewProduction)-[coCrewEntityRel:HAS_CREW_MEMBER]->(coCrewEntity)
		WHERE
			(coCrewEntity:Person OR coCrewEntity:Company) AND
			coCrewEntityRel.creditedCompanyUuid IS NULL AND
			(
				entityCrewRel.creditPosition IS NULL OR
				entityCrewRel.creditPosition = coCrewEntityRel.creditPosition
			) AND
			coCrewEntity.uuid <> entity.uuid

	UNWIND (CASE WHEN coCrewEntityRel IS NOT NULL AND EXISTS(coCrewEntityRel.creditedMemberUuids)
		THEN [uuid IN coCrewEntityRel.creditedMemberUuids]
		ELSE [null]
	END) AS coCrewCompanyCreditedMemberUuid

		OPTIONAL MATCH (crewProduction)-[coCrewCompanyCreditedMemberRel:HAS_CREW_MEMBER]->
			(coCrewCompanyCreditedMember:Person { uuid: coCrewCompanyCreditedMemberUuid })
			WHERE
				coCrewEntityRel.creditPosition IS NULL OR
				coCrewEntityRel.creditPosition = coCrewCompanyCreditedMemberRel.creditPosition

		WITH
			person,
			materials,
			castMemberProductions,
			creativeProductions,
			crewProduction,
			entityCrewRel,
			crewEmployerCompany,
			coCrewEntityRel,
			coCrewEntity,
			coCrewCompanyCreditedMember
			ORDER BY coCrewCompanyCreditedMemberRel.memberPosition

		WITH
			person,
			materials,
			castMemberProductions,
			creativeProductions,
			crewProduction,
			entityCrewRel,
			crewEmployerCompany,
			coCrewEntityRel,
			coCrewEntity,
			COLLECT(coCrewCompanyCreditedMember {
				model: 'person',
				.uuid,
				.name
			}) AS coCrewCompanyCreditedMembers
			ORDER BY coCrewEntityRel.entityPosition

	WITH
		person,
		materials,
		castMemberProductions,
		creativeProductions,
		crewProduction,
		entityCrewRel,
		crewEmployerCompany,
		[coCreditedEntity IN COLLECT(
			CASE coCrewEntity WHEN NULL
				THEN null
				ELSE coCrewEntity {
					model: TOLOWER(HEAD(LABELS(coCrewEntity))),
					.uuid,
					.name,
					creditedMembers: coCrewCompanyCreditedMembers
				}
			END
		) | CASE coCreditedEntity.model WHEN 'company'
			THEN coCreditedEntity
			ELSE coCreditedEntity { .model, .uuid, .name }
		END] AS coCreditedEntities
		ORDER BY entityCrewRel.creditPosition

	OPTIONAL MATCH (crewProduction)-[:PLAYS_AT]->(theatre:Theatre)

	OPTIONAL MATCH (theatre)<-[:INCLUDES_SUB_THEATRE]-(surTheatre:Theatre)

	WITH person, materials, castMemberProductions, creativeProductions, crewProduction, theatre, surTheatre,
		COLLECT({
			model: 'crewCredit',
			name: entityCrewRel.credit,
			creditedEmployerCompany: crewEmployerCompany,
			coCreditedEntities: coCreditedEntities
		}) AS crewCredits
		ORDER BY crewProduction.name, theatre.name

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
			CASE crewProduction WHEN NULL
				THEN null
				ELSE crewProduction {
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
