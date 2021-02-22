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
						($material.differentiator = existingMaterial.differentiator)

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
						($theatre.differentiator = existingTheatre.differentiator)

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
							(castMemberParam.differentiator = existingPerson.differentiator)

					FOREACH (item IN CASE castMemberParam WHEN NULL THEN [] ELSE [1] END |
						MERGE (castMember:Person {
							uuid: COALESCE(existingPerson.uuid, castMemberParam.uuid),
							name: castMemberParam.name
						})
							ON CREATE SET castMember.differentiator = castMemberParam.differentiator

						FOREACH (role IN CASE castMemberParam.roles WHEN [] THEN [{}] ELSE castMemberParam.roles END |
							CREATE (production)
								<-[:PERFORMS_IN {
									castMemberPosition: castMemberParam.position,
									rolePosition: role.position,
									roleName: role.name,
									characterName: role.characterName,
									characterDifferentiator: role.characterDifferentiator,
									qualifier: role.qualifier
								}]-(castMember)
						)
					)

				WITH DISTINCT production

				UNWIND (CASE $creativeCredits WHEN [] THEN [{ creativeEntities: [] }] ELSE $creativeCredits END) AS creativeCredit

					UNWIND
						CASE SIZE([entity IN creativeCredit.creativeEntities WHERE entity.model = 'person']) WHEN 0
							THEN [null]
							ELSE [entity IN creativeCredit.creativeEntities WHERE entity.model = 'person']
						END AS creativeEntityParam

						OPTIONAL MATCH (existingCreative:Person { name: creativeEntityParam.name })
							WHERE
								(creativeEntityParam.differentiator IS NULL AND existingCreative.differentiator IS NULL) OR
								(creativeEntityParam.differentiator = existingCreative.differentiator)

						FOREACH (item IN CASE creativeEntityParam WHEN NULL THEN [] ELSE [1] END |
							MERGE (entity:Person {
								uuid: COALESCE(existingCreative.uuid, creativeEntityParam.uuid),
								name: creativeEntityParam.name
							})
								ON CREATE SET entity.differentiator = creativeEntityParam.differentiator

							CREATE (production)-
								[:HAS_CREATIVE_TEAM_MEMBER {
									creditPosition: creativeCredit.position,
									entityPosition: creativeEntityParam.position,
									credit: creativeCredit.name
								}]->(entity)
						)

					WITH DISTINCT production, creativeCredit

					UNWIND
						CASE SIZE([entity IN creativeCredit.creativeEntities WHERE entity.model = 'company']) WHEN 0
							THEN [null]
							ELSE [entity IN creativeCredit.creativeEntities WHERE entity.model = 'company']
						END AS creativeEntityParam

						OPTIONAL MATCH (existingCreative:Company { name: creativeEntityParam.name })
							WHERE
								(creativeEntityParam.differentiator IS NULL AND existingCreative.differentiator IS NULL) OR
								(creativeEntityParam.differentiator = existingCreative.differentiator)

						FOREACH (item IN CASE creativeEntityParam WHEN NULL THEN [] ELSE [1] END |
							MERGE (entity:Company {
								uuid: COALESCE(existingCreative.uuid, creativeEntityParam.uuid),
								name: creativeEntityParam.name
							})
								ON CREATE SET entity.differentiator = creativeEntityParam.differentiator

							CREATE (production)-
								[:HAS_CREATIVE_TEAM_MEMBER {
									creditPosition: creativeCredit.position,
									entityPosition: creativeEntityParam.position,
									credit: creativeCredit.name
								}]->(entity)
						)

				WITH DISTINCT production

				MATCH (production:Production { uuid: $uuid })

				OPTIONAL MATCH (production)-[:PRODUCTION_OF]->(material:Material)

				OPTIONAL MATCH (production)-[:PLAYS_AT]->(theatre:Theatre)

				OPTIONAL MATCH (production)<-[role:PERFORMS_IN]-(castMember:Person)

				WITH production, material, theatre, role, castMember
					ORDER BY role.castMemberPosition, role.rolePosition

				WITH production, material, theatre, castMember,
					COLLECT(
						CASE role.roleName WHEN NULL
							THEN null
							ELSE {
								name: role.roleName,
								characterName: CASE role.characterName WHEN NULL THEN '' ELSE role.characterName END,
								characterDifferentiator: CASE role.characterDifferentiator WHEN NULL THEN '' ELSE role.characterDifferentiator END,
								qualifier: CASE role.qualifier WHEN NULL THEN '' ELSE role.qualifier END
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
					WHERE creativeEntity:Person OR creativeEntity:Company

				WITH production, material, theatre, cast, creativeEntityRel, creativeEntity
					ORDER BY creativeEntityRel.creditPosition, creativeEntityRel.entityPosition

				WITH production, material, theatre, cast, creativeEntityRel.credit AS creativeCreditName,
					COLLECT(
						CASE creativeEntity WHEN NULL
							THEN null
							ELSE creativeEntity { model: TOLOWER(HEAD(LABELS(creativeEntity))), .name, .differentiator }
						END
					) + [{}] AS creativeEntities

				RETURN
					'production' AS model,
					production.uuid AS uuid,
					production.name AS name,
					{
						name: CASE material.name WHEN NULL THEN '' ELSE material.name END,
						differentiator: CASE material.differentiator WHEN NULL THEN '' ELSE material.differentiator END
					} AS material,
					{
						name: CASE theatre.name WHEN NULL THEN '' ELSE theatre.name END,
						differentiator: CASE theatre.differentiator WHEN NULL THEN '' ELSE theatre.differentiator END
					} AS theatre,
					cast,
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
						($material.differentiator = existingMaterial.differentiator)

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
						($theatre.differentiator = existingTheatre.differentiator)

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
							(castMemberParam.differentiator = existingPerson.differentiator)

					FOREACH (item IN CASE castMemberParam WHEN NULL THEN [] ELSE [1] END |
						MERGE (castMember:Person {
							uuid: COALESCE(existingPerson.uuid, castMemberParam.uuid),
							name: castMemberParam.name
						})
							ON CREATE SET castMember.differentiator = castMemberParam.differentiator

						FOREACH (role IN CASE castMemberParam.roles WHEN [] THEN [{}] ELSE castMemberParam.roles END |
							CREATE (production)
								<-[:PERFORMS_IN {
									castMemberPosition: castMemberParam.position,
									rolePosition: role.position,
									roleName: role.name,
									characterName: role.characterName,
									characterDifferentiator: role.characterDifferentiator,
									qualifier: role.qualifier
								}]-(castMember)
						)
					)

				WITH DISTINCT production

				UNWIND (CASE $creativeCredits WHEN [] THEN [{ creativeEntities: [] }] ELSE $creativeCredits END) AS creativeCredit

					UNWIND
						CASE SIZE([entity IN creativeCredit.creativeEntities WHERE entity.model = 'person']) WHEN 0
							THEN [null]
							ELSE [entity IN creativeCredit.creativeEntities WHERE entity.model = 'person']
						END AS creativeEntityParam

						OPTIONAL MATCH (existingCreative:Person { name: creativeEntityParam.name })
							WHERE
								(creativeEntityParam.differentiator IS NULL AND existingCreative.differentiator IS NULL) OR
								(creativeEntityParam.differentiator = existingCreative.differentiator)

						FOREACH (item IN CASE creativeEntityParam WHEN NULL THEN [] ELSE [1] END |
							MERGE (entity:Person {
								uuid: COALESCE(existingCreative.uuid, creativeEntityParam.uuid),
								name: creativeEntityParam.name
							})
								ON CREATE SET entity.differentiator = creativeEntityParam.differentiator

							CREATE (production)-
								[:HAS_CREATIVE_TEAM_MEMBER {
									creditPosition: creativeCredit.position,
									entityPosition: creativeEntityParam.position,
									credit: creativeCredit.name
								}]->(entity)
						)

					WITH DISTINCT production, creativeCredit

					UNWIND
						CASE SIZE([entity IN creativeCredit.creativeEntities WHERE entity.model = 'company']) WHEN 0
							THEN [null]
							ELSE [entity IN creativeCredit.creativeEntities WHERE entity.model = 'company']
						END AS creativeEntityParam

						OPTIONAL MATCH (existingCreative:Company { name: creativeEntityParam.name })
							WHERE
								(creativeEntityParam.differentiator IS NULL AND existingCreative.differentiator IS NULL) OR
								(creativeEntityParam.differentiator = existingCreative.differentiator)

						FOREACH (item IN CASE creativeEntityParam WHEN NULL THEN [] ELSE [1] END |
							MERGE (entity:Company {
								uuid: COALESCE(existingCreative.uuid, creativeEntityParam.uuid),
								name: creativeEntityParam.name
							})
								ON CREATE SET entity.differentiator = creativeEntityParam.differentiator

							CREATE (production)-
								[:HAS_CREATIVE_TEAM_MEMBER {
									creditPosition: creativeCredit.position,
									entityPosition: creativeEntityParam.position,
									credit: creativeCredit.name
								}]->(entity)
						)

				WITH DISTINCT production

				MATCH (production:Production { uuid: $uuid })

				OPTIONAL MATCH (production)-[:PRODUCTION_OF]->(material:Material)

				OPTIONAL MATCH (production)-[:PLAYS_AT]->(theatre:Theatre)

				OPTIONAL MATCH (production)<-[role:PERFORMS_IN]-(castMember:Person)

				WITH production, material, theatre, role, castMember
					ORDER BY role.castMemberPosition, role.rolePosition

				WITH production, material, theatre, castMember,
					COLLECT(
						CASE role.roleName WHEN NULL
							THEN null
							ELSE {
								name: role.roleName,
								characterName: CASE role.characterName WHEN NULL THEN '' ELSE role.characterName END,
								characterDifferentiator: CASE role.characterDifferentiator WHEN NULL THEN '' ELSE role.characterDifferentiator END,
								qualifier: CASE role.qualifier WHEN NULL THEN '' ELSE role.qualifier END
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
					WHERE creativeEntity:Person OR creativeEntity:Company

				WITH production, material, theatre, cast, creativeEntityRel, creativeEntity
					ORDER BY creativeEntityRel.creditPosition, creativeEntityRel.entityPosition

				WITH production, material, theatre, cast, creativeEntityRel.credit AS creativeCreditName,
					COLLECT(
						CASE creativeEntity WHEN NULL
							THEN null
							ELSE creativeEntity { model: TOLOWER(HEAD(LABELS(creativeEntity))), .name, .differentiator }
						END
					) + [{}] AS creativeEntities

				RETURN
					'production' AS model,
					production.uuid AS uuid,
					production.name AS name,
					{
						name: CASE material.name WHEN NULL THEN '' ELSE material.name END,
						differentiator: CASE material.differentiator WHEN NULL THEN '' ELSE material.differentiator END
					} AS material,
					{
						name: CASE theatre.name WHEN NULL THEN '' ELSE theatre.name END,
						differentiator: CASE theatre.differentiator WHEN NULL THEN '' ELSE theatre.differentiator END
					} AS theatre,
					cast,
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
			`));

		});

	});

});
