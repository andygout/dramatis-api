import { expect } from 'chai';

import { removeWhitespace } from '../../../spec-helpers';

import * as subject from '../../../../server/database/cypher-queries/production';

describe('Cypher Queries Production module', () => {

	describe('getCreateQuery function', () => {

		it('will return requisite query', () => {

			const result = subject.getCreateQuery();
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

				RETURN {
					model: 'production',
					uuid: production.uuid,
					name: production.name
				} AS instance
			`));

		});

	});

	describe('getUpdateQuery function', () => {

		it('will return requisite query', () => {

			const result = subject.getUpdateQuery();
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

				RETURN {
					model: 'production',
					uuid: production.uuid,
					name: production.name
				} AS instance
			`));

		});

	});

});
