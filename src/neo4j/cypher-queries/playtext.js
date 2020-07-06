const getCreateUpdateQuery = action => {

	const createUpdateQueryOpeningMap = {
		create: 'CREATE (playtext:Playtext { uuid: $uuid, name: $name })',
		update: `
			MATCH (playtext:Playtext { uuid: $uuid })

			OPTIONAL MATCH (playtext)-[relationship:INCLUDES_CHARACTER]->(:Character)

			WITH playtext, COLLECT(relationship) AS relationships

			FOREACH (relationship IN relationships | DELETE relationship)

			SET playtext.name = $name
		`
	};

	return `
		${createUpdateQueryOpeningMap[action]}

		FOREACH (characterParam IN $characters |
			MERGE (character:Character { name: characterParam.name })
			ON CREATE SET character.uuid = characterParam.uuid
			CREATE (playtext)-[:INCLUDES_CHARACTER { position: characterParam.position }]->(character)
		)

		WITH playtext

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
		COLLECT(
			CASE WHEN character IS NULL
				THEN null
				ELSE { name: character.name }
			END
		) + [{ name: '' }] AS characters
`;

const getUpdateQuery = () => getCreateUpdateQuery('update');

const getShowQuery = () => `
	MATCH (playtext:Playtext { uuid: $uuid })

	OPTIONAL MATCH (playtext)-[characterRel:INCLUDES_CHARACTER]->(character:Character)

	OPTIONAL MATCH (playtext)<-[:PRODUCTION_OF]-(production:Production)-[:PLAYS_AT]->(theatre:Theatre)

	WITH playtext, character, production, theatre
		ORDER BY characterRel.position

	WITH playtext, production, theatre,
		COLLECT(
			CASE WHEN character IS NULL
				THEN null
				ELSE { model: 'character', uuid: character.uuid, name: character.name }
			END
		) AS characters
		ORDER BY production.name, theatre.name

	RETURN
		'playtext' AS model,
		playtext.uuid AS uuid,
		playtext.name AS name,
		characters,
		COLLECT(
			CASE WHEN production IS NULL
				THEN null
				ELSE {
					model: 'production',
					uuid: production.uuid,
					name: production.name,
					theatre: { model: 'theatre', uuid: theatre.uuid, name: theatre.name }
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
