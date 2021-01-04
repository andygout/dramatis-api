const getCreateUpdateQuery = action => {

	const createUpdateQueryOpeningMap = {
		create: 'CREATE (production:Production { uuid: $uuid, name: $name })',
		update: `
			MATCH (production:Production { uuid: $uuid })

			OPTIONAL MATCH (production)-[relationship]-()

			DELETE relationship

			WITH DISTINCT production

			SET production.name = $name
		`
	};

	return `
		${createUpdateQueryOpeningMap[action]}

		WITH production

		OPTIONAL MATCH (existingMaterial:Material { name: $material.name })
			WHERE
				($material.differentiator IS NULL AND existingMaterial.differentiator IS NULL) OR
				($material.differentiator = existingMaterial.differentiator)

		WITH
			production,
			CASE existingMaterial WHEN NULL
				THEN { uuid: $material.uuid, name: $material.name, differentiator: $material.differentiator }
				ELSE existingMaterial
			END AS materialProps

		FOREACH (item IN CASE $material.name WHEN NULL THEN [] ELSE [1] END |
			MERGE (material:Material { uuid: materialProps.uuid, name: materialProps.name })
				ON CREATE SET material.differentiator = materialProps.differentiator

			CREATE (production)-[:PRODUCTION_OF]->(material)
		)

		WITH production

		OPTIONAL MATCH (existingTheatre:Theatre { name: $theatre.name })
			WHERE
				($theatre.differentiator IS NULL AND existingTheatre.differentiator IS NULL) OR
				($theatre.differentiator = existingTheatre.differentiator)

		WITH
			production,
			CASE existingTheatre WHEN NULL
				THEN { uuid: $theatre.uuid, name: $theatre.name, differentiator: $theatre.differentiator }
				ELSE existingTheatre
			END AS theatreProps

		FOREACH (item IN CASE $theatre.name WHEN NULL THEN [] ELSE [1] END |
			MERGE (theatre:Theatre { uuid: theatreProps.uuid, name: theatreProps.name })
				ON CREATE SET theatre.differentiator = theatreProps.differentiator

			CREATE (production)-[:PLAYS_AT]->(theatre)
		)

		WITH production

		UNWIND (CASE $cast WHEN [] THEN [null] ELSE $cast END) AS castMemberParam

			OPTIONAL MATCH (existingPerson:Person { name: castMemberParam.name })
				WHERE
					(castMemberParam.differentiator IS NULL AND existingPerson.differentiator IS NULL) OR
					(castMemberParam.differentiator = existingPerson.differentiator)

			WITH
				production,
				castMemberParam,
				CASE existingPerson WHEN NULL
					THEN {
						uuid: castMemberParam.uuid,
						name: castMemberParam.name,
						differentiator: castMemberParam.differentiator
					}
					ELSE existingPerson
				END AS castMemberProps

			FOREACH (item IN CASE castMemberParam WHEN NULL THEN [] ELSE [1] END |
				MERGE (person:Person { uuid: castMemberProps.uuid, name: castMemberProps.name })
					ON CREATE SET person.differentiator = castMemberProps.differentiator

				FOREACH (role IN CASE castMemberParam.roles WHEN [] THEN [{}] ELSE castMemberParam.roles END |
					CREATE (production)
						<-[:PERFORMS_IN {
							castMemberPosition: castMemberParam.position,
							rolePosition: role.position,
							roleName: role.name,
							characterName: role.characterName,
							characterDifferentiator: role.characterDifferentiator,
							qualifier: role.qualifier
						}]-(person)
				)
			)

		WITH DISTINCT production

		${getEditQuery()}
	`;

};

const getCreateQuery = () => getCreateUpdateQuery('create');

const getEditQuery = () => `
	MATCH (production:Production { uuid: $uuid })

	OPTIONAL MATCH (production)-[:PRODUCTION_OF]->(material:Material)

	OPTIONAL MATCH (production)-[:PLAYS_AT]->(theatre:Theatre)

	OPTIONAL MATCH (production)<-[role:PERFORMS_IN]-(person:Person)

	WITH production, material, theatre, role, person
		ORDER BY role.castMemberPosition, role.rolePosition

	WITH production, material, theatre, person,
		COLLECT(
			CASE role.roleName WHEN NULL
				THEN null
				ELSE {
					name: role.roleName,
					characterName: CASE role.characterName WHEN NULL THEN '' ELSE role.characterName END,
					characterDifferentiator: CASE role.characterDifferentiator WHEN NULL THEN '' ELSE role.characterDifferentiator END,
					qualifier: CASE role.qualifier WHEN NULL THEN '' ELSE role.qualifier END
				}
			END
		) + [{}] AS roles

	RETURN
		'production' AS model,
		production.uuid AS uuid,
		production.name AS name,
		{
			name: CASE material.name WHEN NULL THEN '' ELSE material.name END,
			differentiator: CASE material.differentiator WHEN NULL THEN '' ELSE material.differentiator END
		} AS material,
		{
			name: CASE theatre.name WHEN NULL THEN '' ELSE theatre.name END,
			differentiator: CASE theatre.differentiator WHEN NULL THEN '' ELSE theatre.differentiator END
		} AS theatre,
		COLLECT(
			CASE person WHEN NULL
				THEN null
				ELSE { name: person.name, differentiator: person.differentiator, roles: roles }
			END
		) + [{ roles: [{}] }] AS cast
`;

const getUpdateQuery = () => getCreateUpdateQuery('update');

const getShowQuery = () => `
	MATCH (production:Production { uuid: $uuid })

	OPTIONAL MATCH (production)-[:PLAYS_AT]->(theatre:Theatre)

	OPTIONAL MATCH (theatre)<-[:INCLUDES_SUB_THEATRE]-(surTheatre:Theatre)

	WITH production,
		CASE theatre WHEN NULL
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
		END AS theatre

	OPTIONAL MATCH (production)-[materialRel:PRODUCTION_OF]->(material:Material)

	OPTIONAL MATCH (material)-[writerRel:WRITTEN_BY|USES_SOURCE_MATERIAL]->(writer)
		WHERE writer:Person OR writer:Material

	OPTIONAL MATCH (writer:Material)-[sourceMaterialWriterRel:WRITTEN_BY]->(sourceMaterialWriter)

	WITH production, theatre, material, writerRel, writer, sourceMaterialWriterRel, sourceMaterialWriter
		ORDER BY sourceMaterialWriterRel.groupPosition, sourceMaterialWriter.writerPosition

	WITH
		production,
		theatre,
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

	WITH production, theatre, material, writerRel, writer,
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

	WITH production, theatre, material, writerRel.group AS writerGroupName,
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

	WITH production, theatre, material,
		COLLECT(
			CASE SIZE(writers) WHEN 0
				THEN null
				ELSE { model: 'writerGroup', name: COALESCE(writerGroupName, 'by'), writers: writers }
			END
		) AS writerGroups

	OPTIONAL MATCH (production)<-[role:PERFORMS_IN]-(performer:Person)

	OPTIONAL MATCH (performer)-[role]->(production)-[materialRel]->
		(material)-[characterRel:INCLUDES_CHARACTER]->(character:Character)
		WHERE
			(
				role.roleName IN [character.name, characterRel.displayName] OR
				role.characterName IN [character.name, characterRel.displayName]
			) AND
			(role.characterDifferentiator IS NULL OR role.characterDifferentiator = character.differentiator)

	WITH DISTINCT production, theatre, material, writerGroups, performer, role, character
		ORDER BY role.castMemberPosition, role.rolePosition

	WITH production, theatre, performer,
		CASE material WHEN NULL
			THEN null
			ELSE {
				model: 'material',
				uuid: material.uuid,
				name: material.name,
				format: material.format,
				writerGroups: writerGroups
			}
		END AS material,
		COLLECT(
			CASE role.roleName WHEN NULL
				THEN { name: 'Performer' }
				ELSE { model: 'character', uuid: character.uuid, name: role.roleName, qualifier: role.qualifier }
			END
		) AS roles

	RETURN
		'production' AS model,
		production.uuid AS uuid,
		production.name AS name,
		material,
		theatre,
		COLLECT(
			CASE performer WHEN NULL
				THEN null
				ELSE { model: 'person', uuid: performer.uuid, name: performer.name, roles: roles }
			END
		) AS cast
`;

const getListQuery = () => `
	MATCH (production:Production)

	OPTIONAL MATCH (production)-[:PLAYS_AT]->(theatre:Theatre)

	OPTIONAL MATCH (theatre)<-[:INCLUDES_SUB_THEATRE]-(surTheatre:Theatre)

	RETURN
		'production' AS model,
		production.uuid AS uuid,
		production.name AS name,
		CASE theatre WHEN NULL
			THEN null
			ELSE {
				model: 'theatre',
				uuid: theatre.uuid,
				name: theatre.name,
				surTheatre: CASE surTheatre WHEN NULL
					THEN null
					ELSE { model: 'theatre', uuid: surTheatre.uuid, name: surTheatre.name }
				END
			}
		END AS theatre

	ORDER BY production.name, theatre.name

	LIMIT 100
`;

export {
	getCreateQuery,
	getEditQuery,
	getUpdateQuery,
	getShowQuery,
	getListQuery
};
