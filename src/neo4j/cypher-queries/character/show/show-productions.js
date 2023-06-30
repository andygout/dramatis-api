export default () => `
	MATCH (character:Character { uuid: $uuid })

	OPTIONAL MATCH (character)<-[depictionForVariantNamedPortrayal:DEPICTS]-(:Material)
		<-[:PRODUCTION_OF]-(:Production)-[variantNamedPortrayal:HAS_CAST_MEMBER]->(:Person)
		WHERE
			character.name <> variantNamedPortrayal.roleName AND
			(
				character.name = variantNamedPortrayal.characterName OR
				depictionForVariantNamedPortrayal.displayName = variantNamedPortrayal.characterName
			)

	WITH character, variantNamedPortrayal
		ORDER BY variantNamedPortrayal.roleName

	WITH character,
		COLLECT(DISTINCT(variantNamedPortrayal.roleName)) AS variantNamedPortrayals

	OPTIONAL MATCH (character)<-[characterDepiction:DEPICTS]-(materialForProduction:Material)
		<-[productionRel:PRODUCTION_OF]-(production:Production)-[role:HAS_CAST_MEMBER]->(person:Person)
		WHERE
			(
				character.name IN [role.roleName, role.characterName] OR
				characterDepiction.displayName IN [role.roleName, role.characterName]
			) AND
			(role.characterDifferentiator IS NULL OR character.differentiator = role.characterDifferentiator)

	OPTIONAL MATCH (production)-[otherRole:HAS_CAST_MEMBER]->(person)
		WHERE
			otherRole.roleName <> character.name AND
			(otherRole.characterName IS NULL OR otherRole.characterName <> character.name) AND
			(characterDepiction.displayName IS NULL OR otherRole.roleName <> characterDepiction.displayName) AND
			(
				(otherRole.characterName IS NULL OR characterDepiction.displayName IS NULL) OR
				otherRole.characterName <> characterDepiction.displayName
			)

	OPTIONAL MATCH (materialForProduction)-[otherCharacterDepiction:DEPICTS]->(otherCharacter:Character)
		WHERE
			(
				otherCharacter.name IN [otherRole.roleName, otherRole.characterName] OR
				otherCharacterDepiction.displayName IN [otherRole.roleName, otherRole.characterName]
			) AND
			(
				otherRole.characterDifferentiator IS NULL OR
				otherCharacter.differentiator = otherRole.characterDifferentiator
			)

	WITH variantNamedPortrayals, production, person, role, otherRole, otherCharacter
		ORDER BY otherRole.rolePosition

	WITH variantNamedPortrayals, production, person, role,
		COLLECT(DISTINCT(
			CASE otherRole WHEN NULL
				THEN null
				ELSE {
					model: 'CHARACTER',
					uuid: otherCharacter.uuid,
					name: otherRole.roleName,
					qualifier: otherRole.qualifier,
					isAlternate: COALESCE(otherRole.isAlternate, false)
				}
			END
		)) AS otherRoles
		ORDER BY role.castMemberPosition

	OPTIONAL MATCH (production)-[:PLAYS_AT]->(venue:Venue)

	OPTIONAL MATCH (venue)<-[:HAS_SUB_VENUE]-(surVenue:Venue)

	OPTIONAL MATCH (production)<-[surProductionRel:HAS_SUB_PRODUCTION]-(surProduction:Production)

	OPTIONAL MATCH (surProduction)<-[surSurProductionRel:HAS_SUB_PRODUCTION]-(surSurProduction:Production)

	WITH
		variantNamedPortrayals,
		production,
		venue,
		surVenue,
		surProduction,
		surProductionRel,
		surSurProduction,
		surSurProductionRel,
		COLLECT(person {
			model: 'PERSON',
			.uuid,
			.name,
			roleName: role.roleName,
			qualifier: role.qualifier,
			isAlternate: COALESCE(role.isAlternate, false),
			otherRoles
		}) AS performers
		ORDER BY
			production.startDate DESC,
			COALESCE(surSurProduction.name, surProduction.name, production.name),
			COALESCE(surSurProductionRel.position, surProductionRel.position, -1) DESC,
			COALESCE(surSurProductionRel.position, -1) DESC,
			COALESCE(surProductionRel.position, -1) DESC,
			venue.name

	RETURN
		variantNamedPortrayals,
		COLLECT(
			CASE production WHEN NULL
				THEN null
				ELSE production {
					model: 'PRODUCTION',
					.uuid,
					.name,
					.startDate,
					.endDate,
					venue: CASE venue WHEN NULL
						THEN null
						ELSE venue {
							model: 'VENUE',
							.uuid,
							.name,
							surVenue: CASE surVenue WHEN NULL
								THEN null
								ELSE surVenue { model: 'VENUE', .uuid, .name }
							END
						}
					END,
					surProduction: CASE surProduction WHEN NULL
						THEN null
						ELSE surProduction {
							model: 'PRODUCTION',
							.uuid,
							.name,
							surProduction: CASE surSurProduction WHEN NULL
								THEN null
								ELSE surSurProduction { model: 'PRODUCTION', .uuid, .name }
							END
						}
					END,
					performers
				}
			END
		) AS productions
`;
