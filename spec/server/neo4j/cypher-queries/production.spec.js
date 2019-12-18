import { expect } from 'chai';

import * as cypherQueriesProduction from '../../../../server/neo4j/cypher-queries/production';
import { removeWhitespace } from '../../../spec-helpers';

describe('Cypher Queries Production module', () => {

	describe('getCreateQuery function', () => {

		it('returns requisite query', () => {

			const result = cypherQueriesProduction.getCreateQuery();
			expect(removeWhitespace(result)).to.eq(removeWhitespace(`
				CREATE (production:Production { uuid: $uuid, name: $name })

				MERGE (theatre:Theatre { name: $theatre.name })
					ON CREATE SET theatre.uuid = $theatre.uuid

				CREATE (production)-[:PLAYS_AT]->(theatre)

				FOREACH (item IN CASE WHEN $playtext.name <> '' THEN [1] ELSE [] END |
					MERGE (playtext:Playtext { name: $playtext.name })
					ON CREATE SET playtext.uuid = $playtext.uuid
					CREATE (production)-[:PRODUCTION_OF]->(playtext)
				)

				FOREACH (castMember IN $cast |
					MERGE (person:Person { name: castMember.name })
						ON CREATE SET person.uuid = castMember.uuid

					CREATE (production)<-[:PERFORMS_IN { position: castMember.position }]-(person)

					FOREACH (role in castMember.roles |
						CREATE (person)-[:PERFORMS_AS { position: role.position, prodUuid: $uuid }]->
							(:Role { name: role.name, characterName: role.characterName })
					)
				)

				WITH production

				MATCH (production:Production { uuid: $uuid })-[:PLAYS_AT]->(theatre:Theatre)

				OPTIONAL MATCH (production)-[:PRODUCTION_OF]->(playtext:Playtext)

				OPTIONAL MATCH (production)<-[castRel:PERFORMS_IN]-(person:Person)

				OPTIONAL MATCH (person)-[roleRel:PERFORMS_AS { prodUuid: $uuid }]->(role:Role)

				WITH production, theatre, playtext, castRel, person, roleRel, role
					ORDER BY roleRel.position

				WITH production, theatre, playtext, castRel, person,
					COLLECT(CASE WHEN role IS NULL
						THEN null
						ELSE {
							name: role.name,
							characterName: CASE WHEN role.characterName IS NULL THEN '' ELSE role.characterName END
						}
					END) + [{ name: '', characterName: '' }] AS roles
					ORDER BY castRel.position

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

				OPTIONAL MATCH (:Person)-[:PERFORMS_AS { prodUuid: $uuid }]->(role:Role)

				WITH production, COLLECT(role) AS roles
					FOREACH (role in roles | DETACH DELETE role)

				WITH production

				OPTIONAL MATCH (production)-[relationship]-()

				WITH production, COLLECT(relationship) AS relationships
					FOREACH (relationship IN relationships | DELETE relationship)
					SET production.name = $name

				MERGE (theatre:Theatre { name: $theatre.name })
					ON CREATE SET theatre.uuid = $theatre.uuid

				CREATE (production)-[:PLAYS_AT]->(theatre)

				FOREACH (item IN CASE WHEN $playtext.name <> '' THEN [1] ELSE [] END |
					MERGE (playtext:Playtext { name: $playtext.name })
					ON CREATE SET playtext.uuid = $playtext.uuid
					CREATE (production)-[:PRODUCTION_OF]->(playtext)
				)

				FOREACH (castMember IN $cast |
					MERGE (person:Person { name: castMember.name })
						ON CREATE SET person.uuid = castMember.uuid

					CREATE (production)<-[:PERFORMS_IN { position: castMember.position }]-(person)

					FOREACH (role in castMember.roles |
						CREATE (person)-[:PERFORMS_AS { position: role.position, prodUuid: $uuid }]->
							(:Role { name: role.name, characterName: role.characterName })
					)
				)

				WITH production

				MATCH (production:Production { uuid: $uuid })-[:PLAYS_AT]->(theatre:Theatre)

				OPTIONAL MATCH (production)-[:PRODUCTION_OF]->(playtext:Playtext)

				OPTIONAL MATCH (production)<-[castRel:PERFORMS_IN]-(person:Person)

				OPTIONAL MATCH (person)-[roleRel:PERFORMS_AS { prodUuid: $uuid }]->(role:Role)

				WITH production, theatre, playtext, castRel, person, roleRel, role
					ORDER BY roleRel.position

				WITH production, theatre, playtext, castRel, person,
					COLLECT(CASE WHEN role IS NULL
						THEN null
						ELSE {
							name: role.name,
							characterName: CASE WHEN role.characterName IS NULL THEN '' ELSE role.characterName END
						}
					END) + [{ name: '', characterName: '' }] AS roles
					ORDER BY castRel.position

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
