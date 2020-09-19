const getCreateUpdateQuery = action => {

	const createUpdateQueryOpeningMap = {
		create: 'CREATE (playtext:Playtext { uuid: $uuid, name: $name, differentiator: $differentiator })',
		update: `
			MATCH (playtext:Playtext { uuid: $uuid })

			OPTIONAL MATCH (playtext)-[relationship:INCLUDES_CHARACTER]->(:Character)

			DELETE relationship

			WITH DISTINCT playtext

			SET
				playtext.name = $name,
				playtext.differentiator = $differentiator
		`
	};

	return `
		${createUpdateQueryOpeningMap[action]}

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
						qualifier: characterParam.qualifier,
						group: characterParam.group
					}]->(character)
			)

		WITH DISTINCT playtext

		${getEditQuery()}
	`;

};

const getCreateQuery = () => getCreateUpdateQuery('create');

const getEditQuery = () => `
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
					qualifier: characterRel.qualifier,
					group: characterRel.group
				}
			END
		) + [{ name: '' }] AS characters
`;

const getUpdateQuery = () => getCreateUpdateQuery('update');

const getShowQuery = () => `
	MATCH (playtext:Playtext { uuid: $uuid })

	OPTIONAL MATCH (playtext)-[characterRel:INCLUDES_CHARACTER]->(character:Character)

	OPTIONAL MATCH (playtext)<-[:PRODUCTION_OF]-(production:Production)

	OPTIONAL MATCH (production)-[:PLAYS_AT]->(theatre:Theatre)

	WITH playtext, characterRel, character, production, theatre
		ORDER BY characterRel.position

	WITH playtext, characterRel.group AS characterGroup, production, theatre,
		COLLECT(
			CASE character WHEN NULL
				THEN null
				ELSE {
					model: 'character',
					uuid: character.uuid,
					name: character.name,
					qualifier: characterRel.qualifier
				}
			END
		) AS characters
		ORDER BY production.name, theatre.name

	WITH playtext, production, theatre,
		COLLECT(
			{
				model: 'characterGroup',
				name: characterGroup,
				characters: characters
			}
		) AS characterGroups

	RETURN
		'playtext' AS model,
		playtext.uuid AS uuid,
		playtext.name AS name,
		playtext.differentiator AS differentiator,
		characterGroups,
		COLLECT(
			CASE production WHEN NULL
				THEN null
				ELSE {
					model: 'production',
					uuid: production.uuid,
					name: production.name,
					theatre:
						CASE theatre WHEN NULL
							THEN null
							ELSE { model: 'theatre', uuid: theatre.uuid, name: theatre.name }
						END
				}
			END
		) AS productions
`;

export {
	getCreateQuery,
	getEditQuery,
	getUpdateQuery,
	getShowQuery
};
