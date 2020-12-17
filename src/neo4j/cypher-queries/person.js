const getShowQuery = () => `
	MATCH (person:Person { uuid: $uuid })

	OPTIONAL MATCH (person)<-[writerRel:WRITTEN_BY]-(playtext:Playtext)

	OPTIONAL MATCH (playtext)-[allWriterRel:WRITTEN_BY|USES_SOURCE_MATERIAL]->(writer)
		WHERE writer:Person OR writer:Playtext

	OPTIONAL MATCH (writer:Playtext)-[sourceMaterialWriterRel:WRITTEN_BY]->(sourceMaterialWriter)

	WITH person, writerRel, playtext, allWriterRel, writer, sourceMaterialWriterRel, sourceMaterialWriter
		ORDER BY sourceMaterialWriterRel.groupPosition, sourceMaterialWriter.writerPosition

	WITH
		person,
		writerRel,
		playtext,
		allWriterRel,
		writer,
		sourceMaterialWriterRel.group AS sourceMaterialWriterGroupName,
		COLLECT(
			CASE sourceMaterialWriter WHEN NULL
				THEN null
				ELSE { model: 'person', uuid: sourceMaterialWriter.uuid, name: sourceMaterialWriter.name }
			END
		) AS sourceMaterialWriters

	WITH person, writerRel, playtext, allWriterRel, writer,
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
		ORDER BY allWriterRel.groupPosition, allWriterRel.writerPosition

	WITH person, writerRel, playtext, allWriterRel.group AS writerGroupName,
		COLLECT(
			CASE writer WHEN NULL
				THEN null
				ELSE {
					model: TOLOWER(HEAD(LABELS(writer))),
					uuid: CASE WHEN writer.uuid = person.uuid THEN null ELSE writer.uuid END,
					name: writer.name,
					sourceMaterialWriterGroups: sourceMaterialWriterGroups
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

	OPTIONAL MATCH (person)<-[:WRITTEN_BY]-(:Playtext)<-[:USES_SOURCE_MATERIAL]-(sourcingPlaytext:Playtext)

	OPTIONAL MATCH (sourcingPlaytext)-[sourcingPlaytextWriterRel:WRITTEN_BY|USES_SOURCE_MATERIAL]->
		(sourcingPlaytextWriter)
		WHERE sourcingPlaytextWriter:Person OR sourcingPlaytextWriter:Playtext

	WITH
		person,
		playtexts,
		subsequentVersionPlaytexts,
		sourcingPlaytext,
		sourcingPlaytextWriterRel,
		sourcingPlaytextWriter
		ORDER BY sourcingPlaytextWriterRel.groupPosition, sourcingPlaytextWriterRel.writerPosition

	WITH
		person,
		playtexts,
		subsequentVersionPlaytexts,
		sourcingPlaytext,
		sourcingPlaytextWriterRel,
		sourcingPlaytextWriter,
		sourcingPlaytextWriterRel.group AS sourcingPlaytextWriterGroupName,
		COLLECT(
			CASE sourcingPlaytextWriter WHEN NULL
				THEN null
				ELSE {
					model: TOLOWER(HEAD(LABELS(sourcingPlaytextWriter))),
					uuid: sourcingPlaytextWriter.uuid,
					name: sourcingPlaytextWriter.name
				}
			END
		) AS sourcingPlaytextWriters

	WITH
		person,
		playtexts,
		subsequentVersionPlaytexts,
		sourcingPlaytext,
		COLLECT(
			CASE SIZE(sourcingPlaytextWriters) WHEN 0
				THEN null
				ELSE {
					model: 'writerGroup',
					name: COALESCE(sourcingPlaytextWriterGroupName, 'by'),
					writers: sourcingPlaytextWriters
				}
			END
		) AS sourcingPlaytextWriterGroups

	WITH
		person,
		playtexts,
		subsequentVersionPlaytexts,
		COLLECT(
			CASE sourcingPlaytext WHEN NULL
				THEN null
				ELSE {
					model: 'playtext',
					uuid: sourcingPlaytext.uuid,
					name: sourcingPlaytext.name,
					writerGroups: sourcingPlaytextWriterGroups
				}
			END
		) AS sourcingPlaytexts

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

	WITH DISTINCT
		person,
		playtexts,
		subsequentVersionPlaytexts,
		sourcingPlaytexts,
		production,
		theatre,
		surTheatre,
		role,
		character
		ORDER BY role.rolePosition

	WITH person, playtexts, subsequentVersionPlaytexts, sourcingPlaytexts, production, theatre, surTheatre,
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
		sourcingPlaytexts,
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
