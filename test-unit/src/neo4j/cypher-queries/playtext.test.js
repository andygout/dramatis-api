import { expect } from 'chai';

import * as cypherQueriesPlaytext from '../../../../src/neo4j/cypher-queries/playtext';
import removeExcessWhitespace from '../../../test-helpers/remove-excess-whitespace';

describe('Cypher Queries Playtext module', () => {

	describe('getCreateQuery function', () => {

		it('returns requisite query', () => {

			const result = cypherQueriesPlaytext.getCreateQuery();
			expect(removeExcessWhitespace(result)).to.equal(removeExcessWhitespace(`
				CREATE (playtext:Playtext { uuid: $uuid, name: $name })

				FOREACH (characterParam IN $characters |
					MERGE (character:Character { name: characterParam.name })
					ON CREATE SET character.uuid = characterParam.uuid
					CREATE (playtext)-[:INCLUDES_CHARACTER { position: characterParam.position }]->(character)
				)

				WITH playtext

				MATCH (playtext:Playtext { uuid: $uuid })

				OPTIONAL MATCH (playtext)-[characterRel:INCLUDES_CHARACTER]->(character:Character)

				WITH playtext, characterRel, character
					ORDER BY characterRel.position

				RETURN
					'playtext' AS model,
					playtext.uuid AS uuid,
					playtext.name AS name,
					COLLECT(
						CASE WHEN character IS NULL
							THEN null
							ELSE { name: character.name }
						END
					) + [{ name: '' }] AS characters
			`));

		});

	});

	describe('getUpdateQuery function', () => {

		it('returns requisite query', () => {

			const result = cypherQueriesPlaytext.getUpdateQuery();
			expect(removeExcessWhitespace(result)).to.equal(removeExcessWhitespace(`
				MATCH (playtext:Playtext { uuid: $uuid })

				OPTIONAL MATCH (playtext)-[relationship:INCLUDES_CHARACTER]->(:Character)

				DELETE relationship

				WITH DISTINCT playtext

				SET playtext.name = $name

				FOREACH (characterParam IN $characters |
					MERGE (character:Character { name: characterParam.name })
					ON CREATE SET character.uuid = characterParam.uuid
					CREATE (playtext)-[:INCLUDES_CHARACTER { position: characterParam.position }]->(character)
				)

				WITH playtext

				MATCH (playtext:Playtext { uuid: $uuid })

				OPTIONAL MATCH (playtext)-[characterRel:INCLUDES_CHARACTER]->(character:Character)

				WITH playtext, characterRel, character
					ORDER BY characterRel.position

				RETURN
					'playtext' AS model,
					playtext.uuid AS uuid,
					playtext.name AS name,
					COLLECT(
						CASE WHEN character IS NULL
							THEN null
							ELSE { name: character.name }
						END
					) + [{ name: '' }] AS characters
			`));

		});

	});

});
