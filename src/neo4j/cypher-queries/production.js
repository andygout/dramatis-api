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

		OPTIONAL MATCH (existingPlaytext:Playtext { name: $playtext.name })
			WHERE
				($playtext.differentiator IS NULL AND existingPlaytext.differentiator IS NULL) OR
				($playtext.differentiator = existingPlaytext.differentiator)

		WITH
			production,
			CASE existingPlaytext WHEN NULL
				THEN { uuid: $playtext.uuid, name: $playtext.name, differentiator: $playtext.differentiator }
				ELSE existingPlaytext
			END AS playtextProps

		FOREACH (item IN CASE $playtext.name WHEN NULL THEN [] ELSE [1] END |
			MERGE (playtext:Playtext { uuid: playtextProps.uuid, name: playtextProps.name })
				ON CREATE SET playtext.differentiator = playtextProps.differentiator

			CREATE (production)-[:PRODUCTION_OF]->(playtext)
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

	OPTIONAL MATCH (production)-[:PRODUCTION_OF]->(playtext:Playtext)

	OPTIONAL MATCH (production)-[:PLAYS_AT]->(theatre:Theatre)

	OPTIONAL MATCH (production)<-[role:PERFORMS_IN]-(person:Person)

	WITH production, playtext, theatre, role, person
		ORDER BY role.castMemberPosition, role.rolePosition

	WITH production, playtext, theatre, person,
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
		) + [{ name: '', characterName: '', characterDifferentiator: '', qualifier: '' }] AS roles

	RETURN
		'production' AS model,
		production.uuid AS uuid,
		production.name AS name,
		{
			name: CASE playtext.name WHEN NULL THEN '' ELSE playtext.name END,
			differentiator: CASE playtext.differentiator WHEN NULL THEN '' ELSE playtext.differentiator END
		} AS playtext,
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

	OPTIONAL MATCH (production)-[playtextRel:PRODUCTION_OF]->(playtext:Playtext)

	OPTIONAL MATCH (playtext)-[writerRel:WRITTEN_BY]->(writer:Person)

	WITH production, playtext, writerRel, writer
		ORDER BY writerRel.position

	WITH production, playtext, writerRel.group AS writerGroup,
		COLLECT(
			CASE writer WHEN NULL
				THEN null
				ELSE { model: 'person', uuid: writer.uuid, name: writer.name }
			END
		) AS writers

	WITH production, playtext,
		COLLECT(
			CASE SIZE(writers) WHEN 0
				THEN null
				ELSE { model: 'writerGroup', name: COALESCE(writerGroup, 'by'), writers: writers }
			END
		) AS writerGroups

	OPTIONAL MATCH (production)-[:PLAYS_AT]->(theatre:Theatre)

	OPTIONAL MATCH (theatre)<-[:INCLUDES_SUB_THEATRE]-(surTheatre:Theatre)

	OPTIONAL MATCH (production)<-[role:PERFORMS_IN]-(performer:Person)

	OPTIONAL MATCH (performer)-[role]->(production)-[playtextRel]->
		(playtext)-[characterRel:INCLUDES_CHARACTER]->(character:Character)
		WHERE
			(
				role.roleName IN [character.name, characterRel.displayName] OR
				role.characterName IN [character.name, characterRel.displayName]
			) AND
			(role.characterDifferentiator IS NULL OR role.characterDifferentiator = character.differentiator)

	WITH DISTINCT production, playtext, writerGroups, theatre, surTheatre, performer, role, character
		ORDER BY role.castMemberPosition, role.rolePosition

	WITH production, playtext, writerGroups, theatre, surTheatre, performer,
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
		CASE playtext WHEN NULL
			THEN null
			ELSE { model: 'playtext', uuid: playtext.uuid, name: playtext.name, writerGroups: writerGroups }
		END AS playtext,
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
		END AS theatre,
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
