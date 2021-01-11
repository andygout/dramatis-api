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

		FOREACH (item IN CASE $material.name WHEN NULL THEN [] ELSE [1] END |
			MERGE (material:Material {
				uuid: COALESCE(existingMaterial.uuid, $material.uuid),
				name: $material.name
			})
				ON CREATE SET material.differentiator = $material.differentiator

			CREATE (production)-[:PRODUCTION_OF]->(material)
		)

		WITH production

		OPTIONAL MATCH (existingTheatre:Theatre { name: $theatre.name })
			WHERE
				($theatre.differentiator IS NULL AND existingTheatre.differentiator IS NULL) OR
				($theatre.differentiator = existingTheatre.differentiator)

		FOREACH (item IN CASE $theatre.name WHEN NULL THEN [] ELSE [1] END |
			MERGE (theatre:Theatre {
				uuid: COALESCE(existingTheatre.uuid, $theatre.uuid),
				name: $theatre.name
			})
				ON CREATE SET theatre.differentiator = $theatre.differentiator

			CREATE (production)-[:PLAYS_AT]->(theatre)
		)

		WITH production

		UNWIND (CASE $cast WHEN [] THEN [null] ELSE $cast END) AS castMemberParam

			OPTIONAL MATCH (existingPerson:Person { name: castMemberParam.name })
				WHERE
					(castMemberParam.differentiator IS NULL AND existingPerson.differentiator IS NULL) OR
					(castMemberParam.differentiator = existingPerson.differentiator)

			FOREACH (item IN CASE castMemberParam WHEN NULL THEN [] ELSE [1] END |
				MERGE (castMember:Person {
					uuid: COALESCE(existingPerson.uuid, castMemberParam.uuid),
					name: castMemberParam.name
				})
					ON CREATE SET castMember.differentiator = castMemberParam.differentiator

				FOREACH (role IN CASE castMemberParam.roles WHEN [] THEN [{}] ELSE castMemberParam.roles END |
					CREATE (production)
						<-[:PERFORMS_IN {
							castMemberPosition: castMemberParam.position,
							rolePosition: role.position,
							roleName: role.name,
							characterName: role.characterName,
							characterDifferentiator: role.characterDifferentiator,
							qualifier: role.qualifier
						}]-(castMember)
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

	OPTIONAL MATCH (material)-[writingEntityRel:WRITTEN_BY|USES_SOURCE_MATERIAL]->(writingEntity)
		WHERE writingEntity:Person OR writingEntity:Material

	OPTIONAL MATCH (writingEntity:Material)-[sourceMaterialWriterRel:WRITTEN_BY]->(sourceMaterialWriter)

	WITH production, theatre, material, writingEntityRel, writingEntity, sourceMaterialWriterRel, sourceMaterialWriter
		ORDER BY sourceMaterialWriterRel.creditPosition, sourceMaterialWriter.entityPosition

	WITH
		production,
		theatre,
		material,
		writingEntityRel,
		writingEntity,
		sourceMaterialWriterRel.credit AS sourceMaterialWritingCreditName,
		COLLECT(
			CASE sourceMaterialWriter WHEN NULL
				THEN null
				ELSE { model: 'person', uuid: sourceMaterialWriter.uuid, name: sourceMaterialWriter.name }
			END
		) AS sourceMaterialWriters

	WITH production, theatre, material, writingEntityRel, writingEntity,
		COLLECT(
			CASE SIZE(sourceMaterialWriters) WHEN 0
				THEN null
				ELSE {
					model: 'writingCredit',
					name: COALESCE(sourceMaterialWritingCreditName, 'by'),
					writingEntities: sourceMaterialWriters
				}
			END
		) AS sourceMaterialWritingCredits
		ORDER BY writingEntityRel.creditPosition, writingEntityRel.entityPosition

	WITH production, theatre, material, writingEntityRel.credit AS writingCreditName,
		COLLECT(
			CASE writingEntity WHEN NULL
				THEN null
				ELSE {
					model: TOLOWER(HEAD(LABELS(writingEntity))),
					uuid: writingEntity.uuid,
					name: writingEntity.name,
					format: writingEntity.format,
					sourceMaterialWritingCredits: sourceMaterialWritingCredits
				}
			END
		) AS writingEntities

	WITH production, theatre, material,
		COLLECT(
			CASE SIZE(writingEntities) WHEN 0
				THEN null
				ELSE {
					model: 'writingCredit',
					name: COALESCE(writingCreditName, 'by'),
					writingEntities: writingEntities
				}
			END
		) AS writingCredits

	OPTIONAL MATCH (production)<-[role:PERFORMS_IN]-(performer:Person)

	OPTIONAL MATCH (performer)-[role]->(production)-[materialRel]->
		(material)-[characterRel:INCLUDES_CHARACTER]->(character:Character)
		WHERE
			(
				role.roleName IN [character.name, characterRel.displayName] OR
				role.characterName IN [character.name, characterRel.displayName]
			) AND
			(role.characterDifferentiator IS NULL OR role.characterDifferentiator = character.differentiator)

	WITH DISTINCT production, theatre, material, writingCredits, performer, role, character
		ORDER BY role.castMemberPosition, role.rolePosition

	WITH production, theatre, performer,
		CASE material WHEN NULL
			THEN null
			ELSE {
				model: 'material',
				uuid: material.uuid,
				name: material.name,
				format: material.format,
				writingCredits: writingCredits
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
