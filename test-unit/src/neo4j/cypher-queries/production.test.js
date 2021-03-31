import { expect } from 'chai';

import * as cypherQueriesProduction from '../../../../src/neo4j/cypher-queries/production';
import removeExcessWhitespace from '../../../test-helpers/remove-excess-whitespace';

describe('Cypher Queries Production module', () => {

	describe('getCreateQuery function', () => {

		it('returns requisite query', () => {

			const result = cypherQueriesProduction.getCreateQuery();
			expect(removeExcessWhitespace(result)).to.equal(removeExcessWhitespace(`
				CREATE (production:Production { uuid: $uuid, name: $name })

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

				OPTIONAL MATCH (existingTheatre:Theatre { name: $theatre.name })
					WHERE
						($theatre.differentiator IS NULL AND existingTheatre.differentiator IS NULL) OR
						$theatre.differentiator = existingTheatre.differentiator

				FOREACH (item IN CASE $theatre.name WHEN NULL THEN [] ELSE [1] END |
					MERGE (theatre:Theatre {
						uuid: COALESCE(existingTheatre.uuid, $theatre.uuid),
						name: $theatre.name
					})
						ON CREATE SET theatre.differentiator = $theatre.differentiator

					CREATE (production)-[:PLAYS_AT]->(theatre)
				)

				WITH production

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
									qualifier: role.qualifier
								}]->(castMember)
						)
					)

				WITH DISTINCT production

				UNWIND (CASE $creativeCredits WHEN []
					THEN [{ creativeEntities: [] }]
					ELSE $creativeCredits
				END) AS creativeCredit

					UNWIND
						CASE SIZE([entity IN creativeCredit.creativeEntities WHERE entity.model = 'person']) WHEN 0
							THEN [null]
							ELSE [entity IN creativeCredit.creativeEntities WHERE entity.model = 'person']
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
								[:HAS_CREATIVE_TEAM_MEMBER {
									creditPosition: creativeCredit.position,
									entityPosition: creativePersonParam.position,
									credit: creativeCredit.name
								}]->(creativePerson)
						)

					WITH DISTINCT production, creativeCredit

					UNWIND
						CASE SIZE([entity IN creativeCredit.creativeEntities WHERE entity.model = 'company']) WHEN 0
							THEN [null]
							ELSE [entity IN creativeCredit.creativeEntities WHERE entity.model = 'company']
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
								[:HAS_CREATIVE_TEAM_MEMBER {
									creditPosition: creativeCredit.position,
									entityPosition: creativeCompanyParam.position,
									credit: creativeCredit.name
								}]->(creativeCompany)
						)

						WITH production, creativeCredit, creativeCompanyParam

						UNWIND
							CASE WHEN creativeCompanyParam IS NOT NULL AND SIZE(creativeCompanyParam.creditedMembers) > 0
								THEN creativeCompanyParam.creditedMembers
								ELSE [null]
							END AS creditedMemberParam

							OPTIONAL MATCH (creditedCompany:Company { name: creativeCompanyParam.name })
								WHERE
									(creativeCompanyParam.differentiator IS NULL AND creditedCompany.differentiator IS NULL) OR
									creativeCompanyParam.differentiator = creditedCompany.differentiator

							OPTIONAL MATCH (creditedCompany)<-[creativeCompanyRel:HAS_CREATIVE_TEAM_MEMBER]-(production)
								WHERE
									creativeCredit.position IS NULL OR
									creativeCredit.position = creativeCompanyRel.creditPosition

							OPTIONAL MATCH (existingPerson:Person { name: creditedMemberParam.name })
								WHERE
									(creditedMemberParam.differentiator IS NULL AND existingPerson.differentiator IS NULL) OR
									creditedMemberParam.differentiator = existingPerson.differentiator

							FOREACH (item IN CASE WHEN SIZE(creativeCompanyParam.creditedMembers) > 0 THEN [1] ELSE [] END |
								SET creativeCompanyRel.creditedMemberUuids = []
							)

							FOREACH (item IN CASE creditedMemberParam WHEN NULL THEN [] ELSE [1] END |
								MERGE (creditedMember:Person {
									uuid: COALESCE(existingPerson.uuid, creditedMemberParam.uuid),
									name: creditedMemberParam.name
								})
									ON CREATE SET creditedMember.differentiator = creditedMemberParam.differentiator

								CREATE (production)-
									[:HAS_CREATIVE_TEAM_MEMBER {
										creditPosition: creativeCredit.position,
										memberPosition: creditedMemberParam.position,
										creditedCompanyUuid: creditedCompany.uuid
									}]->(creditedMember)

								SET creativeCompanyRel.creditedMemberUuids =
									creativeCompanyRel.creditedMemberUuids + creditedMember.uuid
							)

				WITH DISTINCT production

				UNWIND (CASE $crewCredits WHEN []
					THEN [{ crewEntities: [] }]
					ELSE $crewCredits
				END) AS crewCredit

					UNWIND
						CASE SIZE([entity IN crewCredit.crewEntities WHERE entity.model = 'person']) WHEN 0
							THEN [null]
							ELSE [entity IN crewCredit.crewEntities WHERE entity.model = 'person']
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
								[:HAS_CREW_MEMBER {
									creditPosition: crewCredit.position,
									entityPosition: crewPersonParam.position,
									credit: crewCredit.name
								}]->(crewPerson)
						)

					WITH DISTINCT production, crewCredit

					UNWIND
						CASE SIZE([entity IN crewCredit.crewEntities WHERE entity.model = 'company']) WHEN 0
							THEN [null]
							ELSE [entity IN crewCredit.crewEntities WHERE entity.model = 'company']
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
								[:HAS_CREW_MEMBER {
									creditPosition: crewCredit.position,
									entityPosition: crewCompanyParam.position,
									credit: crewCredit.name
								}]->(crewCompany)
						)

						WITH production, crewCredit, crewCompanyParam

						UNWIND
							CASE WHEN crewCompanyParam IS NOT NULL AND SIZE(crewCompanyParam.creditedMembers) > 0
								THEN crewCompanyParam.creditedMembers
								ELSE [null]
							END AS creditedMemberParam

							OPTIONAL MATCH (creditedCompany:Company { name: crewCompanyParam.name })
								WHERE
									(crewCompanyParam.differentiator IS NULL AND creditedCompany.differentiator IS NULL) OR
									crewCompanyParam.differentiator = creditedCompany.differentiator

							OPTIONAL MATCH (creditedCompany)<-[crewCompanyRel:HAS_CREW_MEMBER]-(production)
								WHERE
									crewCredit.position IS NULL OR
									crewCredit.position = crewCompanyRel.creditPosition

							OPTIONAL MATCH (existingPerson:Person { name: creditedMemberParam.name })
								WHERE
									(creditedMemberParam.differentiator IS NULL AND existingPerson.differentiator IS NULL) OR
									creditedMemberParam.differentiator = existingPerson.differentiator

							FOREACH (item IN CASE WHEN SIZE(crewCompanyParam.creditedMembers) > 0 THEN [1] ELSE [] END |
								SET crewCompanyRel.creditedMemberUuids = []
							)

							FOREACH (item IN CASE creditedMemberParam WHEN NULL THEN [] ELSE [1] END |
								MERGE (creditedMember:Person {
									uuid: COALESCE(existingPerson.uuid, creditedMemberParam.uuid),
									name: creditedMemberParam.name
								})
									ON CREATE SET creditedMember.differentiator = creditedMemberParam.differentiator

								CREATE (production)-
									[:HAS_CREW_MEMBER {
										creditPosition: crewCredit.position,
										memberPosition: creditedMemberParam.position,
										creditedCompanyUuid: creditedCompany.uuid
									}]->(creditedMember)

								SET crewCompanyRel.creditedMemberUuids =
									crewCompanyRel.creditedMemberUuids + creditedMember.uuid
							)

				WITH DISTINCT production

				MATCH (production:Production { uuid: $uuid })

				OPTIONAL MATCH (production)-[:PRODUCTION_OF]->(material:Material)

				OPTIONAL MATCH (production)-[:PLAYS_AT]->(theatre:Theatre)

				OPTIONAL MATCH (production)-[role:HAS_CAST_MEMBER]->(castMember:Person)

				WITH production, material, theatre, role, castMember
					ORDER BY role.castMemberPosition, role.rolePosition

				WITH production, material, theatre, castMember,
					COLLECT(
						CASE role.roleName WHEN NULL
							THEN null
							ELSE {
								name: role.roleName,
								characterName: COALESCE(role.characterName, ''),
								characterDifferentiator: COALESCE(role.characterDifferentiator, ''),
								qualifier: COALESCE(role.qualifier, '')
							}
						END
					) + [{}] AS roles

				WITH production, material, theatre,
					COLLECT(
						CASE castMember WHEN NULL
							THEN null
							ELSE castMember { .name, .differentiator, roles: roles }
						END
					) + [{ roles: [{}] }] AS cast

				OPTIONAL MATCH (production)-[creativeEntityRel:HAS_CREATIVE_TEAM_MEMBER]->(creativeEntity)
					WHERE
						(creativeEntity:Person AND creativeEntityRel.creditedCompanyUuid IS NULL) OR
						creativeEntity:Company

				WITH production, material, theatre, cast, creativeEntityRel,
					COLLECT(creativeEntity {
						model: TOLOWER(HEAD(LABELS(creativeEntity))),
						.name,
						.differentiator,
						creditedMemberUuids: creativeEntityRel.creditedMemberUuids
					}) AS creativeEntities

				UNWIND (CASE creativeEntities WHEN [] THEN [null] ELSE creativeEntities END) AS creativeEntity

					UNWIND (COALESCE(creativeEntity.creditedMemberUuids, [null])) AS creditedMemberUuid

						OPTIONAL MATCH (production)-[creditedMemberRel:HAS_CREATIVE_TEAM_MEMBER]->
							(creditedMember:Person { uuid: creditedMemberUuid })
							WHERE
								creativeEntityRel.creditPosition IS NULL OR
								creativeEntityRel.creditPosition = creditedMemberRel.creditPosition

						WITH production, material, theatre, cast, creativeEntityRel, creativeEntity, creditedMember
							ORDER BY creditedMemberRel.memberPosition

						WITH production, material, theatre, cast, creativeEntityRel, creativeEntity,
							COLLECT(creditedMember { .name, .differentiator }) + [{}] AS creditedMembers

				WITH production, material, theatre, cast, creativeEntityRel, creativeEntity, creditedMembers
					ORDER BY creativeEntityRel.creditPosition, creativeEntityRel.entityPosition

				WITH production, material, theatre, cast, creativeEntityRel.credit AS creativeCreditName,
					[creativeEntity IN COLLECT(
						CASE creativeEntity WHEN NULL
							THEN null
							ELSE creativeEntity { .model, .name, .differentiator, creditedMembers: creditedMembers }
						END
					) | CASE creativeEntity.model WHEN 'company'
						THEN creativeEntity
						ELSE creativeEntity { .model, .name, .differentiator }
					END] + [{}] AS creativeEntities

				WITH production, material, theatre, cast,
					COLLECT(
						CASE WHEN creativeCreditName IS NULL AND SIZE(creativeEntities) = 1
							THEN null
							ELSE {
								model: 'creativeCredit',
								name: creativeCreditName,
								creativeEntities: creativeEntities
							}
						END
					) + [{ creativeEntities: [{}] }] AS creativeCredits

				OPTIONAL MATCH (production)-[crewEntityRel:HAS_CREW_MEMBER]->(crewEntity)
					WHERE
						(crewEntity:Person AND crewEntityRel.creditedCompanyUuid IS NULL) OR
						crewEntity:Company

				WITH production, material, theatre, cast, creativeCredits, crewEntityRel,
					COLLECT(crewEntity {
						model: TOLOWER(HEAD(LABELS(crewEntity))),
						.name,
						.differentiator,
						creditedMemberUuids: crewEntityRel.creditedMemberUuids
					}) AS crewEntities

				UNWIND (CASE crewEntities WHEN [] THEN [null] ELSE crewEntities END) AS crewEntity

					UNWIND (COALESCE(crewEntity.creditedMemberUuids, [null])) AS creditedMemberUuid

						OPTIONAL MATCH (production)-[creditedMemberRel:HAS_CREW_MEMBER]->
							(creditedMember:Person { uuid: creditedMemberUuid })
							WHERE
								crewEntityRel.creditPosition IS NULL OR
								crewEntityRel.creditPosition = creditedMemberRel.creditPosition

						WITH production, material, theatre, cast, creativeCredits, crewEntityRel, crewEntity, creditedMember
							ORDER BY creditedMemberRel.memberPosition

						WITH production, material, theatre, cast, creativeCredits, crewEntityRel, crewEntity,
							COLLECT(creditedMember { .name, .differentiator }) + [{}] AS creditedMembers

				WITH production, material, theatre, cast, creativeCredits, crewEntityRel, crewEntity, creditedMembers
					ORDER BY crewEntityRel.creditPosition, crewEntityRel.entityPosition

				WITH production, material, theatre, cast, creativeCredits, crewEntityRel.credit AS crewCreditName,
					[crewEntity IN COLLECT(
						CASE crewEntity WHEN NULL
							THEN null
							ELSE crewEntity { .model, .name, .differentiator, creditedMembers: creditedMembers }
						END
					) | CASE crewEntity.model WHEN 'company'
						THEN crewEntity
						ELSE crewEntity { .model, .name, .differentiator }
					END] + [{}] AS crewEntities

				RETURN
					'production' AS model,
					production.uuid AS uuid,
					production.name AS name,
					{ name: COALESCE(material.name, ''), differentiator: COALESCE(material.differentiator, '') } AS material,
					{ name: COALESCE(theatre.name, ''), differentiator: COALESCE(theatre.differentiator, '') } AS theatre,
					cast,
					creativeCredits,
					COLLECT(
						CASE WHEN crewCreditName IS NULL AND SIZE(crewEntities) = 1
							THEN null
							ELSE {
								model: 'crewCredit',
								name: crewCreditName,
								crewEntities: crewEntities
							}
						END
					) + [{ crewEntities: [{}] }] AS crewCredits
			`));

		});

	});

	describe('getUpdateQuery function', () => {

		it('returns requisite query', () => {

			const result = cypherQueriesProduction.getUpdateQuery();
			expect(removeExcessWhitespace(result)).to.equal(removeExcessWhitespace(`
				MATCH (production:Production { uuid: $uuid })

				WITH production

				OPTIONAL MATCH (production)-[relationship]-()

				DELETE relationship

				WITH DISTINCT production

				SET production.name = $name

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

				OPTIONAL MATCH (existingTheatre:Theatre { name: $theatre.name })
					WHERE
						($theatre.differentiator IS NULL AND existingTheatre.differentiator IS NULL) OR
						$theatre.differentiator = existingTheatre.differentiator

				FOREACH (item IN CASE $theatre.name WHEN NULL THEN [] ELSE [1] END |
					MERGE (theatre:Theatre {
						uuid: COALESCE(existingTheatre.uuid, $theatre.uuid),
						name: $theatre.name
					})
						ON CREATE SET theatre.differentiator = $theatre.differentiator

					CREATE (production)-[:PLAYS_AT]->(theatre)
				)

				WITH production

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
									qualifier: role.qualifier
								}]->(castMember)
						)
					)

				WITH DISTINCT production

				UNWIND (CASE $creativeCredits WHEN []
					THEN [{ creativeEntities: [] }]
					ELSE $creativeCredits
				END) AS creativeCredit

					UNWIND
						CASE SIZE([entity IN creativeCredit.creativeEntities WHERE entity.model = 'person']) WHEN 0
							THEN [null]
							ELSE [entity IN creativeCredit.creativeEntities WHERE entity.model = 'person']
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
								[:HAS_CREATIVE_TEAM_MEMBER {
									creditPosition: creativeCredit.position,
									entityPosition: creativePersonParam.position,
									credit: creativeCredit.name
								}]->(creativePerson)
						)

					WITH DISTINCT production, creativeCredit

					UNWIND
						CASE SIZE([entity IN creativeCredit.creativeEntities WHERE entity.model = 'company']) WHEN 0
							THEN [null]
							ELSE [entity IN creativeCredit.creativeEntities WHERE entity.model = 'company']
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
								[:HAS_CREATIVE_TEAM_MEMBER {
									creditPosition: creativeCredit.position,
									entityPosition: creativeCompanyParam.position,
									credit: creativeCredit.name
								}]->(creativeCompany)
						)

						WITH production, creativeCredit, creativeCompanyParam

						UNWIND
							CASE WHEN creativeCompanyParam IS NOT NULL AND SIZE(creativeCompanyParam.creditedMembers) > 0
								THEN creativeCompanyParam.creditedMembers
								ELSE [null]
							END AS creditedMemberParam

							OPTIONAL MATCH (creditedCompany:Company { name: creativeCompanyParam.name })
								WHERE
									(creativeCompanyParam.differentiator IS NULL AND creditedCompany.differentiator IS NULL) OR
									creativeCompanyParam.differentiator = creditedCompany.differentiator

							OPTIONAL MATCH (creditedCompany)<-[creativeCompanyRel:HAS_CREATIVE_TEAM_MEMBER]-(production)
								WHERE
									creativeCredit.position IS NULL OR
									creativeCredit.position = creativeCompanyRel.creditPosition

							OPTIONAL MATCH (existingPerson:Person { name: creditedMemberParam.name })
								WHERE
									(creditedMemberParam.differentiator IS NULL AND existingPerson.differentiator IS NULL) OR
									creditedMemberParam.differentiator = existingPerson.differentiator

							FOREACH (item IN CASE WHEN SIZE(creativeCompanyParam.creditedMembers) > 0 THEN [1] ELSE [] END |
								SET creativeCompanyRel.creditedMemberUuids = []
							)

							FOREACH (item IN CASE creditedMemberParam WHEN NULL THEN [] ELSE [1] END |
								MERGE (creditedMember:Person {
									uuid: COALESCE(existingPerson.uuid, creditedMemberParam.uuid),
									name: creditedMemberParam.name
								})
									ON CREATE SET creditedMember.differentiator = creditedMemberParam.differentiator

								CREATE (production)-
									[:HAS_CREATIVE_TEAM_MEMBER {
										creditPosition: creativeCredit.position,
										memberPosition: creditedMemberParam.position,
										creditedCompanyUuid: creditedCompany.uuid
									}]->(creditedMember)

								SET creativeCompanyRel.creditedMemberUuids =
									creativeCompanyRel.creditedMemberUuids + creditedMember.uuid
							)

				WITH DISTINCT production

				UNWIND (CASE $crewCredits WHEN []
					THEN [{ crewEntities: [] }]
					ELSE $crewCredits
				END) AS crewCredit

					UNWIND
						CASE SIZE([entity IN crewCredit.crewEntities WHERE entity.model = 'person']) WHEN 0
							THEN [null]
							ELSE [entity IN crewCredit.crewEntities WHERE entity.model = 'person']
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
								[:HAS_CREW_MEMBER {
									creditPosition: crewCredit.position,
									entityPosition: crewPersonParam.position,
									credit: crewCredit.name
								}]->(crewPerson)
						)

					WITH DISTINCT production, crewCredit

					UNWIND
						CASE SIZE([entity IN crewCredit.crewEntities WHERE entity.model = 'company']) WHEN 0
							THEN [null]
							ELSE [entity IN crewCredit.crewEntities WHERE entity.model = 'company']
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
								[:HAS_CREW_MEMBER {
									creditPosition: crewCredit.position,
									entityPosition: crewCompanyParam.position,
									credit: crewCredit.name
								}]->(crewCompany)
						)

						WITH production, crewCredit, crewCompanyParam

						UNWIND
							CASE WHEN crewCompanyParam IS NOT NULL AND SIZE(crewCompanyParam.creditedMembers) > 0
								THEN crewCompanyParam.creditedMembers
								ELSE [null]
							END AS creditedMemberParam

							OPTIONAL MATCH (creditedCompany:Company { name: crewCompanyParam.name })
								WHERE
									(crewCompanyParam.differentiator IS NULL AND creditedCompany.differentiator IS NULL) OR
									crewCompanyParam.differentiator = creditedCompany.differentiator

							OPTIONAL MATCH (creditedCompany)<-[crewCompanyRel:HAS_CREW_MEMBER]-(production)
								WHERE
									crewCredit.position IS NULL OR
									crewCredit.position = crewCompanyRel.creditPosition

							OPTIONAL MATCH (existingPerson:Person { name: creditedMemberParam.name })
								WHERE
									(creditedMemberParam.differentiator IS NULL AND existingPerson.differentiator IS NULL) OR
									creditedMemberParam.differentiator = existingPerson.differentiator

							FOREACH (item IN CASE WHEN SIZE(crewCompanyParam.creditedMembers) > 0 THEN [1] ELSE [] END |
								SET crewCompanyRel.creditedMemberUuids = []
							)

							FOREACH (item IN CASE creditedMemberParam WHEN NULL THEN [] ELSE [1] END |
								MERGE (creditedMember:Person {
									uuid: COALESCE(existingPerson.uuid, creditedMemberParam.uuid),
									name: creditedMemberParam.name
								})
									ON CREATE SET creditedMember.differentiator = creditedMemberParam.differentiator

								CREATE (production)-
									[:HAS_CREW_MEMBER {
										creditPosition: crewCredit.position,
										memberPosition: creditedMemberParam.position,
										creditedCompanyUuid: creditedCompany.uuid
									}]->(creditedMember)

								SET crewCompanyRel.creditedMemberUuids =
									crewCompanyRel.creditedMemberUuids + creditedMember.uuid
							)

				WITH DISTINCT production

				MATCH (production:Production { uuid: $uuid })

				OPTIONAL MATCH (production)-[:PRODUCTION_OF]->(material:Material)

				OPTIONAL MATCH (production)-[:PLAYS_AT]->(theatre:Theatre)

				OPTIONAL MATCH (production)-[role:HAS_CAST_MEMBER]->(castMember:Person)

				WITH production, material, theatre, role, castMember
					ORDER BY role.castMemberPosition, role.rolePosition

				WITH production, material, theatre, castMember,
					COLLECT(
						CASE role.roleName WHEN NULL
							THEN null
							ELSE {
								name: role.roleName,
								characterName: COALESCE(role.characterName, ''),
								characterDifferentiator: COALESCE(role.characterDifferentiator, ''),
								qualifier: COALESCE(role.qualifier, '')
							}
						END
					) + [{}] AS roles

				WITH production, material, theatre,
					COLLECT(
						CASE castMember WHEN NULL
							THEN null
							ELSE castMember { .name, .differentiator, roles: roles }
						END
					) + [{ roles: [{}] }] AS cast

				OPTIONAL MATCH (production)-[creativeEntityRel:HAS_CREATIVE_TEAM_MEMBER]->(creativeEntity)
					WHERE
						(creativeEntity:Person AND creativeEntityRel.creditedCompanyUuid IS NULL) OR
						creativeEntity:Company

				WITH production, material, theatre, cast, creativeEntityRel,
					COLLECT(creativeEntity {
						model: TOLOWER(HEAD(LABELS(creativeEntity))),
						.name,
						.differentiator,
						creditedMemberUuids: creativeEntityRel.creditedMemberUuids
					}) AS creativeEntities

				UNWIND (CASE creativeEntities WHEN [] THEN [null] ELSE creativeEntities END) AS creativeEntity

					UNWIND (COALESCE(creativeEntity.creditedMemberUuids, [null])) AS creditedMemberUuid

						OPTIONAL MATCH (production)-[creditedMemberRel:HAS_CREATIVE_TEAM_MEMBER]->
							(creditedMember:Person { uuid: creditedMemberUuid })
							WHERE
								creativeEntityRel.creditPosition IS NULL OR
								creativeEntityRel.creditPosition = creditedMemberRel.creditPosition

						WITH production, material, theatre, cast, creativeEntityRel, creativeEntity, creditedMember
							ORDER BY creditedMemberRel.memberPosition

						WITH production, material, theatre, cast, creativeEntityRel, creativeEntity,
							COLLECT(creditedMember { .name, .differentiator }) + [{}] AS creditedMembers

				WITH production, material, theatre, cast, creativeEntityRel, creativeEntity, creditedMembers
					ORDER BY creativeEntityRel.creditPosition, creativeEntityRel.entityPosition

				WITH production, material, theatre, cast, creativeEntityRel.credit AS creativeCreditName,
					[creativeEntity IN COLLECT(
						CASE creativeEntity WHEN NULL
							THEN null
							ELSE creativeEntity { .model, .name, .differentiator, creditedMembers: creditedMembers }
						END
					) | CASE creativeEntity.model WHEN 'company'
						THEN creativeEntity
						ELSE creativeEntity { .model, .name, .differentiator }
					END] + [{}] AS creativeEntities

				WITH production, material, theatre, cast,
					COLLECT(
						CASE WHEN creativeCreditName IS NULL AND SIZE(creativeEntities) = 1
							THEN null
							ELSE {
								model: 'creativeCredit',
								name: creativeCreditName,
								creativeEntities: creativeEntities
							}
						END
					) + [{ creativeEntities: [{}] }] AS creativeCredits

				OPTIONAL MATCH (production)-[crewEntityRel:HAS_CREW_MEMBER]->(crewEntity)
					WHERE
						(crewEntity:Person AND crewEntityRel.creditedCompanyUuid IS NULL) OR
						crewEntity:Company

				WITH production, material, theatre, cast, creativeCredits, crewEntityRel,
					COLLECT(crewEntity {
						model: TOLOWER(HEAD(LABELS(crewEntity))),
						.name,
						.differentiator,
						creditedMemberUuids: crewEntityRel.creditedMemberUuids
					}) AS crewEntities

				UNWIND (CASE crewEntities WHEN [] THEN [null] ELSE crewEntities END) AS crewEntity

					UNWIND (COALESCE(crewEntity.creditedMemberUuids, [null])) AS creditedMemberUuid

						OPTIONAL MATCH (production)-[creditedMemberRel:HAS_CREW_MEMBER]->
							(creditedMember:Person { uuid: creditedMemberUuid })
							WHERE
								crewEntityRel.creditPosition IS NULL OR
								crewEntityRel.creditPosition = creditedMemberRel.creditPosition

						WITH production, material, theatre, cast, creativeCredits, crewEntityRel, crewEntity, creditedMember
							ORDER BY creditedMemberRel.memberPosition

						WITH production, material, theatre, cast, creativeCredits, crewEntityRel, crewEntity,
							COLLECT(creditedMember { .name, .differentiator }) + [{}] AS creditedMembers

				WITH production, material, theatre, cast, creativeCredits, crewEntityRel, crewEntity, creditedMembers
					ORDER BY crewEntityRel.creditPosition, crewEntityRel.entityPosition

				WITH production, material, theatre, cast, creativeCredits, crewEntityRel.credit AS crewCreditName,
					[crewEntity IN COLLECT(
						CASE crewEntity WHEN NULL
							THEN null
							ELSE crewEntity { .model, .name, .differentiator, creditedMembers: creditedMembers }
						END
					) | CASE crewEntity.model WHEN 'company'
						THEN crewEntity
						ELSE crewEntity { .model, .name, .differentiator }
					END] + [{}] AS crewEntities

				RETURN
					'production' AS model,
					production.uuid AS uuid,
					production.name AS name,
					{ name: COALESCE(material.name, ''), differentiator: COALESCE(material.differentiator, '') } AS material,
					{ name: COALESCE(theatre.name, ''), differentiator: COALESCE(theatre.differentiator, '') } AS theatre,
					cast,
					creativeCredits,
					COLLECT(
						CASE WHEN crewCreditName IS NULL AND SIZE(crewEntities) = 1
							THEN null
							ELSE {
								model: 'crewCredit',
								name: crewCreditName,
								crewEntities: crewEntities
							}
						END
					) + [{ crewEntities: [{}] }] AS crewCredits
			`));

		});

	});

});
