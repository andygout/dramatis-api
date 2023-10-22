export default () => `
	MATCH (character:Character { uuid: $uuid })

	CALL {
		WITH character

		OPTIONAL MATCH (character)<-[depictionForVariantNamedPortrayal:DEPICTS]-(:Material)
			<-[:PRODUCTION_OF]-(:Production)-[variantNamedPortrayal:HAS_CAST_MEMBER]->(:Person)
			WHERE
				character.name <> variantNamedPortrayal.roleName AND
				(
					character.name = variantNamedPortrayal.characterName OR
					depictionForVariantNamedPortrayal.displayName = variantNamedPortrayal.characterName
				)

		WITH variantNamedPortrayal
			ORDER BY variantNamedPortrayal.roleName

		RETURN
			COLLECT(DISTINCT(variantNamedPortrayal.roleName)) AS variantNamedPortrayals
	}

	CALL {
		WITH character

		OPTIONAL MATCH (character)<-[characterDepiction:DEPICTS]-(materialForProduction:Material)
			<-[productionRel:PRODUCTION_OF]-(production:Production)-[role:HAS_CAST_MEMBER]->(person:Person)
			WHERE
				(
					character.name = COALESCE(role.characterName, role.roleName) OR
					characterDepiction.displayName = COALESCE(role.characterName, role.roleName)
				) AND
				(role.characterDifferentiator IS NULL OR role.characterDifferentiator = character.differentiator)

		OPTIONAL MATCH (production)-[otherRole:HAS_CAST_MEMBER]->(person)
			WHERE
				otherRole.roleName <> character.name AND
				(otherRole.characterName IS NULL OR otherRole.characterName <> character.name) AND
				(characterDepiction.displayName IS NULL OR characterDepiction.displayName <> otherRole.roleName) AND
				(
					(otherRole.characterName IS NULL OR characterDepiction.displayName IS NULL) OR
					otherRole.characterName <> characterDepiction.displayName
				)

		OPTIONAL MATCH (materialForProduction)-[otherCharacterDepiction:DEPICTS]->(otherCharacter:Character)
			WHERE
				(
					otherCharacter.name = COALESCE(otherRole.characterName, otherRole.roleName) OR
					otherCharacterDepiction.displayName = COALESCE(otherRole.characterName, otherRole.roleName)
				) AND
				(
					otherRole.characterDifferentiator IS NULL OR
					otherRole.characterDifferentiator = otherCharacter.differentiator
				)

		WITH production, person, role, otherRole, otherCharacter
			ORDER BY otherRole.rolePosition

		WITH production, person, role,
			COLLECT(DISTINCT(
				CASE WHEN otherRole IS NULL
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
			COLLECT(
				CASE WHEN production IS NULL
					THEN null
					ELSE production {
						model: 'PRODUCTION',
						.uuid,
						.name,
						.startDate,
						.endDate,
						venue: CASE WHEN venue IS NULL
							THEN null
							ELSE venue {
								model: 'VENUE',
								.uuid,
								.name,
								surVenue: CASE WHEN surVenue IS NULL
									THEN null
									ELSE surVenue { model: 'VENUE', .uuid, .name }
								END
							}
						END,
						surProduction: CASE WHEN surProduction IS NULL
							THEN null
							ELSE surProduction {
								model: 'PRODUCTION',
								.uuid,
								.name,
								surProduction: CASE WHEN surSurProduction IS NULL
									THEN null
									ELSE surSurProduction { model: 'PRODUCTION', .uuid, .name }
								END
							}
						END,
						performers
					}
				END
			) AS productions
	}

	RETURN
		variantNamedPortrayals,
		productions
`;
