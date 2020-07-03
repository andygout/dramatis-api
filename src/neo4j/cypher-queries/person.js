const getShowQuery = () => `
	MATCH (person:Person { uuid: $uuid })

	OPTIONAL MATCH (person)-[role:PERFORMS_IN]->(production:Production)-[:PLAYS_AT]->(theatre:Theatre)

	OPTIONAL MATCH (production)-[:PRODUCTION_OF]->(:Playtext)-[:INCLUDES_CHARACTER]->(character:Character)
		WHERE role.roleName = character.name OR role.characterName = character.name

	WITH person, production, theatre, role, character
		ORDER BY role.rolePosition

	WITH person, production, theatre,
		COLLECT(
			CASE WHEN role.roleName IS NULL
				THEN { name: 'Performer' }
				ELSE { model: 'character', uuid: character.uuid, name: role.roleName }
			END
		) AS roles
		ORDER BY production.name, theatre.name

	RETURN
		'person' AS model,
		person.uuid AS uuid,
		person.name AS name,
		COLLECT(
			CASE WHEN production IS NULL
				THEN null
				ELSE {
					model: 'production',
					uuid: production.uuid,
					name: production.name,
					theatre: { model: 'theatre', uuid: theatre.uuid, name: theatre.name },
					roles: roles
				}
			END
		) AS productions
`;

export {
	getShowQuery
};
