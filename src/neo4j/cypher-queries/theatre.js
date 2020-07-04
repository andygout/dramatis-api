const getDeleteQuery = () => `
	MATCH (:Theatre { uuid: $uuid })

	OPTIONAL MATCH (deletableTheatre:Theatre { uuid: $uuid })
		WHERE NOT (deletableTheatre)-[:PLAYS_AT]-(:Production)

	OPTIONAL MATCH (undeletableTheatre:Theatre { uuid: $uuid })<-[:PLAYS_AT]-(:Production)

	WITH
		undeletableTheatre,
		deletableTheatre,
		deletableTheatre IS NOT NULL AS isDeleted,
		deletableTheatre.name AS deletableTheatreName

	DETACH DELETE deletableTheatre

	RETURN
		'theatre' AS model,
		CASE WHEN isDeleted
			THEN deletableTheatreName
			ELSE undeletableTheatre.name
		END AS name,
		isDeleted
`;

const getShowQuery = () => `
	MATCH (theatre:Theatre { uuid: $uuid })

	OPTIONAL MATCH (theatre)<-[:PLAYS_AT]-(production:Production)

	WITH theatre, production
		ORDER BY production.name, theatre.name

	RETURN
		'theatre' AS model,
		theatre.uuid AS uuid,
		theatre.name AS name,
		COLLECT(
			CASE WHEN production IS NULL
				THEN null
				ELSE { model: 'production', uuid: production.uuid, name: production.name }
			END
		) AS productions
`;

export {
	getDeleteQuery,
	getShowQuery
};
