const getShowQuery = () => `
	MATCH (character:Character { uuid: $uuid })

	OPTIONAL MATCH (character)<-[materialRel:HAS_CHARACTER]-(material:Material)

	OPTIONAL MATCH (material)-[entityRel:HAS_WRITING_ENTITY|USES_SOURCE_MATERIAL]->(entity)
		WHERE entity:Person OR entity:Company OR entity:Material

	OPTIONAL MATCH (entity:Material)-[sourceMaterialWriterRel:HAS_WRITING_ENTITY]->(sourceMaterialWriter)

	WITH
		character,
		materialRel,
		material,
		entityRel,
		entity,
		sourceMaterialWriterRel,
		sourceMaterialWriter
		ORDER BY sourceMaterialWriterRel.creditPosition, sourceMaterialWriterRel.entityPosition

	WITH
		character,
		materialRel,
		material,
		entityRel,
		entity,
		sourceMaterialWriterRel.credit AS sourceMaterialWritingCreditName,
		COLLECT(
			CASE sourceMaterialWriter WHEN NULL
				THEN null
				ELSE sourceMaterialWriter { model: TOLOWER(HEAD(LABELS(sourceMaterialWriter))), .uuid, .name }
			END
		) AS sourceMaterialWriters

	WITH character, materialRel, material, entityRel, entity,
		COLLECT(
			CASE SIZE(sourceMaterialWriters) WHEN 0
				THEN null
				ELSE {
					model: 'writingCredit',
					name: COALESCE(sourceMaterialWritingCreditName, 'by'),
					entities: sourceMaterialWriters
				}
			END
		) AS sourceMaterialWritingCredits
		ORDER BY entityRel.creditPosition, entityRel.entityPosition

	WITH character, materialRel, material, entityRel.credit AS writingCreditName,
		[entity IN COLLECT(
			CASE entity WHEN NULL
				THEN null
				ELSE entity {
					model: TOLOWER(HEAD(LABELS(entity))),
					.uuid,
					.name,
					.format,
					writingCredits: sourceMaterialWritingCredits
				}
			END
		) | CASE entity.model WHEN 'material'
			THEN entity
			ELSE entity { .model, .uuid, .name }
		END] AS entities

	WITH character, materialRel, material,
		COLLECT(
			CASE SIZE(entities) WHEN 0
				THEN null
				ELSE {
					model: 'writingCredit',
					name: COALESCE(writingCreditName, 'by'),
					entities: entities
				}
			END
		) AS writingCredits
		ORDER BY materialRel.groupPosition, materialRel.characterPosition

	WITH character, material, writingCredits,
		COLLECT(
			CASE WHEN ALL(x IN ['displayName', 'qualifier', 'group'] WHERE materialRel[x] IS NULL)
				THEN null
				ELSE materialRel { .displayName, .qualifier, .group }
			END
		) AS depictions
		ORDER BY material.name

	WITH character,
		COLLECT(
			CASE material WHEN NULL
				THEN null
				ELSE material {
					model: 'material',
					.uuid,
					.name,
					.format,
					writingCredits: writingCredits,
					depictions: depictions
				}
			END
		) AS materials

	OPTIONAL MATCH (character)<-[variantNamedDepiction:HAS_CHARACTER]-(:Material)
		WHERE EXISTS(variantNamedDepiction.displayName)

	WITH character, materials, variantNamedDepiction
		ORDER BY variantNamedDepiction.displayName

	WITH character, materials, COLLECT(DISTINCT(variantNamedDepiction.displayName)) AS variantNamedDepictions

	OPTIONAL MATCH (character)<-[depictionForVariantNamedPortrayal:HAS_CHARACTER]-(:Material)
		<-[:PRODUCTION_OF]-(:Production)-[variantNamedPortrayal:HAS_CAST_MEMBER]->(:Person)
		WHERE
			character.name <> variantNamedPortrayal.roleName AND
			(
				character.name = variantNamedPortrayal.characterName OR
				depictionForVariantNamedPortrayal.displayName = variantNamedPortrayal.characterName
			)

	WITH character, variantNamedDepictions, materials, variantNamedPortrayal
		ORDER BY variantNamedPortrayal.roleName

	WITH character, variantNamedDepictions, materials,
		COLLECT(DISTINCT(variantNamedPortrayal.roleName)) AS variantNamedPortrayals

	OPTIONAL MATCH (character)<-[characterDepiction:HAS_CHARACTER]-(materialForProduction:Material)
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

	OPTIONAL MATCH (person)<-[otherRole]-(production)-[productionRel]->
		(materialForProduction)-[otherCharacterDepiction:HAS_CHARACTER]->(otherCharacter:Character)
		WHERE
			(
				otherCharacter.name IN [otherRole.roleName, otherRole.characterName] OR
				otherCharacterDepiction.displayName IN [otherRole.roleName, otherRole.characterName]
			) AND
			(
				otherRole.characterDifferentiator IS NULL OR
				otherCharacter.differentiator = otherRole.characterDifferentiator
			)

	OPTIONAL MATCH (production)-[:PLAYS_AT]->(theatre:Theatre)

	OPTIONAL MATCH (theatre)<-[:HAS_SUB_THEATRE]-(surTheatre:Theatre)

	WITH
		character,
		variantNamedDepictions,
		materials,
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
		materials,
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

	WITH character, variantNamedDepictions, materials, variantNamedPortrayals, production, theatre, surTheatre,
		COLLECT(person {
			model: 'person',
			.uuid,
			.name,
			roleName: role.roleName,
			qualifier: role.qualifier,
			otherRoles: otherRoles
		}) AS performers
		ORDER BY production.startDate DESC, production.name, theatre.name

	RETURN
		'character' AS model,
		character.uuid AS uuid,
		character.name AS name,
		character.differentiator AS differentiator,
		variantNamedDepictions,
		materials,
		variantNamedPortrayals,
		COLLECT(
			CASE production WHEN NULL
				THEN null
				ELSE production {
					model: 'production',
					.uuid,
					.name,
					.startDate,
					.endDate,
					theatre: CASE theatre WHEN NULL
						THEN null
						ELSE theatre {
							model: 'theatre',
							.uuid,
							.name,
							surTheatre: CASE surTheatre WHEN NULL
								THEN null
								ELSE surTheatre { model: 'theatre', .uuid, .name }
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
