const getCreateUpdateQuery = action => {

	const createUpdateQueryOpeningMap = {
		create: 'CREATE (production:Production { uuid: $uuid, name: $name })',
		update: `
			MATCH (production:Production { uuid: $uuid })

			WITH production

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

		UNWIND (CASE $creativeCredits WHEN [] THEN [{ creativeEntities: [] }] ELSE $creativeCredits END) AS creativeCredit

			UNWIND
				CASE SIZE([entity IN creativeCredit.creativeEntities WHERE entity.model = 'person']) WHEN 0
					THEN [null]
					ELSE [entity IN creativeCredit.creativeEntities WHERE entity.model = 'person']
				END AS creativeEntityParam

				OPTIONAL MATCH (existingCreative:Person { name: creativeEntityParam.name })
					WHERE
						(creativeEntityParam.differentiator IS NULL AND existingCreative.differentiator IS NULL) OR
						(creativeEntityParam.differentiator = existingCreative.differentiator)

				FOREACH (item IN CASE WHEN creativeEntityParam IS NOT NULL THEN [1] ELSE [] END |
					MERGE (entity:Person {
						uuid: COALESCE(existingCreative.uuid, creativeEntityParam.uuid),
						name: creativeEntityParam.name
					})
						ON CREATE SET entity.differentiator = creativeEntityParam.differentiator

					CREATE (production)-
						[:HAS_CREATIVE_TEAM_MEMBER {
							creditPosition: creativeCredit.position,
							entityPosition: creativeEntityParam.position,
							credit: creativeCredit.name
						}]->(entity)
				)

			WITH DISTINCT production, creativeCredit

			UNWIND
				CASE SIZE([entity IN creativeCredit.creativeEntities WHERE entity.model = 'company']) WHEN 0
					THEN [null]
					ELSE [entity IN creativeCredit.creativeEntities WHERE entity.model = 'company']
				END AS creativeEntityParam

				OPTIONAL MATCH (existingCreative:Company { name: creativeEntityParam.name })
					WHERE
						(creativeEntityParam.differentiator IS NULL AND existingCreative.differentiator IS NULL) OR
						(creativeEntityParam.differentiator = existingCreative.differentiator)

				FOREACH (item IN CASE WHEN creativeEntityParam IS NOT NULL THEN [1] ELSE [] END |
					MERGE (entity:Company {
						uuid: COALESCE(existingCreative.uuid, creativeEntityParam.uuid),
						name: creativeEntityParam.name
					})
						ON CREATE SET entity.differentiator = creativeEntityParam.differentiator

					CREATE (production)-
						[:HAS_CREATIVE_TEAM_MEMBER {
							creditPosition: creativeCredit.position,
							entityPosition: creativeEntityParam.position,
							credit: creativeCredit.name
						}]->(entity)
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

	OPTIONAL MATCH (production)<-[role:PERFORMS_IN]-(castMember:Person)

	WITH production, material, theatre, role, castMember
		ORDER BY role.castMemberPosition, role.rolePosition

	WITH production, material, theatre, castMember,
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

	WITH production, material, theatre,
		COLLECT(
			CASE castMember WHEN NULL
				THEN null
				ELSE castMember { .name, .differentiator, roles: roles }
			END
		) + [{ roles: [{}] }] AS cast

	OPTIONAL MATCH (production)-[creativeEntityRel:HAS_CREATIVE_TEAM_MEMBER]->(creativeEntity)
		WHERE creativeEntity:Person OR creativeEntity:Company

	WITH production, material, theatre, cast, creativeEntityRel, creativeEntity
		ORDER BY creativeEntityRel.creditPosition, creativeEntityRel.entityPosition

	WITH production, material, theatre, cast, creativeEntityRel.credit AS creativeCreditName,
		COLLECT(
			CASE creativeEntity WHEN NULL
				THEN null
				ELSE creativeEntity { model: TOLOWER(HEAD(LABELS(creativeEntity))), .name, .differentiator }
			END
		) + [{}] AS creativeEntities

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
		cast,
		COLLECT(
			CASE WHEN creativeCreditName IS NULL AND SIZE(creativeEntities) = 1
				THEN null
				ELSE {
					model: 'creativeCredit',
					name: creativeCreditName,
					creativeEntities: creativeEntities
				}
			END
		) + [{ creativeEntities: [{}] }] AS creativeCredits
`;

const getUpdateQuery = () => getCreateUpdateQuery('update');

const getShowQuery = () => `
	MATCH (production:Production { uuid: $uuid })

	OPTIONAL MATCH (production)-[:PLAYS_AT]->(theatre:Theatre)

	OPTIONAL MATCH (theatre)<-[:INCLUDES_SUB_THEATRE]-(surTheatre:Theatre)

	WITH production,
		CASE theatre WHEN NULL
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
		END AS theatre

	OPTIONAL MATCH (production)-[materialRel:PRODUCTION_OF]->(material:Material)

	OPTIONAL MATCH (material)-[writingEntityRel:WRITTEN_BY|USES_SOURCE_MATERIAL]->(writingEntity)
		WHERE writingEntity:Person OR writingEntity:Company OR writingEntity:Material

	OPTIONAL MATCH (writingEntity:Material)-[sourceMaterialWriterRel:WRITTEN_BY]->(sourceMaterialWriter)

	WITH production, theatre, material, writingEntityRel, writingEntity, sourceMaterialWriterRel, sourceMaterialWriter
		ORDER BY sourceMaterialWriterRel.creditPosition, sourceMaterialWriterRel.entityPosition

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
				ELSE sourceMaterialWriter { model: TOLOWER(HEAD(LABELS(sourceMaterialWriter))), .uuid, .name }
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
		[writingEntity IN COLLECT(
			CASE writingEntity WHEN NULL
				THEN null
				ELSE writingEntity {
					model: TOLOWER(HEAD(LABELS(writingEntity))),
					.uuid,
					.name,
					.format,
					sourceMaterialWritingCredits: sourceMaterialWritingCredits
				}
			END
		) | CASE writingEntity.model WHEN 'material'
			THEN writingEntity
			ELSE writingEntity { .model, .uuid, .name }
		END] AS writingEntities

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

	OPTIONAL MATCH (production)<-[role:PERFORMS_IN]-(castMember:Person)

	OPTIONAL MATCH (castMember)-[role]->(production)-[materialRel]->
		(material)-[characterRel:INCLUDES_CHARACTER]->(character:Character)
		WHERE
			(
				role.roleName IN [character.name, characterRel.displayName] OR
				role.characterName IN [character.name, characterRel.displayName]
			) AND
			(role.characterDifferentiator IS NULL OR role.characterDifferentiator = character.differentiator)

	WITH DISTINCT production, theatre, material, writingCredits, castMember, role, character
		ORDER BY role.castMemberPosition, role.rolePosition

	WITH production, theatre, castMember,
		CASE material WHEN NULL
			THEN null
			ELSE material { model: 'material', .uuid, .name, .format, writingCredits: writingCredits }
		END AS material,
		COLLECT(
			CASE role.roleName WHEN NULL
				THEN { name: 'Performer' }
				ELSE role { model: 'character', uuid: character.uuid, name: role.roleName, .qualifier }
			END
		) AS roles

	WITH production, material, theatre,
		COLLECT(
			CASE castMember WHEN NULL
				THEN null
				ELSE castMember { model: 'person', .uuid, .name, roles: roles }
			END
		) AS cast

	OPTIONAL MATCH (production)-[creativeEntityRel:HAS_CREATIVE_TEAM_MEMBER]->(creativeEntity)
		WHERE creativeEntity:Person OR creativeEntity:Company

	WITH production, material, theatre, cast, creativeEntityRel, creativeEntity
		ORDER BY creativeEntityRel.creditPosition, creativeEntityRel.entityPosition

	WITH production, material, theatre, cast, creativeEntityRel.credit AS creativeCreditName,
		COLLECT(
			CASE WHEN creativeEntity IS NULL
				THEN null
				ELSE creativeEntity { model: TOLOWER(HEAD(LABELS(creativeEntity))), .uuid, .name }
			END
		) AS creativeEntities

	RETURN
		'production' AS model,
		production.uuid AS uuid,
		production.name AS name,
		material,
		theatre,
		cast,
		COLLECT(
			CASE SIZE(creativeEntities) WHEN 0
				THEN null
				ELSE {
					model: 'creativeCredit',
					name: creativeCreditName,
					creativeEntities: creativeEntities
				}
			END
		) AS creativeCredits
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
			ELSE theatre {
				model: 'theatre',
				.uuid,
				.name,
				surTheatre: CASE surTheatre WHEN NULL
					THEN null
					ELSE surTheatre { model: 'theatre', .uuid, .name }
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
