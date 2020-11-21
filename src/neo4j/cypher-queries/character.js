const getShowQuery = () => `
	MATCH (character:Character { uuid: $uuid })

	OPTIONAL MATCH (character)<-[playtextRel:INCLUDES_CHARACTER]-(playtext:Playtext)

	OPTIONAL MATCH (playtext)-[writerRel:WRITTEN_BY]->(writer:Person)

	WITH character, playtextRel, playtext, writerRel, writer
		ORDER BY writerRel.groupPosition, writerRel.writerPosition

	WITH character, playtextRel, playtext, writerRel.group AS writerGroup,
		COLLECT(
			CASE writer WHEN NULL
				THEN null
				ELSE { model: 'person', uuid: writer.uuid, name: writer.name }
			END
		) AS writers

	WITH character, playtextRel, playtext,
		COLLECT(
			CASE SIZE(writers) WHEN 0
				THEN null
				ELSE { model: 'writerGroup', name: COALESCE(writerGroup, 'by'), writers: writers }
			END
		) AS writerGroups
		ORDER BY playtextRel.groupPosition, playtextRel.characterPosition

	WITH
		character,
		playtext,
		writerGroups,
		COLLECT(
			CASE WHEN playtextRel.displayName IS NULL AND playtextRel.qualifier IS NULL AND playtextRel.group IS NULL
				THEN null
				ELSE {
					displayName: playtextRel.displayName,
					qualifier: playtextRel.qualifier,
					group: playtextRel.group
				}
			END
		) AS depictions
		ORDER BY playtext.name

	WITH character,
		COLLECT(
			CASE playtext WHEN NULL
				THEN null
				ELSE {
					model: 'playtext',
					uuid: playtext.uuid,
					name: playtext.name,
					writerGroups: writerGroups,
					depictions: depictions
				}
			END
		) AS playtexts

	OPTIONAL MATCH (character)<-[variantNamedDepiction:INCLUDES_CHARACTER]-(:Playtext)
		WHERE variantNamedDepiction.displayName IS NOT NULL

	WITH character, playtexts, variantNamedDepiction
		ORDER BY variantNamedDepiction.displayName

	WITH character, playtexts, COLLECT(DISTINCT(variantNamedDepiction.displayName)) AS variantNamedDepictions

	OPTIONAL MATCH (character)<-[depictionForVariantNamedPortrayal:INCLUDES_CHARACTER]-(:Playtext)
		<-[:PRODUCTION_OF]-(:Production)<-[variantNamedPortrayal:PERFORMS_IN]-(:Person)
		WHERE
			character.name <> variantNamedPortrayal.roleName AND
			(
				character.name = variantNamedPortrayal.characterName OR
				depictionForVariantNamedPortrayal.displayName = variantNamedPortrayal.characterName
			)

	WITH character, variantNamedDepictions, playtexts, variantNamedPortrayal
		ORDER BY variantNamedPortrayal.roleName

	WITH character, variantNamedDepictions, playtexts,
		COLLECT(DISTINCT(variantNamedPortrayal.roleName)) AS variantNamedPortrayals

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

	OPTIONAL MATCH (theatre)<-[:INCLUDES_SUB_THEATRE]-(surTheatre:Theatre)

	WITH
		character,
		variantNamedDepictions,
		playtexts,
		variantNamedPortrayals,
		production,
		theatre,
		surTheatre,
		person,
		role,
		otherRole,
		otherCharacter
		ORDER BY otherRole.rolePosition

	WITH
		character,
		variantNamedDepictions,
		playtexts,
		variantNamedPortrayals,
		production,
		theatre,
		surTheatre,
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
		variantNamedDepictions,
		playtexts,
		variantNamedPortrayals,
		production,
		theatre,
		surTheatre,
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
		variantNamedDepictions,
		playtexts,
		variantNamedPortrayals,
		COLLECT(
			CASE production WHEN NULL
				THEN null
				ELSE {
					model: 'production',
					uuid: production.uuid,
					name: production.name,
					theatre: CASE theatre WHEN NULL
						THEN null
						ELSE {
							model: 'theatre',
							uuid: theatre.uuid,
							name: theatre.name,
							surTheatre: CASE surTheatre WHEN NULL
								THEN null
								ELSE {
									model: 'theatre',
									uuid: surTheatre.uuid,
									name: surTheatre.name
								}
							END
						}
					END,
					performers: performers
				}
			END
		) AS productions
`;

export {
	getShowQuery
};
