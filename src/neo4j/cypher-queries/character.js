const getShowQuery = () => `
	MATCH (character:Character { uuid: $uuid })

	OPTIONAL MATCH (character)<-[playtextRel:INCLUDES_CHARACTER]-(playtext:Playtext)

	WITH character, playtextRel, playtext
		ORDER BY playtext.name, playtextRel.position

	WITH character, playtext, COLLECT(playtextRel.qualifier) AS qualifiers, COLLECT(playtextRel.group) AS groups

	OPTIONAL MATCH (playtext)<-[:PRODUCTION_OF]-(:Production)<-[variantNamedRole:PERFORMS_IN]-(:Person)
		WHERE character.name <> variantNamedRole.roleName AND character.name = variantNamedRole.characterName

	OPTIONAL MATCH (playtext)<-[productionRel:PRODUCTION_OF]-(production:Production)<-[role:PERFORMS_IN]-(person:Person)
		WHERE
			(character.name = role.roleName OR character.name = role.characterName) AND
			(role.characterDifferentiator IS NULL OR character.differentiator = role.characterDifferentiator)

	OPTIONAL MATCH (production)<-[otherRole:PERFORMS_IN]-(person)
		WHERE otherRole.roleName <> character.name
		AND (NOT EXISTS(otherRole.characterName) OR otherRole.characterName <> character.name)

	OPTIONAL MATCH (person)-[otherRole]->(production)-[productionRel]->
		(playtext)-[:INCLUDES_CHARACTER]->(otherCharacter:Character)
		WHERE
			(otherCharacter.name = otherRole.roleName OR otherCharacter.name = otherRole.characterName) AND
			(otherRole.characterDifferentiator IS NULL OR otherCharacter.differentiator = otherRole.characterDifferentiator)

	OPTIONAL MATCH (production)-[:PLAYS_AT]->(theatre:Theatre)

	WITH character, playtext, qualifiers, groups, production, theatre, person, role, otherRole, otherCharacter, variantNamedRole
		ORDER BY otherRole.rolePosition

	WITH character, playtext, qualifiers, groups, variantNamedRole, production, theatre, person, role,
		COLLECT(DISTINCT(
			CASE otherRole WHEN NULL
				THEN null
				ELSE {
					model: 'character',
					uuid: otherCharacter.uuid,
					name: otherRole.roleName,
					qualifier: otherRole.qualifier
				}
			END
		)) AS otherRoles
		ORDER BY role.castMemberPosition

	WITH character, playtext, qualifiers, groups, variantNamedRole, production, theatre,
		COLLECT({
			model: 'person',
			uuid: person.uuid,
			name: person.name,
			roleName: role.roleName,
			qualifier: role.qualifier,
			otherRoles: otherRoles
		}) AS performers
		ORDER BY production.name, theatre.name

	RETURN
		'character' AS model,
		character.uuid AS uuid,
		character.name AS name,
		character.differentiator AS differentiator,
		COLLECT(DISTINCT(
			CASE playtext WHEN NULL
				THEN null
				ELSE {
					model: 'playtext',
					uuid: playtext.uuid,
					name: playtext.name,
					qualifiers: qualifiers,
					groups: groups
				}
			END
		)) AS playtexts,
		COLLECT(DISTINCT(variantNamedRole.roleName)) AS variantNames,
		COLLECT(DISTINCT(
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
					performers: performers
				}
			END
		)) AS productions
`;

export {
	getShowQuery
};
