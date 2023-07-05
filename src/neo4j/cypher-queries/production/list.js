export default () => `
	MATCH (production:Production)
		WHERE NOT EXISTS((production)-[:HAS_SUB_PRODUCTION]->(:Production))

	OPTIONAL MATCH (production)-[:PLAYS_AT]->(venue:Venue)

	OPTIONAL MATCH (venue)<-[:HAS_SUB_VENUE]-(surVenue:Venue)

	OPTIONAL MATCH (production)<-[surProductionRel:HAS_SUB_PRODUCTION]-(surProduction:Production)

	OPTIONAL MATCH (surProduction)<-[surSurProductionRel:HAS_SUB_PRODUCTION]-(surSurProduction:Production)

	RETURN
		'PRODUCTION' AS model,
		production.uuid AS uuid,
		production.name AS name,
		production.startDate AS startDate,
		production.endDate AS endDate,
		CASE WHEN venue IS NULL
			THEN null
			ELSE venue {
				model: 'VENUE',
				.uuid,
				.name,
				surVenue: CASE WHEN surVenue IS NULL
					THEN null
					ELSE surVenue { model: 'VENUE', .uuid, .name }
				END
			}
		END AS venue,
		CASE WHEN surProduction IS NULL
			THEN null
			ELSE surProduction {
				model: 'PRODUCTION',
				.uuid,
				.name,
				surProduction: CASE WHEN surSurProduction IS NULL
					THEN null
					ELSE surSurProduction { model: 'PRODUCTION', .uuid, .name }
				END
			}
		END AS surProduction

	ORDER BY
		production.startDate DESC,
		COALESCE(surSurProduction.name, surProduction.name, production.name),
		surSurProductionRel.position DESC,
		surProductionRel.position DESC,
		venue.name

	LIMIT 100
`;
