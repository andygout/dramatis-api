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

				WITH
					production,
					CASE existingMaterial WHEN NULL
						THEN { uuid: $material.uuid, name: $material.name, differentiator: $material.differentiator }
						ELSE existingMaterial
					END AS materialProps

				FOREACH (item IN CASE $material.name WHEN NULL THEN [] ELSE [1] END |
					MERGE (material:Material { uuid: materialProps.uuid, name: materialProps.name })
						ON CREATE SET material.differentiator = materialProps.differentiator

					CREATE (production)-[:PRODUCTION_OF]->(material)
				)

				WITH production

				OPTIONAL MATCH (existingTheatre:Theatre { name: $theatre.name })
					WHERE
						($theatre.differentiator IS NULL AND existingTheatre.differentiator IS NULL) OR
						($theatre.differentiator = existingTheatre.differentiator)

				WITH
					production,
					CASE existingTheatre WHEN NULL
						THEN { uuid: $theatre.uuid, name: $theatre.name, differentiator: $theatre.differentiator }
						ELSE existingTheatre
					END AS theatreProps

				FOREACH (item IN CASE $theatre.name WHEN NULL THEN [] ELSE [1] END |
					MERGE (theatre:Theatre { uuid: theatreProps.uuid, name: theatreProps.name })
						ON CREATE SET theatre.differentiator = theatreProps.differentiator

					CREATE (production)-[:PLAYS_AT]->(theatre)
				)

				WITH production

				UNWIND (CASE $cast WHEN [] THEN [null] ELSE $cast END) AS castMemberParam

					OPTIONAL MATCH (existingPerson:Person { name: castMemberParam.name })
						WHERE
							(castMemberParam.differentiator IS NULL AND existingPerson.differentiator IS NULL) OR
							(castMemberParam.differentiator = existingPerson.differentiator)

					WITH
						production,
						castMemberParam,
						CASE existingPerson WHEN NULL
							THEN {
								uuid: castMemberParam.uuid,
								name: castMemberParam.name,
								differentiator: castMemberParam.differentiator
							}
							ELSE existingPerson
						END AS castMemberProps

					FOREACH (item IN CASE castMemberParam WHEN NULL THEN [] ELSE [1] END |
						MERGE (person:Person { uuid: castMemberProps.uuid, name: castMemberProps.name })
							ON CREATE SET person.differentiator = castMemberProps.differentiator

						FOREACH (role IN CASE castMemberParam.roles WHEN [] THEN [{}] ELSE castMemberParam.roles END |
							CREATE (production)
								<-[:PERFORMS_IN {
									castMemberPosition: castMemberParam.position,
									rolePosition: role.position,
									roleName: role.name,
									characterName: role.characterName,
									characterDifferentiator: role.characterDifferentiator,
									qualifier: role.qualifier
								}]-(person)
						)
					)

				WITH DISTINCT production

				MATCH (production:Production { uuid: $uuid })

				OPTIONAL MATCH (production)-[:PRODUCTION_OF]->(material:Material)

				OPTIONAL MATCH (production)-[:PLAYS_AT]->(theatre:Theatre)

				OPTIONAL MATCH (production)<-[role:PERFORMS_IN]-(person:Person)

				WITH production, material, theatre, role, person
					ORDER BY role.castMemberPosition, role.rolePosition

				WITH production, material, theatre, person,
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
					COLLECT(
						CASE person WHEN NULL
							THEN null
							ELSE { name: person.name, differentiator: person.differentiator, roles: roles }
						END
					) + [{ roles: [{}] }] AS cast
			`));

		});

	});

	describe('getUpdateQuery function', () => {

		it('returns requisite query', () => {

			const result = cypherQueriesProduction.getUpdateQuery();
			expect(removeExcessWhitespace(result)).to.equal(removeExcessWhitespace(`
				MATCH (production:Production { uuid: $uuid })

				OPTIONAL MATCH (production)-[relationship]-()

				DELETE relationship

				WITH DISTINCT production

				SET production.name = $name

				WITH production

				OPTIONAL MATCH (existingMaterial:Material { name: $material.name })
					WHERE
						($material.differentiator IS NULL AND existingMaterial.differentiator IS NULL) OR
						($material.differentiator = existingMaterial.differentiator)

				WITH
					production,
					CASE existingMaterial WHEN NULL
						THEN { uuid: $material.uuid, name: $material.name, differentiator: $material.differentiator }
						ELSE existingMaterial
					END AS materialProps

				FOREACH (item IN CASE $material.name WHEN NULL THEN [] ELSE [1] END |
					MERGE (material:Material { uuid: materialProps.uuid, name: materialProps.name })
						ON CREATE SET material.differentiator = materialProps.differentiator

					CREATE (production)-[:PRODUCTION_OF]->(material)
				)

				WITH production

				OPTIONAL MATCH (existingTheatre:Theatre { name: $theatre.name })
					WHERE
						($theatre.differentiator IS NULL AND existingTheatre.differentiator IS NULL) OR
						($theatre.differentiator = existingTheatre.differentiator)

				WITH
					production,
					CASE existingTheatre WHEN NULL
						THEN { uuid: $theatre.uuid, name: $theatre.name, differentiator: $theatre.differentiator }
						ELSE existingTheatre
					END AS theatreProps

				FOREACH (item IN CASE $theatre.name WHEN NULL THEN [] ELSE [1] END |
					MERGE (theatre:Theatre { uuid: theatreProps.uuid, name: theatreProps.name })
						ON CREATE SET theatre.differentiator = theatreProps.differentiator

					CREATE (production)-[:PLAYS_AT]->(theatre)
				)

				WITH production

				UNWIND (CASE $cast WHEN [] THEN [null] ELSE $cast END) AS castMemberParam

					OPTIONAL MATCH (existingPerson:Person { name: castMemberParam.name })
						WHERE
							(castMemberParam.differentiator IS NULL AND existingPerson.differentiator IS NULL) OR
							(castMemberParam.differentiator = existingPerson.differentiator)

					WITH
						production,
						castMemberParam,
						CASE existingPerson WHEN NULL
							THEN {
								uuid: castMemberParam.uuid,
								name: castMemberParam.name,
								differentiator: castMemberParam.differentiator
							}
							ELSE existingPerson
						END AS castMemberProps

					FOREACH (item IN CASE castMemberParam WHEN NULL THEN [] ELSE [1] END |
						MERGE (person:Person { uuid: castMemberProps.uuid, name: castMemberProps.name })
							ON CREATE SET person.differentiator = castMemberProps.differentiator

						FOREACH (role IN CASE castMemberParam.roles WHEN [] THEN [{}] ELSE castMemberParam.roles END |
							CREATE (production)
								<-[:PERFORMS_IN {
									castMemberPosition: castMemberParam.position,
									rolePosition: role.position,
									roleName: role.name,
									characterName: role.characterName,
									characterDifferentiator: role.characterDifferentiator,
									qualifier: role.qualifier
								}]-(person)
						)
					)

				WITH DISTINCT production

				MATCH (production:Production { uuid: $uuid })

				OPTIONAL MATCH (production)-[:PRODUCTION_OF]->(material:Material)

				OPTIONAL MATCH (production)-[:PLAYS_AT]->(theatre:Theatre)

				OPTIONAL MATCH (production)<-[role:PERFORMS_IN]-(person:Person)

				WITH production, material, theatre, role, person
					ORDER BY role.castMemberPosition, role.rolePosition

				WITH production, material, theatre, person,
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
					COLLECT(
						CASE person WHEN NULL
							THEN null
							ELSE { name: person.name, differentiator: person.differentiator, roles: roles }
						END
					) + [{ roles: [{}] }] AS cast
			`));

		});

	});

});
