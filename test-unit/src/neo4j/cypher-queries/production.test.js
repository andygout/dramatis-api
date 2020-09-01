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

				OPTIONAL MATCH (existingTheatre:Theatre { name: $theatre.name })
					WHERE
						($theatre.differentiator IS NULL AND existingTheatre.differentiator IS NULL) OR
						($theatre.differentiator = existingTheatre.differentiator)

				WITH
					production,
					CASE WHEN existingTheatre IS NULL
						THEN { uuid: $theatre.uuid, name: $theatre.name, differentiator: $theatre.differentiator }
						ELSE existingTheatre
					END AS theatreProps

				FOREACH (item IN CASE WHEN $theatre.name IS NOT NULL THEN [1] ELSE [] END |
					MERGE (theatre:Theatre { uuid: theatreProps.uuid, name: theatreProps.name })
						ON CREATE SET theatre.differentiator = theatreProps.differentiator

					CREATE (production)-[:PLAYS_AT]->(theatre)
				)

				WITH production

				OPTIONAL MATCH (existingPlaytext:Playtext { name: $playtext.name })
					WHERE
						($playtext.differentiator IS NULL AND existingPlaytext.differentiator IS NULL) OR
						($playtext.differentiator = existingPlaytext.differentiator)

				WITH
					production,
					CASE WHEN existingPlaytext IS NULL
						THEN { uuid: $playtext.uuid, name: $playtext.name, differentiator: $playtext.differentiator }
						ELSE existingPlaytext
					END AS playtextProps

				FOREACH (item IN CASE WHEN $playtext.name IS NOT NULL THEN [1] ELSE [] END |
					MERGE (playtext:Playtext { uuid: playtextProps.uuid, name: playtextProps.name })
						ON CREATE SET playtext.differentiator = playtextProps.differentiator

					CREATE (production)-[:PRODUCTION_OF]->(playtext)
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
						CASE WHEN existingPerson IS NULL
							THEN {
								uuid: castMemberParam.uuid,
								name: castMemberParam.name,
								differentiator: castMemberParam.differentiator
							}
							ELSE existingPerson
						END AS castMemberProps

					FOREACH (item IN CASE WHEN castMemberParam IS NOT NULL THEN [1] ELSE [] END |
						MERGE (person:Person { uuid: castMemberProps.uuid, name: castMemberProps.name })
							ON CREATE SET person.differentiator = castMemberProps.differentiator

						FOREACH (role IN CASE castMemberParam.roles WHEN [] THEN [{}] ELSE castMemberParam.roles END |
							CREATE (production)
								<-[:PERFORMS_IN {
									castMemberPosition: castMemberParam.position,
									rolePosition: role.position,
									roleName: role.name,
									characterName: role.characterName
								}]-(person)
						)
					)

				WITH DISTINCT production

				MATCH (production:Production { uuid: $uuid })

				OPTIONAL MATCH (production)-[:PLAYS_AT]->(theatre:Theatre)

				OPTIONAL MATCH (production)-[:PRODUCTION_OF]->(playtext:Playtext)

				OPTIONAL MATCH (production)<-[role:PERFORMS_IN]-(person:Person)

				WITH production, theatre, playtext, role, person
					ORDER BY role.castMemberPosition, role.rolePosition

				WITH production, theatre, playtext, person,
					COLLECT(
						CASE WHEN role.roleName IS NULL
							THEN null
							ELSE {
								name: role.roleName,
								characterName: CASE WHEN role.characterName IS NULL THEN '' ELSE role.characterName END
							}
						END
					) + [{ name: '', characterName: '' }] AS roles

				RETURN
					'production' AS model,
					production.uuid AS uuid,
					production.name AS name,
					{
						name: CASE WHEN theatre.name IS NULL THEN '' ELSE theatre.name END,
						differentiator: CASE WHEN theatre.differentiator IS NULL THEN '' ELSE theatre.differentiator END
					} AS theatre,
					{
						name: CASE WHEN playtext.name IS NULL THEN '' ELSE playtext.name END,
						differentiator: CASE WHEN playtext.differentiator IS NULL THEN '' ELSE playtext.differentiator END
					} AS playtext,
					COLLECT(
						CASE WHEN person IS NULL
							THEN null
							ELSE { name: person.name, differentiator: person.differentiator, roles: roles }
						END
					) + [{ name: '', roles: [{ name: '', characterName: '' }] }] AS cast
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

				OPTIONAL MATCH (existingTheatre:Theatre { name: $theatre.name })
					WHERE
						($theatre.differentiator IS NULL AND existingTheatre.differentiator IS NULL) OR
						($theatre.differentiator = existingTheatre.differentiator)

				WITH
					production,
					CASE WHEN existingTheatre IS NULL
						THEN { uuid: $theatre.uuid, name: $theatre.name, differentiator: $theatre.differentiator }
						ELSE existingTheatre
					END AS theatreProps

				FOREACH (item IN CASE WHEN $theatre.name IS NOT NULL THEN [1] ELSE [] END |
					MERGE (theatre:Theatre { uuid: theatreProps.uuid, name: theatreProps.name })
						ON CREATE SET theatre.differentiator = theatreProps.differentiator

					CREATE (production)-[:PLAYS_AT]->(theatre)
				)

				WITH production

				OPTIONAL MATCH (existingPlaytext:Playtext { name: $playtext.name })
					WHERE
						($playtext.differentiator IS NULL AND existingPlaytext.differentiator IS NULL) OR
						($playtext.differentiator = existingPlaytext.differentiator)

				WITH
					production,
					CASE WHEN existingPlaytext IS NULL
						THEN { uuid: $playtext.uuid, name: $playtext.name, differentiator: $playtext.differentiator }
						ELSE existingPlaytext
					END AS playtextProps

				FOREACH (item IN CASE WHEN $playtext.name IS NOT NULL THEN [1] ELSE [] END |
					MERGE (playtext:Playtext { uuid: playtextProps.uuid, name: playtextProps.name })
						ON CREATE SET playtext.differentiator = playtextProps.differentiator

					CREATE (production)-[:PRODUCTION_OF]->(playtext)
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
						CASE WHEN existingPerson IS NULL
							THEN {
								uuid: castMemberParam.uuid,
								name: castMemberParam.name,
								differentiator: castMemberParam.differentiator
							}
							ELSE existingPerson
						END AS castMemberProps

					FOREACH (item IN CASE WHEN castMemberParam IS NOT NULL THEN [1] ELSE [] END |
						MERGE (person:Person { uuid: castMemberProps.uuid, name: castMemberProps.name })
							ON CREATE SET person.differentiator = castMemberProps.differentiator

						FOREACH (role IN CASE castMemberParam.roles WHEN [] THEN [{}] ELSE castMemberParam.roles END |
							CREATE (production)
								<-[:PERFORMS_IN {
									castMemberPosition: castMemberParam.position,
									rolePosition: role.position,
									roleName: role.name,
									characterName: role.characterName
								}]-(person)
						)
					)

				WITH DISTINCT production

				MATCH (production:Production { uuid: $uuid })

				OPTIONAL MATCH (production)-[:PLAYS_AT]->(theatre:Theatre)

				OPTIONAL MATCH (production)-[:PRODUCTION_OF]->(playtext:Playtext)

				OPTIONAL MATCH (production)<-[role:PERFORMS_IN]-(person:Person)

				WITH production, theatre, playtext, role, person
					ORDER BY role.castMemberPosition, role.rolePosition

				WITH production, theatre, playtext, person,
					COLLECT(
						CASE WHEN role.roleName IS NULL
							THEN null
							ELSE {
								name: role.roleName,
								characterName: CASE WHEN role.characterName IS NULL THEN '' ELSE role.characterName END
							}
						END
					) + [{ name: '', characterName: '' }] AS roles

				RETURN
					'production' AS model,
					production.uuid AS uuid,
					production.name AS name,
					{
						name: CASE WHEN theatre.name IS NULL THEN '' ELSE theatre.name END,
						differentiator: CASE WHEN theatre.differentiator IS NULL THEN '' ELSE theatre.differentiator END
					} AS theatre,
					{
						name: CASE WHEN playtext.name IS NULL THEN '' ELSE playtext.name END,
						differentiator: CASE WHEN playtext.differentiator IS NULL THEN '' ELSE playtext.differentiator END
					} AS playtext,
					COLLECT(
						CASE WHEN person IS NULL
							THEN null
							ELSE { name: person.name, differentiator: person.differentiator, roles: roles }
						END
					) + [{ name: '', roles: [{ name: '', characterName: '' }] }] AS cast
			`));

		});

	});

});
