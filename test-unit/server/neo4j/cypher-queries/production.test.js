import { expect } from 'chai';

import * as cypherQueriesProduction from '../../../../server/neo4j/cypher-queries/production';
import removeWhitespace from '../../../test-helpers/remove-whitespace';

describe('Cypher Queries Production module', () => {

	describe('getCreateQuery function', () => {

		it('returns requisite query', () => {

			const result = cypherQueriesProduction.getCreateQuery();
			expect(removeWhitespace(result)).to.eq(removeWhitespace(`
				CREATE (production:Production { uuid: $uuid, name: $name })

				MERGE (theatre:Theatre { name: $theatre.name })
					ON CREATE SET theatre.uuid = $theatre.uuid

				CREATE (production)-[:PLAYS_AT]->(theatre)

				FOREACH (item IN CASE WHEN $playtext.name IS NOT NULL THEN [1] ELSE [] END |
					MERGE (playtext:Playtext { name: $playtext.name })
					ON CREATE SET playtext.uuid = $playtext.uuid
					CREATE (production)-[:PRODUCTION_OF]->(playtext)
				)

				FOREACH (castMember IN $cast |
					MERGE (person:Person { name: castMember.name })
						ON CREATE SET person.uuid = castMember.uuid

					FOREACH (role in CASE WHEN size(castMember.roles) > 0 THEN castMember.roles ELSE [{}] END |
						CREATE (production)
							<-[:PERFORMS_IN {
								castMemberPosition: castMember.position,
								rolePosition: role.position,
								roleName: role.name,
								characterName: role.characterName
							}]-(person)
					)
				)

				WITH production

				MATCH (production:Production { uuid: $uuid })-[:PLAYS_AT]->(theatre:Theatre)

				OPTIONAL MATCH (production)-[:PRODUCTION_OF]->(playtext:Playtext)

				OPTIONAL MATCH (production)<-[role:PERFORMS_IN]-(person:Person)

				WITH production, theatre, playtext, role, person
					ORDER BY role.castMemberPosition, role.rolePosition

				WITH production, theatre, playtext, person,
					COLLECT(CASE WHEN role.roleName IS NULL
						THEN null
						ELSE {
							name: role.roleName,
							characterName: CASE WHEN role.characterName IS NULL THEN '' ELSE role.characterName END
						}
					END) + [{ name: '', characterName: '' }] AS roles

				RETURN
					'production' AS model,
					production.uuid AS uuid,
					production.name AS name,
					{ name: theatre.name } AS theatre,
					{ name: CASE WHEN playtext.name IS NULL THEN '' ELSE playtext.name END } AS playtext,
					COLLECT(CASE WHEN person IS NULL
						THEN null
						ELSE { name: person.name, roles: roles }
					END) + [{ name: '', roles: [{ name: '', characterName: '' }] }] AS cast
			`));

		});

	});

	describe('getUpdateQuery function', () => {

		it('returns requisite query', () => {

			const result = cypherQueriesProduction.getUpdateQuery();
			expect(removeWhitespace(result)).to.eq(removeWhitespace(`
				MATCH (production:Production { uuid: $uuid })

				OPTIONAL MATCH (production)-[relationship]-()

				WITH production, COLLECT(relationship) AS relationships
					FOREACH (relationship IN relationships | DELETE relationship)
					SET production.name = $name

				MERGE (theatre:Theatre { name: $theatre.name })
					ON CREATE SET theatre.uuid = $theatre.uuid

				CREATE (production)-[:PLAYS_AT]->(theatre)

				FOREACH (item IN CASE WHEN $playtext.name IS NOT NULL THEN [1] ELSE [] END |
					MERGE (playtext:Playtext { name: $playtext.name })
					ON CREATE SET playtext.uuid = $playtext.uuid
					CREATE (production)-[:PRODUCTION_OF]->(playtext)
				)

				FOREACH (castMember IN $cast |
					MERGE (person:Person { name: castMember.name })
						ON CREATE SET person.uuid = castMember.uuid

					FOREACH (role in CASE WHEN size(castMember.roles) > 0 THEN castMember.roles ELSE [{}] END |
						CREATE (production)
							<-[:PERFORMS_IN {
								castMemberPosition: castMember.position,
								rolePosition: role.position,
								roleName: role.name,
								characterName: role.characterName
							}]-(person)
					)
				)

				WITH production

				MATCH (production:Production { uuid: $uuid })-[:PLAYS_AT]->(theatre:Theatre)

				OPTIONAL MATCH (production)-[:PRODUCTION_OF]->(playtext:Playtext)

				OPTIONAL MATCH (production)<-[role:PERFORMS_IN]-(person:Person)

				WITH production, theatre, playtext, role, person
					ORDER BY role.castMemberPosition, role.rolePosition

				WITH production, theatre, playtext, person,
					COLLECT(CASE WHEN role.roleName IS NULL
						THEN null
						ELSE {
							name: role.roleName,
							characterName: CASE WHEN role.characterName IS NULL THEN '' ELSE role.characterName END
						}
					END) + [{ name: '', characterName: '' }] AS roles

				RETURN
					'production' AS model,
					production.uuid AS uuid,
					production.name AS name,
					{ name: theatre.name } AS theatre,
					{ name: CASE WHEN playtext.name IS NULL THEN '' ELSE playtext.name END } AS playtext,
					COLLECT(CASE WHEN person IS NULL
						THEN null
						ELSE { name: person.name, roles: roles }
					END) + [{ name: '', roles: [{ name: '', characterName: '' }] }] AS cast
			`));

		});

	});

});
