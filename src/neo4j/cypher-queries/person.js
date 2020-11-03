const getShowQuery = () => `
	MATCH (person:Person { uuid: $uuid })

	OPTIONAL MATCH (person)<-[writerRel:WRITTEN_BY]-(playtext:Playtext)

	OPTIONAL MATCH (playtext)-[coWriterRel:WRITTEN_BY]->(coWriter:Person)
		WHERE coWriter.uuid <> person.uuid

	WITH person, playtext, coWriter
		ORDER BY coWriterRel.position

	WITH person, playtext,
		COLLECT(
			CASE coWriter WHEN NULL
				THEN null
				ELSE { model: 'person', uuid: coWriter.uuid, name: coWriter.name }
			END
		) AS coWriters
		ORDER BY playtext.name

	WITH person,
		COLLECT(
			CASE playtext WHEN NULL
				THEN null
				ELSE { model: 'playtext', uuid: playtext.uuid, name: playtext.name, coWriters: coWriters }
			END
		) AS playtexts

	OPTIONAL MATCH (person)-[role:PERFORMS_IN]->(production:Production)

	OPTIONAL MATCH (production)-[:PLAYS_AT]->(theatre:Theatre)

	OPTIONAL MATCH (theatre)<-[:INCLUDES_SUB_THEATRE]-(surTheatre:Theatre)

	OPTIONAL MATCH (production)-[:PRODUCTION_OF]->(:Playtext)-[characterRel:INCLUDES_CHARACTER]->(character:Character)
		WHERE
			(
				role.roleName IN [character.name, characterRel.displayName] OR
				role.characterName IN [character.name, characterRel.displayName]
			) AND
			(role.characterDifferentiator IS NULL OR role.characterDifferentiator = character.differentiator)

	WITH DISTINCT person, playtexts, production, theatre, surTheatre, role, character
		ORDER BY role.rolePosition

	WITH person, playtexts, production, theatre, surTheatre,
		COLLECT(
			CASE role.roleName WHEN NULL
				THEN { name: 'Performer' }
				ELSE { model: 'character', uuid: character.uuid, name: role.roleName, qualifier: role.qualifier }
			END
		) AS roles
		ORDER BY production.name, theatre.name

	RETURN
		'person' AS model,
		person.uuid AS uuid,
		person.name AS name,
		person.differentiator AS differentiator,
		playtexts,
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
					roles: roles
				}
			END
		) AS productions
`;

export {
	getShowQuery
};
