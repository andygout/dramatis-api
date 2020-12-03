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

				OPTIONAL MATCH (existingOriginalVersionPlaytext:Playtext { name: $originalVersionPlaytext.name })
					WHERE
						($originalVersionPlaytext.differentiator IS NULL AND existingOriginalVersionPlaytext.differentiator IS NULL) OR
						($originalVersionPlaytext.differentiator = existingOriginalVersionPlaytext.differentiator)

				WITH
					playtext,
					CASE existingOriginalVersionPlaytext WHEN NULL
						THEN {
							uuid: $originalVersionPlaytext.uuid,
							name: $originalVersionPlaytext.name,
							differentiator: $originalVersionPlaytext.differentiator
						}
						ELSE existingOriginalVersionPlaytext
					END AS originalVersionPlaytextProps

				FOREACH (item IN CASE $originalVersionPlaytext.name WHEN NULL THEN [] ELSE [1] END |
					MERGE (originalVersionPlaytext:Playtext {
						uuid: originalVersionPlaytextProps.uuid,
						name: originalVersionPlaytextProps.name
					})
						ON CREATE SET originalVersionPlaytext.differentiator = originalVersionPlaytextProps.differentiator

					CREATE (playtext)-[:SUBSEQUENT_VERSION_OF]->(originalVersionPlaytext)
				)

				WITH playtext

				UNWIND (CASE $writerGroups WHEN [] THEN [{ writers: [] }] ELSE $writerGroups END) AS writerGroupParam

					UNWIND (CASE writerGroupParam.writers WHEN [] THEN [null] ELSE writerGroupParam.writers END) AS writerParam

						OPTIONAL MATCH (existingWriter:Person { name: writerParam.name })
							WHERE
								(writerParam.differentiator IS NULL AND existingWriter.differentiator IS NULL) OR
								(writerParam.differentiator = existingWriter.differentiator)

						WITH
							playtext,
							writerGroupParam,
							writerParam,
							CASE existingWriter WHEN NULL
								THEN {
									uuid: writerParam.uuid,
									name: writerParam.name,
									differentiator: writerParam.differentiator
								}
								ELSE existingWriter
							END AS writerProps

						FOREACH (item IN CASE writerParam WHEN NULL THEN [] ELSE [1] END |
							MERGE (writer:Person { uuid: writerProps.uuid, name: writerProps.name })
								ON CREATE SET writer.differentiator = writerProps.differentiator

							CREATE (playtext)-
								[:WRITTEN_BY {
									groupPosition: writerGroupParam.position,
									writerPosition: writerParam.position,
									group: writerGroupParam.name,
									isOriginalVersionWriter: writerGroupParam.isOriginalVersionWriter
								}]->(writer)
						)

				WITH DISTINCT playtext

				UNWIND (CASE $characterGroups WHEN [] THEN [{ characters: [] }] ELSE $characterGroups END) AS characterGroupParam

					UNWIND (CASE characterGroupParam.characters WHEN [] THEN [null] ELSE characterGroupParam.characters END) AS characterParam

						OPTIONAL MATCH (existingCharacter:Character {
							name: COALESCE(characterParam.underlyingName, characterParam.name)
						})
							WHERE
								(characterParam.differentiator IS NULL AND existingCharacter.differentiator IS NULL) OR
								(characterParam.differentiator = existingCharacter.differentiator)

						WITH
							playtext,
							characterGroupParam,
							characterParam,
							CASE existingCharacter WHEN NULL
								THEN {
									uuid: characterParam.uuid,
									name: COALESCE(characterParam.underlyingName, characterParam.name),
									differentiator: characterParam.differentiator
								}
								ELSE existingCharacter
							END AS characterProps

						FOREACH (item IN CASE characterParam WHEN NULL THEN [] ELSE [1] END |
							MERGE (character:Character { uuid: characterProps.uuid, name: characterProps.name })
								ON CREATE SET character.differentiator = characterProps.differentiator

							CREATE (playtext)-
								[:INCLUDES_CHARACTER {
									groupPosition: characterGroupParam.position,
									characterPosition: characterParam.position,
									displayName: CASE characterParam.underlyingName WHEN NULL THEN null ELSE characterParam.name END,
									qualifier: characterParam.qualifier,
									group: characterGroupParam.name
								}]->(character)
						)

				WITH DISTINCT playtext

				MATCH (playtext:Playtext { uuid: $uuid })

				OPTIONAL MATCH (playtext)-[:SUBSEQUENT_VERSION_OF]->(originalVersionPlaytext:Playtext)

				OPTIONAL MATCH (playtext)-[writerRel:WRITTEN_BY]->(writer:Person)

				WITH playtext, originalVersionPlaytext, writerRel, writer
					ORDER BY writerRel.groupPosition, writerRel.writerPosition

				WITH
					playtext,
					originalVersionPlaytext,
					writerRel.group AS writerGroupName,
					writerRel.isOriginalVersionWriter AS isOriginalVersionWriter,
					COLLECT(
						CASE writer WHEN NULL
							THEN null
							ELSE { model: 'person', name: writer.name, differentiator: writer.differentiator }
						END
					) + [{}] AS writers

				WITH playtext, originalVersionPlaytext,
					COLLECT(
						CASE WHEN writerGroupName IS NULL AND SIZE(writers) = 1
							THEN null
							ELSE {
								model: 'writerGroup',
								name: writerGroupName,
								isOriginalVersionWriter: isOriginalVersionWriter,
								writers: writers
							}
						END
					) + [{ writers: [{}] }] AS writerGroups

				OPTIONAL MATCH (playtext)-[characterRel:INCLUDES_CHARACTER]->(character:Character)

				WITH playtext, originalVersionPlaytext, writerGroups, characterRel, character
					ORDER BY characterRel.groupPosition, characterRel.characterPosition

				WITH playtext, originalVersionPlaytext, writerGroups, characterRel.group AS characterGroupName,
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

				RETURN
					'playtext' AS model,
					playtext.uuid AS uuid,
					playtext.name AS name,
					playtext.differentiator AS differentiator,
					{
						name: CASE originalVersionPlaytext.name WHEN NULL THEN '' ELSE originalVersionPlaytext.name END,
						differentiator: CASE originalVersionPlaytext.differentiator WHEN NULL THEN '' ELSE originalVersionPlaytext.differentiator END
					} AS originalVersionPlaytext,
					writerGroups,
					COLLECT(
						CASE WHEN characterGroupName IS NULL AND SIZE(characters) = 1
							THEN null
							ELSE { model: 'characterGroup', name: characterGroupName, characters: characters }
						END
					) + [{ characters: [{}] }] AS characterGroups
			`));

		});

	});

	describe('getUpdateQuery function', () => {

		it('returns requisite query', () => {

			const result = cypherQueriesPlaytext.getUpdateQuery();
			expect(removeExcessWhitespace(result)).to.equal(removeExcessWhitespace(`
				MATCH (playtext:Playtext { uuid: $uuid })

				OPTIONAL MATCH (playtext)-[originalVersionPlaytextRel:SUBSEQUENT_VERSION_OF]->(:Playtext)

				DELETE originalVersionPlaytextRel

				WITH DISTINCT playtext

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

				OPTIONAL MATCH (existingOriginalVersionPlaytext:Playtext { name: $originalVersionPlaytext.name })
					WHERE
						($originalVersionPlaytext.differentiator IS NULL AND existingOriginalVersionPlaytext.differentiator IS NULL) OR
						($originalVersionPlaytext.differentiator = existingOriginalVersionPlaytext.differentiator)

				WITH
					playtext,
					CASE existingOriginalVersionPlaytext WHEN NULL
						THEN {
							uuid: $originalVersionPlaytext.uuid,
							name: $originalVersionPlaytext.name,
							differentiator: $originalVersionPlaytext.differentiator
						}
						ELSE existingOriginalVersionPlaytext
					END AS originalVersionPlaytextProps

				FOREACH (item IN CASE $originalVersionPlaytext.name WHEN NULL THEN [] ELSE [1] END |
					MERGE (originalVersionPlaytext:Playtext {
						uuid: originalVersionPlaytextProps.uuid,
						name: originalVersionPlaytextProps.name
					})
						ON CREATE SET originalVersionPlaytext.differentiator = originalVersionPlaytextProps.differentiator

					CREATE (playtext)-[:SUBSEQUENT_VERSION_OF]->(originalVersionPlaytext)
				)

				WITH playtext

				UNWIND (CASE $writerGroups WHEN [] THEN [{ writers: [] }] ELSE $writerGroups END) AS writerGroupParam

					UNWIND (CASE writerGroupParam.writers WHEN [] THEN [null] ELSE writerGroupParam.writers END) AS writerParam

						OPTIONAL MATCH (existingWriter:Person { name: writerParam.name })
							WHERE
								(writerParam.differentiator IS NULL AND existingWriter.differentiator IS NULL) OR
								(writerParam.differentiator = existingWriter.differentiator)

						WITH
							playtext,
							writerGroupParam,
							writerParam,
							CASE existingWriter WHEN NULL
								THEN {
									uuid: writerParam.uuid,
									name: writerParam.name,
									differentiator: writerParam.differentiator
								}
								ELSE existingWriter
							END AS writerProps

						FOREACH (item IN CASE writerParam WHEN NULL THEN [] ELSE [1] END |
							MERGE (writer:Person { uuid: writerProps.uuid, name: writerProps.name })
								ON CREATE SET writer.differentiator = writerProps.differentiator

							CREATE (playtext)-
								[:WRITTEN_BY {
									groupPosition: writerGroupParam.position,
									writerPosition: writerParam.position,
									group: writerGroupParam.name,
									isOriginalVersionWriter: writerGroupParam.isOriginalVersionWriter
								}]->(writer)
						)

				WITH DISTINCT playtext

				UNWIND (CASE $characterGroups WHEN [] THEN [{ characters: [] }] ELSE $characterGroups END) AS characterGroupParam

					UNWIND (CASE characterGroupParam.characters WHEN [] THEN [null] ELSE characterGroupParam.characters END) AS characterParam

						OPTIONAL MATCH (existingCharacter:Character {
							name: COALESCE(characterParam.underlyingName, characterParam.name)
						})
							WHERE
								(characterParam.differentiator IS NULL AND existingCharacter.differentiator IS NULL) OR
								(characterParam.differentiator = existingCharacter.differentiator)

						WITH
							playtext,
							characterGroupParam,
							characterParam,
							CASE existingCharacter WHEN NULL
								THEN {
									uuid: characterParam.uuid,
									name: COALESCE(characterParam.underlyingName, characterParam.name),
									differentiator: characterParam.differentiator
								}
								ELSE existingCharacter
							END AS characterProps

						FOREACH (item IN CASE characterParam WHEN NULL THEN [] ELSE [1] END |
							MERGE (character:Character { uuid: characterProps.uuid, name: characterProps.name })
								ON CREATE SET character.differentiator = characterProps.differentiator

							CREATE (playtext)-
								[:INCLUDES_CHARACTER {
									groupPosition: characterGroupParam.position,
									characterPosition: characterParam.position,
									displayName: CASE characterParam.underlyingName WHEN NULL THEN null ELSE characterParam.name END,
									qualifier: characterParam.qualifier,
									group: characterGroupParam.name
								}]->(character)
						)

				WITH DISTINCT playtext

				MATCH (playtext:Playtext { uuid: $uuid })

				OPTIONAL MATCH (playtext)-[:SUBSEQUENT_VERSION_OF]->(originalVersionPlaytext:Playtext)

				OPTIONAL MATCH (playtext)-[writerRel:WRITTEN_BY]->(writer:Person)

				WITH playtext, originalVersionPlaytext, writerRel, writer
					ORDER BY writerRel.groupPosition, writerRel.writerPosition

				WITH
					playtext,
					originalVersionPlaytext,
					writerRel.group AS writerGroupName,
					writerRel.isOriginalVersionWriter AS isOriginalVersionWriter,
					COLLECT(
						CASE writer WHEN NULL
							THEN null
							ELSE { model: 'person', name: writer.name, differentiator: writer.differentiator }
						END
					) + [{}] AS writers

				WITH playtext, originalVersionPlaytext,
					COLLECT(
						CASE WHEN writerGroupName IS NULL AND SIZE(writers) = 1
							THEN null
							ELSE {
								model: 'writerGroup',
								name: writerGroupName,
								isOriginalVersionWriter: isOriginalVersionWriter,
								writers: writers
							}
						END
					) + [{ writers: [{}] }] AS writerGroups

				OPTIONAL MATCH (playtext)-[characterRel:INCLUDES_CHARACTER]->(character:Character)

				WITH playtext, originalVersionPlaytext, writerGroups, characterRel, character
					ORDER BY characterRel.groupPosition, characterRel.characterPosition

				WITH playtext, originalVersionPlaytext, writerGroups, characterRel.group AS characterGroupName,
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

				RETURN
					'playtext' AS model,
					playtext.uuid AS uuid,
					playtext.name AS name,
					playtext.differentiator AS differentiator,
					{
						name: CASE originalVersionPlaytext.name WHEN NULL THEN '' ELSE originalVersionPlaytext.name END,
						differentiator: CASE originalVersionPlaytext.differentiator WHEN NULL THEN '' ELSE originalVersionPlaytext.differentiator END
					} AS originalVersionPlaytext,
					writerGroups,
					COLLECT(
						CASE WHEN characterGroupName IS NULL AND SIZE(characters) = 1
							THEN null
							ELSE { model: 'characterGroup', name: characterGroupName, characters: characters }
						END
					) + [{ characters: [{}] }] AS characterGroups
			`));

		});

	});

});
