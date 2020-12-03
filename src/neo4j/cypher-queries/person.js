const getShowQuery = () => `
	MATCH (person:Person { uuid: $uuid })

	OPTIONAL MATCH (person)<-[writerRel:WRITTEN_BY]-(playtext:Playtext)

	OPTIONAL MATCH (playtext)-[allWriterRel:WRITTEN_BY]->(writer:Person)

	WITH person, writerRel, playtext, allWriterRel, writer
		ORDER BY allWriterRel.groupPosition, allWriterRel.writerPosition

	WITH person, writerRel, playtext, allWriterRel.group AS writerGroupName,
		COLLECT(
			CASE writer WHEN NULL
				THEN null
				ELSE {
					model: 'person',
					uuid: CASE WHEN writer.uuid = person.uuid THEN null ELSE writer.uuid END,
					name: writer.name
				}
			END
		) AS writers

	WITH person, writerRel, playtext,
		COLLECT(
			CASE SIZE(writers) WHEN 0
				THEN null
				ELSE { model: 'writerGroup', name: COALESCE(writerGroupName, 'by'), writers: writers }
			END
		) AS writerGroups
		ORDER BY playtext.name

	WITH person,
		COLLECT(
			CASE playtext WHEN NULL
				THEN null
				ELSE {
					model: 'playtext',
					uuid: playtext.uuid,
					name: playtext.name,
					writerGroups: writerGroups,
					isOriginalVersionWriter: writerRel.isOriginalVersionWriter
				}
			END
		) AS playtexts

	WITH
		person,
		[
			playtext IN playtexts WHERE playtext.isOriginalVersionWriter IS NULL |
			{ model: playtext.model, uuid: playtext.uuid, name: playtext.name, writerGroups: playtext.writerGroups }
		] AS playtexts,
		[
			playtext IN playtexts WHERE playtext.isOriginalVersionWriter = true |
			{ model: playtext.model, uuid: playtext.uuid, name: playtext.name, writerGroups: playtext.writerGroups }
		] AS subsequentVersionPlaytexts

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

	WITH DISTINCT person, playtexts, subsequentVersionPlaytexts, production, theatre, surTheatre, role, character
		ORDER BY role.rolePosition

	WITH person, playtexts, subsequentVersionPlaytexts, production, theatre, surTheatre,
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
		subsequentVersionPlaytexts,
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
