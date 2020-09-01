const getShowQuery = () => `
	MATCH (character:Character { uuid: $uuid })

	OPTIONAL MATCH (character)<-[:INCLUDES_CHARACTER]-(playtext:Playtext)

	WITH character, playtext
		ORDER BY playtext.name

	OPTIONAL MATCH (playtext)<-[:PRODUCTION_OF]-(:Production)<-[variantNamedRole:PERFORMS_IN]-(:Person)
		WHERE character.name <> variantNamedRole.roleName AND character.name = variantNamedRole.characterName

	WITH character, variantNamedRole,
		COLLECT(
			CASE WHEN playtext IS NULL
				THEN null
				ELSE { model: 'playtext', uuid: playtext.uuid, name: playtext.name }
			END
		) AS playtexts
		ORDER BY variantNamedRole.roleName

	OPTIONAL MATCH (playtext)<-[productionRel:PRODUCTION_OF]-(production:Production)<-[role:PERFORMS_IN]-(person:Person)
		WHERE character.name = role.roleName OR character.name = role.characterName

	OPTIONAL MATCH (production)<-[otherRole:PERFORMS_IN]-(person)
		WHERE otherRole.roleName <> character.name
		AND (NOT EXISTS(otherRole.characterName) OR otherRole.characterName <> character.name)

	OPTIONAL MATCH (person)-[otherRole]->(production)-[productionRel]->
		(playtext)-[:INCLUDES_CHARACTER]->(otherCharacter:Character)
		WHERE otherRole.roleName = otherCharacter.name OR otherRole.characterName = otherCharacter.name

	OPTIONAL MATCH (production)-[:PLAYS_AT]->(theatre:Theatre)

	WITH character, playtexts, production, theatre, person, role, otherRole, otherCharacter,
		COLLECT(DISTINCT(variantNamedRole.roleName)) AS variantNames
		ORDER BY otherRole.rolePosition

	WITH character, playtexts, variantNames, production, theatre, person, role,
		COLLECT(
			CASE WHEN otherRole IS NULL
				THEN null
				ELSE { model: 'character', uuid: otherCharacter.uuid, name: otherRole.roleName }
			END
		) AS otherRoles
		ORDER BY role.castMemberPosition

	WITH character, playtexts, variantNames, production, theatre,
		COLLECT({
			model: 'person',
			uuid: person.uuid,
			name: person.name,
			roleName: role.roleName,
			otherRoles: otherRoles
		}) AS performers
		ORDER BY production.name, theatre.name

	RETURN
		'character' AS model,
		character.uuid AS uuid,
		character.name AS name,
		character.differentiator AS differentiator,
		playtexts,
		variantNames,
		COLLECT(
			CASE WHEN production IS NULL
				THEN null
				ELSE {
					model: 'production',
					uuid: production.uuid,
					name: production.name,
					theatre:
						CASE WHEN theatre IS NULL
							THEN null
							ELSE { model: 'theatre', uuid: theatre.uuid, name: theatre.name }
						END,
					performers: performers
				}
			END
		) AS productions
`;

export {
	getShowQuery
};
