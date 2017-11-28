const getCreateUpdateQuery = action => {

	const createUpdateQueryOpeningMap = {
		create: 'CREATE (playtext:Playtext { uuid: $uuid, name: $name })',
		update: `
			MATCH (playtext:Playtext { uuid: $uuid })

			OPTIONAL MATCH (playtext)-[relationship:INCLUDES_CHARACTER]->(:Character)

			WITH playtext, COLLECT(relationship) AS relationships
				FOREACH (relationship in relationships | DELETE relationship)
				SET playtext.name = $name
		`
	};

	return `
		${createUpdateQueryOpeningMap[action]}

		FOREACH (char IN $characters |
			MERGE (character:Character { name: char.name })
			ON CREATE SET character.uuid = char.uuid
			CREATE (playtext)-[:INCLUDES_CHARACTER { position: char.position }]->(character)
		)

		RETURN {
			model: 'playtext',
			uuid: playtext.uuid,
			name: playtext.name
		} AS instance
	`;

};

const getCreateQuery = () => getCreateUpdateQuery('create');

const getEditQuery = () => `
	MATCH (playtext:Playtext { uuid: $uuid })

	OPTIONAL MATCH (playtext)-[charRel:INCLUDES_CHARACTER]->(character:Character)

	WITH playtext, charRel, character
		ORDER BY charRel.position

	RETURN {
		model: 'playtext',
		uuid: playtext.uuid,
		name: playtext.name,
		characters: COLLECT(CASE WHEN character IS NULL THEN null ELSE { name: character.name } END)
	} AS instance
`;

const getUpdateQuery = () => getCreateUpdateQuery('update');

const getShowQuery = () => `
	MATCH (playtext:Playtext { uuid: $uuid })

	OPTIONAL MATCH (playtext)-[charRel:INCLUDES_CHARACTER]->(character:Character)

	OPTIONAL MATCH (playtext)<-[:PRODUCTION_OF]-(production:Production)-[:PLAYS_AT]->(theatre:Theatre)

	WITH playtext, character, production, theatre
		ORDER BY charRel.position

	WITH playtext, production, theatre,
		COLLECT(CASE WHEN character IS NULL THEN null ELSE
				{ model: 'character', uuid: character.uuid, name: character.name }
			END) AS characters
		ORDER BY production.name, theatre.name

	RETURN {
		model: 'playtext',
		uuid: playtext.uuid,
		name: playtext.name,
		characters: characters,
		productions: COLLECT(CASE WHEN production IS NULL THEN null ELSE
			{
				model: 'production',
				uuid: production.uuid,
				name: production.name,
				theatre: { model: 'theatre', uuid: theatre.uuid, name: theatre.name }
			} END)
	} AS instance
`;

export {
	getCreateQuery,
	getEditQuery,
	getUpdateQuery,
	getShowQuery
};
