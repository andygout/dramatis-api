const getShowQuery = () => `
	MATCH (character:Character { uuid: $uuid })

	OPTIONAL MATCH (character)<-[materialRel:INCLUDES_CHARACTER]-(material:Material)

	OPTIONAL MATCH (material)-[writerRel:WRITTEN_BY|USES_SOURCE_MATERIAL]->(writer)
		WHERE writer:Person OR writer:Material

	OPTIONAL MATCH (writer:Material)-[sourceMaterialWriterRel:WRITTEN_BY]->(sourceMaterialWriter)

	WITH character, materialRel, material, writerRel, writer, sourceMaterialWriterRel, sourceMaterialWriter
		ORDER BY sourceMaterialWriterRel.groupPosition, sourceMaterialWriter.writerPosition

	WITH
		character,
		materialRel,
		material,
		writerRel,
		writer,
		sourceMaterialWriterRel.group AS sourceMaterialWriterGroupName,
		COLLECT(
			CASE sourceMaterialWriter WHEN NULL
				THEN null
				ELSE { model: 'person', uuid: sourceMaterialWriter.uuid, name: sourceMaterialWriter.name }
			END
		) AS sourceMaterialWriters



	WITH character, materialRel, material, writerRel, writer,
		COLLECT(
			CASE SIZE(sourceMaterialWriters) WHEN 0
				THEN null
				ELSE {
					model: 'writerGroup',
					name: COALESCE(sourceMaterialWriterGroupName, 'by'),
					writers: sourceMaterialWriters
				}
			END
		) AS sourceMaterialWriterGroups
		ORDER BY writerRel.groupPosition, writerRel.writerPosition

	WITH character, materialRel, material, writerRel.group AS writerGroupName,
		COLLECT(
			CASE writer WHEN NULL
				THEN null
				ELSE {
					model: TOLOWER(HEAD(LABELS(writer))),
					uuid: writer.uuid,
					name: writer.name,
					format: writer.format,
					sourceMaterialWriterGroups: sourceMaterialWriterGroups
				}
			END
		) AS writers

	WITH character, materialRel, material,
		COLLECT(
			CASE SIZE(writers) WHEN 0
				THEN null
				ELSE { model: 'writerGroup', name: COALESCE(writerGroupName, 'by'), writers: writers }
			END
		) AS writerGroups
		ORDER BY materialRel.groupPosition, materialRel.characterPosition

	WITH
		character,
		material,
		writerGroups,
		COLLECT(
			CASE WHEN materialRel.displayName IS NULL AND materialRel.qualifier IS NULL AND materialRel.group IS NULL
				THEN null
				ELSE {
					displayName: materialRel.displayName,
					qualifier: materialRel.qualifier,
					group: materialRel.group
				}
			END
		) AS depictions
		ORDER BY material.name

	WITH character,
		COLLECT(
			CASE material WHEN NULL
				THEN null
				ELSE {
					model: 'material',
					uuid: material.uuid,
					name: material.name,
					format: material.format,
					writerGroups: writerGroups,
					depictions: depictions
				}
			END
		) AS materials

	OPTIONAL MATCH (character)<-[variantNamedDepiction:INCLUDES_CHARACTER]-(:Material)
		WHERE variantNamedDepiction.displayName IS NOT NULL

	WITH character, materials, variantNamedDepiction
		ORDER BY variantNamedDepiction.displayName

	WITH character, materials, COLLECT(DISTINCT(variantNamedDepiction.displayName)) AS variantNamedDepictions

	OPTIONAL MATCH (character)<-[depictionForVariantNamedPortrayal:INCLUDES_CHARACTER]-(:Material)
		<-[:PRODUCTION_OF]-(:Production)<-[variantNamedPortrayal:PERFORMS_IN]-(:Person)
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

	OPTIONAL MATCH (character)<-[characterDepiction:INCLUDES_CHARACTER]-(materialForProduction:Material)
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
		(materialForProduction)-[otherCharacterDepiction:INCLUDES_CHARACTER]->(otherCharacter:Character)
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

	WITH
		character,
		variantNamedDepictions,
		materials,
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
		materials,
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
