export default () => `
	MATCH (production:Production)
		WHERE NOT EXISTS((production)-[:HAS_SUB_PRODUCTION]->(:Production))

	OPTIONAL MATCH (production)-[:PLAYS_AT]->(venue:Venue)

	OPTIONAL MATCH (venue)<-[:HAS_SUB_VENUE]-(surVenue:Venue)

	OPTIONAL MATCH (production)<-[:HAS_SUB_PRODUCTION]-(surProduction:Production)

	RETURN
		'PRODUCTION' AS model,
		production.uuid AS uuid,
		production.name AS name,
		production.startDate AS startDate,
		production.endDate AS endDate,
		CASE venue WHEN NULL
			THEN null
			ELSE venue {
				model: 'VENUE',
				.uuid,
				.name,
				surVenue: CASE surVenue WHEN NULL
					THEN null
					ELSE surVenue { model: 'VENUE', .uuid, .name }
				END
			}
		END AS venue,
		CASE surProduction WHEN NULL
			THEN null
			ELSE surProduction { model: 'PRODUCTION', .uuid, .name }
		END AS surProduction

	ORDER BY production.startDate DESC, production.name, venue.name

	LIMIT 100
`;
