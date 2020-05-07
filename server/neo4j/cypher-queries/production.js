const getCreateUpdateQuery = action => {

	const createUpdateQueryOpeningMap = {
		create: 'CREATE (production:Production { uuid: $uuid, name: $name })',
		update: `
			MATCH (production:Production { uuid: $uuid })

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

			FOREACH (role in CASE WHEN size(castMember.roles) > 0 THEN castMember.roles ELSE [{}] END |
				CREATE (production)
					<-[:PERFORMS_IN {
						castMemberPosition: castMember.position,
						rolePosition: role.position,
						roleName: role.name,
						characterName: role.characterName
					}]-(person)
			)
		)

		WITH production

		${getEditQuery()}
	`;

};

const getCreateQuery = () => getCreateUpdateQuery('create');

const getEditQuery = () => `
	MATCH (production:Production { uuid: $uuid })-[:PLAYS_AT]->(theatre:Theatre)

	OPTIONAL MATCH (production)-[:PRODUCTION_OF]->(playtext:Playtext)

	OPTIONAL MATCH (production)<-[castRel:PERFORMS_IN]-(person:Person)

	WITH production, theatre, playtext, castRel, person
		ORDER BY castRel.castMemberPosition, castRel.rolePosition

	WITH production, theatre, playtext, person,
		COLLECT(CASE WHEN castRel.roleName IS NULL
			THEN null
			ELSE {
				name: castRel.roleName,
				characterName: CASE WHEN castRel.characterName IS NULL THEN '' ELSE castRel.characterName END
			}
		END) + [{ name: '', characterName: '' }] AS roles

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
`;

const getUpdateQuery = () => getCreateUpdateQuery('update');

const getDeleteQuery = () => `
	MATCH (production:Production { uuid: $uuid })

	WITH production, production.name AS name
		DETACH DELETE production

	RETURN
		'production' AS model,
		name
`;

const getShowQuery = () => `
	MATCH (production:Production { uuid: $uuid })-[:PLAYS_AT]->(theatre:Theatre)

	OPTIONAL MATCH (production)-[playtextRel:PRODUCTION_OF]->(playtext:Playtext)

	OPTIONAL MATCH (production)<-[castRel:PERFORMS_IN]-(person:Person)

	OPTIONAL MATCH (person)-[castRel]->(production)-[playtextRel]->
		(playtext)-[:INCLUDES_CHARACTER]->(character:Character)
		WHERE castRel.roleName = character.name OR castRel.characterName = character.name

	WITH production, theatre, playtext, person, castRel, character
		ORDER BY castRel.castMemberPosition, castRel.rolePosition

	WITH production, theatre, playtext, person,
		COLLECT(CASE WHEN castRel.roleName IS NULL THEN { name: 'Performer' } ELSE
				{ model: 'character', uuid: character.uuid, name: castRel.roleName }
			END) AS roles

	RETURN
		'production' AS model,
		production.uuid AS uuid,
		production.name AS name,
		{ model: 'theatre', uuid: theatre.uuid, name: theatre.name } AS theatre,
		CASE WHEN playtext IS NULL THEN null ELSE
				{ model: 'playtext', uuid: playtext.uuid, name: playtext.name }
			END AS playtext,
		COLLECT(CASE WHEN person IS NULL THEN null ELSE
				{ model: 'person', uuid: person.uuid, name: person.name, roles: roles }
			END) AS cast
`;

export {
	getCreateQuery,
	getEditQuery,
	getUpdateQuery,
	getDeleteQuery,
	getShowQuery
};
