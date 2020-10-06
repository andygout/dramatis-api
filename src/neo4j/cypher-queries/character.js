const getShowQuery = () => `
	MATCH (character:Character { uuid: $uuid })

	OPTIONAL MATCH (character)<-[playtextRel:INCLUDES_CHARACTER]-(playtext:Playtext)

	WITH character, playtextRel, playtext
		ORDER BY playtext.name, playtextRel.position

	WITH
		character,
		playtext,
		COLLECT({
			displayName: playtextRel.displayName,
			qualifier: playtextRel.qualifier,
			group: playtextRel.group
		}) AS depictions

	OPTIONAL MATCH (character)<-[variantNamedDepiction:INCLUDES_CHARACTER]-(:Playtext)
		WHERE variantNamedDepiction.displayName IS NOT NULL

	OPTIONAL MATCH (character)<-[depictionForVariantNamedPortrayal:INCLUDES_CHARACTER]-(:Playtext)
		<-[:PRODUCTION_OF]-(:Production)<-[variantNamedPortrayal:PERFORMS_IN]-(:Person)
		WHERE
			character.name <> variantNamedPortrayal.roleName AND
			(
				character.name = variantNamedPortrayal.characterName OR
				depictionForVariantNamedPortrayal.displayName = variantNamedPortrayal.roleName OR
				depictionForVariantNamedPortrayal.displayName = variantNamedPortrayal.characterName
			)

	OPTIONAL MATCH (character)<-[characterDepiction:INCLUDES_CHARACTER]-(playtextForProduction:Playtext)
		<-[productionRel:PRODUCTION_OF]-(production:Production)<-[role:PERFORMS_IN]-(person:Person)
		WHERE
			(
				character.name IN [role.roleName, role.characterName] OR
				characterDepiction.displayName IN [role.roleName, role.characterName]
			) AND
			(role.characterDifferentiator IS NULL OR character.differentiator = role.characterDifferentiator)

	OPTIONAL MATCH (production)<-[otherRole:PERFORMS_IN]-(person)
		WHERE
			otherRole.roleName <> character.name AND
			(otherRole.characterName IS NULL OR otherRole.characterName <> character.name) AND
			(characterDepiction.displayName IS NULL OR otherRole.roleName <> characterDepiction.displayName) AND
			((otherRole.characterName IS NULL OR characterDepiction.displayName IS NULL) OR otherRole.characterName <> characterDepiction.displayName)

	OPTIONAL MATCH (person)-[otherRole]->(production)-[productionRel]->
		(playtextForProduction)-[otherCharacterDepiction:INCLUDES_CHARACTER]->(otherCharacter:Character)
		WHERE
			(
				otherCharacter.name IN [otherRole.roleName, otherRole.characterName] OR
				otherCharacterDepiction.displayName IN [otherRole.roleName, otherRole.characterName]
			) AND
			(otherRole.characterDifferentiator IS NULL OR otherCharacter.differentiator = otherRole.characterDifferentiator)

	OPTIONAL MATCH (production)-[:PLAYS_AT]->(theatre:Theatre)

	WITH
		character,
		playtext,
		depictions,
		variantNamedDepiction,
		production,
		theatre,
		person,
		role,
		otherRole,
		otherCharacter,
		variantNamedPortrayal
		ORDER BY otherRole.rolePosition

	WITH
		character,
		playtext,
		depictions,
		variantNamedDepiction,
		variantNamedPortrayal,
		production,
		theatre,
		person,
		role,
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

	WITH
		character,
		playtext,
		depictions,
		variantNamedDepiction,
		variantNamedPortrayal,
		production,
		theatre,
		COLLECT({
			model: 'person',
			uuid: person.uuid,
			name: person.name,
			roleName: role.roleName,
			qualifier: role.qualifier,
			otherRoles: otherRoles
		}) AS performers
		ORDER BY production.name, theatre.name

	WITH character, playtext, depictions, variantNamedDepiction, variantNamedPortrayal,
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
					performers: performers
				}
			END
		) AS productions
		ORDER BY variantNamedPortrayal.roleName

	WITH character, playtext, depictions, variantNamedDepiction, productions,
		COLLECT(DISTINCT(variantNamedPortrayal.roleName)) AS variantNamedPortrayals
		ORDER BY variantNamedDepiction.displayName

	WITH character, playtext, depictions, variantNamedPortrayals, productions,
		COLLECT(DISTINCT(variantNamedDepiction.displayName)) AS variantNamedDepictions
		ORDER BY playtext.name

	RETURN
		'character' AS model,
		character.uuid AS uuid,
		character.name AS name,
		character.differentiator AS differentiator,
		variantNamedDepictions,
		COLLECT(
			CASE playtext WHEN NULL
				THEN null
				ELSE {
					model: 'playtext',
					uuid: playtext.uuid,
					name: playtext.name,
					depictions: depictions
				}
			END
		) AS playtexts,
		variantNamedPortrayals,
		productions
`;

export {
	getShowQuery
};
