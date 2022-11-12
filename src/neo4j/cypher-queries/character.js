const getShowQuery = () => `
	MATCH (character:Character { uuid: $uuid })

	OPTIONAL MATCH (character)<-[materialRel:DEPICTS]-(material:Material)

	OPTIONAL MATCH (material)-[entityRel:HAS_WRITING_ENTITY|USES_SOURCE_MATERIAL]->(entity)
		WHERE entity:Person OR entity:Company OR entity:Material

	OPTIONAL MATCH (entity:Material)-[sourceMaterialWriterRel:HAS_WRITING_ENTITY]->(sourceMaterialWriter)
		WHERE sourceMaterialWriter:Person OR sourceMaterialWriter:Company

	OPTIONAL MATCH (entity:Material)<-[:HAS_SUB_MATERIAL]-(entitySurMaterial:Material)

	WITH
		character,
		materialRel,
		material,
		entityRel,
		entity,
		entitySurMaterial,
		sourceMaterialWriterRel,
		sourceMaterialWriter
		ORDER BY sourceMaterialWriterRel.creditPosition, sourceMaterialWriterRel.entityPosition

	WITH
		character,
		materialRel,
		material,
		entityRel,
		entity,
		entitySurMaterial,
		sourceMaterialWriterRel.credit AS sourceMaterialWritingCreditName,
		COLLECT(
			CASE sourceMaterialWriter WHEN NULL
				THEN null
				ELSE sourceMaterialWriter { model: TOUPPER(HEAD(LABELS(sourceMaterialWriter))), .uuid, .name }
			END
		) AS sourceMaterialWriters

	WITH character, materialRel, material, entityRel, entity, entitySurMaterial,
		COLLECT(
			CASE SIZE(sourceMaterialWriters) WHEN 0
				THEN null
				ELSE {
					model: 'WRITING_CREDIT',
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
					model: TOUPPER(HEAD(LABELS(entity))),
					.uuid,
					.name,
					.format,
					.year,
					surMaterial: CASE entitySurMaterial WHEN NULL
						THEN null
						ELSE entitySurMaterial { model: 'MATERIAL', .uuid, .name }
					END,
					writingCredits: sourceMaterialWritingCredits
				}
			END
		) | CASE entity.model WHEN 'MATERIAL'
			THEN entity
			ELSE entity { .model, .uuid, .name }
		END] AS entities

	WITH character, materialRel, material,
		COLLECT(
			CASE SIZE(entities) WHEN 0
				THEN null
				ELSE {
					model: 'WRITING_CREDIT',
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
		ORDER BY material.year DESC, material.name

	OPTIONAL MATCH (material)<-[:HAS_SUB_MATERIAL]-(surMaterial:Material)

	WITH character,
		COLLECT(
			CASE material WHEN NULL
				THEN null
				ELSE material {
					model: 'MATERIAL',
					.uuid,
					.name,
					.format,
					.year,
					surMaterial: CASE surMaterial WHEN NULL
						THEN null
						ELSE surMaterial { model: 'MATERIAL', .uuid, .name }
					END,
					writingCredits,
					depictions
				}
			END
		) AS materials

	OPTIONAL MATCH (character)<-[variantNamedDepiction:DEPICTS]-(:Material)
		WHERE EXISTS(variantNamedDepiction.displayName)

	WITH character, materials, variantNamedDepiction
		ORDER BY variantNamedDepiction.displayName

	WITH character, materials, COLLECT(DISTINCT(variantNamedDepiction.displayName)) AS variantNamedDepictions

	OPTIONAL MATCH (character)<-[depictionForVariantNamedPortrayal:DEPICTS]-(:Material)
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

	OPTIONAL MATCH (person)<-[otherRole]-(production)-[productionRel]->
		(materialForProduction)-[otherCharacterDepiction:DEPICTS]->(otherCharacter:Character)
		WHERE
			(
				otherCharacter.name IN [otherRole.roleName, otherRole.characterName] OR
				otherCharacterDepiction.displayName IN [otherRole.roleName, otherRole.characterName]
			) AND
			(
				otherRole.characterDifferentiator IS NULL OR
				otherCharacter.differentiator = otherRole.characterDifferentiator
			)

	OPTIONAL MATCH (production)-[:PLAYS_AT]->(venue:Venue)

	OPTIONAL MATCH (venue)<-[:HAS_SUB_VENUE]-(surVenue:Venue)

	WITH
		character,
		variantNamedDepictions,
		materials,
		variantNamedPortrayals,
		production,
		venue,
		surVenue,
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
		venue,
		surVenue,
		person,
		role,
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

	WITH character, variantNamedDepictions, materials, variantNamedPortrayals, production, venue, surVenue,
		COLLECT(person {
			model: 'PERSON',
			.uuid,
			.name,
			roleName: role.roleName,
			qualifier: role.qualifier,
			isAlternate: COALESCE(role.isAlternate, false),
			otherRoles
		}) AS performers
		ORDER BY production.startDate DESC, production.name, venue.name

	RETURN
		'CHARACTER' AS model,
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
					performers
				}
			END
		) AS productions
`;

export {
	getShowQuery
};
