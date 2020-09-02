const getShowQuery = () => `
	MATCH (theatre:Theatre { uuid: $uuid })

	OPTIONAL MATCH (theatre)<-[:PLAYS_AT]-(production:Production)

	WITH theatre, production
		ORDER BY production.name

	RETURN
		'theatre' AS model,
		theatre.uuid AS uuid,
		theatre.name AS name,
		theatre.differentiator AS differentiator,
		COLLECT(
			CASE production WHEN NULL
				THEN null
				ELSE { model: 'production', uuid: production.uuid, name: production.name }
			END
		) AS productions
`;

export {
	getShowQuery
};
