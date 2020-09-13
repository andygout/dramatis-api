const getShowQuery = () => `
	MATCH (person:Person { uuid: $uuid })

	OPTIONAL MATCH (person)-[role:PERFORMS_IN]->(production:Production)

	OPTIONAL MATCH (production)-[:PLAYS_AT]->(theatre:Theatre)

	OPTIONAL MATCH (production)-[:PRODUCTION_OF]->(:Playtext)-[characterRel:INCLUDES_CHARACTER]->(character:Character)
		WHERE role.roleName = character.name OR role.characterName = character.name

	WITH DISTINCT person, production, theatre, role, character
		ORDER BY role.rolePosition

	WITH person, production, theatre,
		COLLECT(
			CASE role.roleName WHEN NULL
				THEN { name: 'Performer' }
				ELSE { model: 'character', uuid: character.uuid, name: role.roleName, qualifier: role.qualifier }
			END
		) AS roles
		ORDER BY production.name, theatre.name

	RETURN
		'person' AS model,
		person.uuid AS uuid,
		person.name AS name,
		person.differentiator AS differentiator,
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
						END,
					roles: roles
				}
			END
		) AS productions
`;

export {
	getShowQuery
};
