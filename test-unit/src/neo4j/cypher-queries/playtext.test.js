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

				UNWIND (CASE $writers WHEN [] THEN [null] ELSE $writers END) AS writerParam

					OPTIONAL MATCH (existingWriter:Person {
						name: COALESCE(writerParam.underlyingName, writerParam.name)
					})
						WHERE
							(writerParam.differentiator IS NULL AND existingWriter.differentiator IS NULL) OR
							(writerParam.differentiator = existingWriter.differentiator)

					WITH
						playtext,
						writerParam,
						CASE existingWriter WHEN NULL
							THEN {
								uuid: writerParam.uuid,
								name: COALESCE(writerParam.underlyingName, writerParam.name),
								differentiator: writerParam.differentiator,
								qualifier: writerParam.qualifier,
								group: writerParam.group
							}
							ELSE existingWriter
						END AS writerProps

					FOREACH (item IN CASE writerParam WHEN NULL THEN [] ELSE [1] END |
						MERGE (writer:Person { uuid: writerProps.uuid, name: writerProps.name })
							ON CREATE SET writer.differentiator = writerProps.differentiator

						CREATE (playtext)-[:WRITTEN_BY { position: writerParam.position }]->(writer)
					)

				WITH DISTINCT playtext

				UNWIND (CASE $characters WHEN [] THEN [null] ELSE $characters END) AS characterParam

					OPTIONAL MATCH (existingCharacter:Character {
						name: COALESCE(characterParam.underlyingName, characterParam.name)
					})
						WHERE
							(characterParam.differentiator IS NULL AND existingCharacter.differentiator IS NULL) OR
							(characterParam.differentiator = existingCharacter.differentiator)

					WITH
						playtext,
						characterParam,
						CASE existingCharacter WHEN NULL
							THEN {
								uuid: characterParam.uuid,
								name: COALESCE(characterParam.underlyingName, characterParam.name),
								differentiator: characterParam.differentiator,
								qualifier: characterParam.qualifier,
								group: characterParam.group
							}
							ELSE existingCharacter
						END AS characterProps

					FOREACH (item IN CASE characterParam WHEN NULL THEN [] ELSE [1] END |
						MERGE (character:Character { uuid: characterProps.uuid, name: characterProps.name })
							ON CREATE SET character.differentiator = characterProps.differentiator

						CREATE (playtext)-
							[:INCLUDES_CHARACTER {
								position: characterParam.position,
								displayName: CASE characterParam.underlyingName WHEN NULL THEN null ELSE characterParam.name END,
								qualifier: characterParam.qualifier,
								group: characterParam.group
							}]->(character)
					)

				WITH DISTINCT playtext

				MATCH (playtext:Playtext { uuid: $uuid })

				OPTIONAL MATCH (playtext)-[characterRel:INCLUDES_CHARACTER]->(character:Character)

				OPTIONAL MATCH (playtext)-[writerRel:WRITTEN_BY]->(writer:Person)

				WITH playtext, writerRel, writer, characterRel, character
					ORDER BY characterRel.position

				WITH playtext, writer, writerRel,
					COLLECT(
						CASE character WHEN NULL
							THEN null
							ELSE {
								name: COALESCE(characterRel.displayName, character.name),
								underlyingName: CASE characterRel.displayName WHEN NULL THEN null ELSE character.name END,
								differentiator: character.differentiator,
								qualifier: characterRel.qualifier,
								group: characterRel.group
							}
						END
					) + [{}] AS characters
					ORDER BY writerRel.position

				RETURN
					'playtext' AS model,
					playtext.uuid AS uuid,
					playtext.name AS name,
					playtext.differentiator AS differentiator,
					COLLECT(
						CASE writer WHEN NULL
							THEN null
							ELSE {
								name: writer.name,
								differentiator: writer.differentiator
							}
						END
					) + [{}] AS writers,
					characters
			`));

		});

	});

	describe('getUpdateQuery function', () => {

		it('returns requisite query', () => {

			const result = cypherQueriesPlaytext.getUpdateQuery();
			expect(removeExcessWhitespace(result)).to.equal(removeExcessWhitespace(`
				MATCH (playtext:Playtext { uuid: $uuid })

				OPTIONAL MATCH (playtext)-[writerRel:WRITTEN_BY]->(:Person)

				DELETE writerRel

				WITH DISTINCT playtext

				OPTIONAL MATCH (playtext)-[characterRel:INCLUDES_CHARACTER]->(:Character)

				DELETE characterRel

				WITH DISTINCT playtext

				SET
					playtext.name = $name,
					playtext.differentiator = $differentiator

				WITH playtext

				UNWIND (CASE $writers WHEN [] THEN [null] ELSE $writers END) AS writerParam

					OPTIONAL MATCH (existingWriter:Person {
						name: COALESCE(writerParam.underlyingName, writerParam.name)
					})
						WHERE
							(writerParam.differentiator IS NULL AND existingWriter.differentiator IS NULL) OR
							(writerParam.differentiator = existingWriter.differentiator)

					WITH
						playtext,
						writerParam,
						CASE existingWriter WHEN NULL
							THEN {
								uuid: writerParam.uuid,
								name: COALESCE(writerParam.underlyingName, writerParam.name),
								differentiator: writerParam.differentiator,
								qualifier: writerParam.qualifier,
								group: writerParam.group
							}
							ELSE existingWriter
						END AS writerProps

					FOREACH (item IN CASE writerParam WHEN NULL THEN [] ELSE [1] END |
						MERGE (writer:Person { uuid: writerProps.uuid, name: writerProps.name })
							ON CREATE SET writer.differentiator = writerProps.differentiator

						CREATE (playtext)-[:WRITTEN_BY { position: writerParam.position }]->(writer)
					)

				WITH DISTINCT playtext

				UNWIND (CASE $characters WHEN [] THEN [null] ELSE $characters END) AS characterParam

					OPTIONAL MATCH (existingCharacter:Character {
						name: COALESCE(characterParam.underlyingName, characterParam.name)
					})
						WHERE
							(characterParam.differentiator IS NULL AND existingCharacter.differentiator IS NULL) OR
							(characterParam.differentiator = existingCharacter.differentiator)

					WITH
						playtext,
						characterParam,
						CASE existingCharacter WHEN NULL
							THEN {
								uuid: characterParam.uuid,
								name: COALESCE(characterParam.underlyingName, characterParam.name),
								differentiator: characterParam.differentiator,
								qualifier: characterParam.qualifier,
								group: characterParam.group
							}
							ELSE existingCharacter
						END AS characterProps

					FOREACH (item IN CASE characterParam WHEN NULL THEN [] ELSE [1] END |
						MERGE (character:Character { uuid: characterProps.uuid, name: characterProps.name })
							ON CREATE SET character.differentiator = characterProps.differentiator

						CREATE (playtext)-
							[:INCLUDES_CHARACTER {
								position: characterParam.position,
								displayName: CASE characterParam.underlyingName WHEN NULL THEN null ELSE characterParam.name END,
								qualifier: characterParam.qualifier,
								group: characterParam.group
							}]->(character)
					)

				WITH DISTINCT playtext

				MATCH (playtext:Playtext { uuid: $uuid })

				OPTIONAL MATCH (playtext)-[characterRel:INCLUDES_CHARACTER]->(character:Character)

				OPTIONAL MATCH (playtext)-[writerRel:WRITTEN_BY]->(writer:Person)

				WITH playtext, writerRel, writer, characterRel, character
					ORDER BY characterRel.position

				WITH playtext, writer, writerRel,
					COLLECT(
						CASE character WHEN NULL
							THEN null
							ELSE {
								name: COALESCE(characterRel.displayName, character.name),
								underlyingName: CASE characterRel.displayName WHEN NULL THEN null ELSE character.name END,
								differentiator: character.differentiator,
								qualifier: characterRel.qualifier,
								group: characterRel.group
							}
						END
					) + [{}] AS characters
					ORDER BY writerRel.position

				RETURN
					'playtext' AS model,
					playtext.uuid AS uuid,
					playtext.name AS name,
					playtext.differentiator AS differentiator,
					COLLECT(
						CASE writer WHEN NULL
							THEN null
							ELSE {
								name: writer.name,
								differentiator: writer.differentiator
							}
						END
					) + [{}] AS writers,
					characters
			`));

		});

	});

});
