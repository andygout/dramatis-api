const getShowQuery = () => `
	MATCH (character:Character { uuid: $uuid })

	OPTIONAL MATCH (character)<-[:INCLUDES_CHARACTER]-(playtext:Playtext)

	WITH character, playtext
		ORDER BY playtext.name

	OPTIONAL MATCH (character)<-[:INCLUDES_CHARACTER]-(:Playtext)<-[:PRODUCTION_OF]-
		(production:Production)<-[:PERFORMS_IN]-(:Person)-
		[:PERFORMS_AS { prodUuid: production.uuid }]->(variantNamedRole:Role)
		WHERE character.name <> variantNamedRole.name AND character.name = variantNamedRole.characterName

	WITH character, variantNamedRole,
		COLLECT(CASE WHEN playtext IS NULL THEN null ELSE
				{ model: 'playtext', uuid: playtext.uuid, name: playtext.name }
			END) AS playtexts
		ORDER BY variantNamedRole.name

	OPTIONAL MATCH (character)<-[:INCLUDES_CHARACTER]-(playtext:Playtext)<-[prodRel:PRODUCTION_OF]-
		(production:Production)<-[castRel:PERFORMS_IN]-(person:Person)-
		[roleRel:PERFORMS_AS { prodUuid: production.uuid }]->(role:Role)
		WHERE character.name = role.name OR character.name = role.characterName

	OPTIONAL MATCH (person)-[otherRoleRel:PERFORMS_AS { prodUuid: production.uuid }]->(otherRole:Role)
		WHERE otherRole.name <> character.name
		AND (NOT EXISTS(otherRole.characterName) OR otherRole.characterName <> character.name)

	OPTIONAL MATCH (otherRole)<-[otherRoleRel]-(person)-[castRel]->(production)-[prodRel]->(playtext)-
		[:INCLUDES_CHARACTER]->(otherCharacter:Character)
		WHERE otherRole.name = otherCharacter.name OR otherRole.characterName = otherCharacter.name

	OPTIONAL MATCH (production)-[:PLAYS_AT]->(theatre:Theatre)

	WITH character, playtexts, production, theatre, castRel, person, role, otherRole, otherRoleRel, otherCharacter,
		COLLECT(DISTINCT(variantNamedRole.name)) AS variantNames
		ORDER BY otherRoleRel.position

	WITH character, playtexts, variantNames, production, theatre, castRel, person, role,
		COLLECT(CASE WHEN otherRole IS NULL THEN null ELSE
				{ model: 'character', uuid: otherCharacter.uuid, name: otherRole.name }
			END) AS otherRoles
		ORDER BY castRel.position

	WITH character, playtexts, variantNames, production, theatre,
		COLLECT({
			model: 'person',
			uuid: person.uuid,
			name: person.name,
			role: { name: role.name },
			otherRoles: otherRoles
		}) AS performers
		ORDER BY production.name, theatre.name

	RETURN {
		model: 'character',
		uuid: character.uuid,
		name: character.name,
		playtexts: playtexts,
		variantNames: variantNames,
		productions: COLLECT(CASE WHEN production IS NULL THEN null ELSE
			{
				model: 'production',
				uuid: production.uuid,
				name: production.name,
				theatre: { model: 'theatre', uuid: theatre.uuid, name: theatre.name },
				performers: performers
			} END)
	} AS instance
`;

export {
	getShowQuery
};
