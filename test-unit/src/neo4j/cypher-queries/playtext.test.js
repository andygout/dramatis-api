import { expect } from 'chai';

import * as cypherQueriesPlaytext from '../../../../src/neo4j/cypher-queries/playtext';
import removeExcessWhitespace from '../../../test-helpers/remove-excess-whitespace';

describe('Cypher Queries Playtext module', () => {

	describe('getCreateQuery function', () => {

		it('returns requisite query', () => {

			const result = cypherQueriesPlaytext.getCreateQuery();
			expect(removeExcessWhitespace(result)).to.equal(removeExcessWhitespace(`
				CREATE (playtext:Playtext { uuid: $uuid, name: $name, differentiator: $differentiator })

				WITH playtext

				UNWIND (CASE $characters WHEN [] THEN [null] ELSE $characters END) AS characterParam

					OPTIONAL MATCH (existingCharacter:Character { name: characterParam.name })
						WHERE
							(characterParam.differentiator IS NULL AND existingCharacter.differentiator IS NULL) OR
							(characterParam.differentiator = existingCharacter.differentiator)

					WITH
						playtext,
						characterParam,
						CASE existingCharacter WHEN NULL
							THEN {
								uuid: characterParam.uuid,
								name: characterParam.name,
								differentiator: characterParam.differentiator,
								qualifier: characterParam.qualifier
							}
							ELSE existingCharacter
						END AS characterProps

					FOREACH (item IN CASE characterParam WHEN NULL THEN [] ELSE [1] END |
						MERGE (character:Character { uuid: characterProps.uuid, name: characterProps.name })
							ON CREATE SET character.differentiator = characterProps.differentiator

						CREATE (playtext)-
							[:INCLUDES_CHARACTER { position: characterParam.position, qualifier: characterParam.qualifier }]->
							(character)
					)

				WITH DISTINCT playtext

				MATCH (playtext:Playtext { uuid: $uuid })

				OPTIONAL MATCH (playtext)-[characterRel:INCLUDES_CHARACTER]->(character:Character)

				WITH playtext, characterRel, character
					ORDER BY characterRel.position

				RETURN
					'playtext' AS model,
					playtext.uuid AS uuid,
					playtext.name AS name,
					playtext.differentiator AS differentiator,
					COLLECT(
						CASE character WHEN NULL
							THEN null
							ELSE {
								name: character.name,
								differentiator: character.differentiator,
								qualifier: characterRel.qualifier
							}
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

				SET
					playtext.name = $name,
					playtext.differentiator = $differentiator

				WITH playtext

				UNWIND (CASE $characters WHEN [] THEN [null] ELSE $characters END) AS characterParam

					OPTIONAL MATCH (existingCharacter:Character { name: characterParam.name })
						WHERE
							(characterParam.differentiator IS NULL AND existingCharacter.differentiator IS NULL) OR
							(characterParam.differentiator = existingCharacter.differentiator)

					WITH
						playtext,
						characterParam,
						CASE existingCharacter WHEN NULL
							THEN {
								uuid: characterParam.uuid,
								name: characterParam.name,
								differentiator: characterParam.differentiator,
								qualifier: characterParam.qualifier
							}
							ELSE existingCharacter
						END AS characterProps

					FOREACH (item IN CASE characterParam WHEN NULL THEN [] ELSE [1] END |
						MERGE (character:Character { uuid: characterProps.uuid, name: characterProps.name })
							ON CREATE SET character.differentiator = characterProps.differentiator

						CREATE (playtext)-
							[:INCLUDES_CHARACTER { position: characterParam.position, qualifier: characterParam.qualifier }]->
							(character)
					)

				WITH DISTINCT playtext

				MATCH (playtext:Playtext { uuid: $uuid })

				OPTIONAL MATCH (playtext)-[characterRel:INCLUDES_CHARACTER]->(character:Character)

				WITH playtext, characterRel, character
					ORDER BY characterRel.position

				RETURN
					'playtext' AS model,
					playtext.uuid AS uuid,
					playtext.name AS name,
					playtext.differentiator AS differentiator,
					COLLECT(
						CASE character WHEN NULL
							THEN null
							ELSE {
								name: character.name,
								differentiator: character.differentiator,
								qualifier: characterRel.qualifier
							}
						END
					) + [{ name: '' }] AS characters
			`));

		});

	});

});
