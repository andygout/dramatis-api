const getCreateUpdateQuery = action => {

	const createUpdateQueryOpeningMap = {
		create: 'CREATE (production:Production { uuid: $uuid, name: $name })',
		update: `
			MATCH (production:Production { uuid: $uuid })

			OPTIONAL MATCH (:Person)-[:PERFORMS_AS { prodUuid: $uuid }]->(role:Role)

			WITH production, COLLECT(role) AS roles
				FOREACH (role in roles | DETACH DELETE role)

			WITH production

			OPTIONAL MATCH (production)-[relationship]-()

			WITH production, COLLECT(relationship) AS relationships
				FOREACH (relationship IN relationships | DELETE relationship)
				SET production.name = $name
		`
	};

	return `
		${createUpdateQueryOpeningMap[action]}
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
	`;

};

const getCreateQuery = () => getCreateUpdateQuery('create');

const getEditQuery = () => `
	MATCH (production:Production { uuid: $uuid })-[:PLAYS_AT]->(theatre:Theatre)

	OPTIONAL MATCH (production)-[:PRODUCTION_OF]->(playtext:Playtext)

	OPTIONAL MATCH (production)<-[castRel:PERFORMS_IN]-(person:Person)

	OPTIONAL MATCH (person)-[roleRel:PERFORMS_AS { prodUuid: $uuid }]->(role:Role)

	WITH production, theatre, playtext, castRel, person, roleRel, role
		ORDER BY roleRel.position

	WITH production, theatre, playtext, castRel, person,
		COLLECT(CASE WHEN role IS NULL THEN null ELSE
				{ name: role.name, characterName: role.characterName }
			END) AS roles
		ORDER BY castRel.position

	RETURN {
		model: 'production',
		uuid: production.uuid,
		name: production.name,
		theatre: { name: theatre.name },
		playtext: CASE WHEN playtext IS NULL THEN '' ELSE { name: playtext.name } END,
		cast: COLLECT(CASE WHEN person IS NULL THEN null ELSE { name: person.name, roles: roles } END)
	} AS instance
`;

const getUpdateQuery = () => getCreateUpdateQuery('update');

const getDeleteQuery = () => `
	MATCH (production:Production { uuid: $uuid })

	OPTIONAL MATCH (:Person)-[:PERFORMS_AS { prodUuid: $uuid }]->(role:Role)

	WITH production, COLLECT(role) AS roles
		FOREACH (role in roles | DETACH DELETE role)

	WITH production, production.name AS name
		DETACH DELETE production

	RETURN {
		model: 'production',
		name: name
	} AS instance
`;

const getShowQuery = () => `
	MATCH (production:Production { uuid: $uuid })-[:PLAYS_AT]->(theatre:Theatre)

	OPTIONAL MATCH (production)-[playtextRel:PRODUCTION_OF]->(playtext:Playtext)

	OPTIONAL MATCH (production)<-[castRel:PERFORMS_IN]-(person:Person)

	OPTIONAL MATCH (person)-[roleRel:PERFORMS_AS { prodUuid: $uuid }]->(role:Role)

	OPTIONAL MATCH (role)<-[roleRel]-(person)-[castRel]->(production)-[playtextRel]->
		(playtext)-[:INCLUDES_CHARACTER]->(character:Character)
		WHERE role.name = character.name OR role.characterName = character.name

	WITH production, theatre, playtext, castRel, person, roleRel, role, character
		ORDER BY roleRel.position

	WITH production, theatre, playtext, castRel, person,
		COLLECT(CASE WHEN role IS NULL THEN { name: 'Performer' } ELSE
				{ model: 'character', uuid: character.uuid, name: role.name }
			END) AS roles
		ORDER BY castRel.position

	RETURN {
		model: 'production',
		uuid: production.uuid,
		name: production.name,
		theatre: { model: 'theatre', uuid: theatre.uuid, name: theatre.name },
		playtext: CASE WHEN playtext IS NULL THEN null ELSE
			{ model: 'playtext', uuid: playtext.uuid, name: playtext.name } END,
		cast: COLLECT(CASE WHEN person IS NULL THEN null ELSE
				{ model: 'person', uuid: person.uuid, name: person.name, roles: roles }
			END)
	} AS instance
`;

export {
	getCreateQuery,
	getEditQuery,
	getUpdateQuery,
	getDeleteQuery,
	getShowQuery
};
