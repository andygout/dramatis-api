export default () => `
	MATCH (season:Season { uuid: $uuid })

	CALL {
		WITH season

		OPTIONAL MATCH (season)<-[:PART_OF_SEASON]-(production:Production)
			WHERE NOT EXISTS((season)<-[:PART_OF_SEASON]-(:Production)<-[:HAS_SUB_PRODUCTION*1..2]-(production))

		OPTIONAL MATCH (production)-[:PLAYS_AT]->(venue:Venue)

		OPTIONAL MATCH (venue)<-[:HAS_SUB_VENUE]-(surVenue:Venue)

		OPTIONAL MATCH (production)<-[surProductionRel:HAS_SUB_PRODUCTION]-(surProduction:Production)

		OPTIONAL MATCH (surProduction)<-[surSurProductionRel:HAS_SUB_PRODUCTION]-(surSurProduction:Production)

		WITH
			season,
			production,
			venue,
			surVenue,
			surProduction,
			surProductionRel,
			surSurProduction,
			surSurProductionRel
			ORDER BY
				production.startDate DESC,
				COALESCE(surSurProduction.name, surProduction.name, production.name),
				surSurProductionRel.position DESC,
				surProductionRel.position DESC,
				venue.name

		RETURN
			COLLECT(
				CASE WHEN production IS NULL
					THEN null
					ELSE production {
						model: 'PRODUCTION',
						.uuid,
						.name,
						.startDate,
						.endDate,
						venue: CASE WHEN venue IS NULL
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
						END,
						surProduction: CASE WHEN surProduction IS NULL
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
						END
					}
				END
			) AS productions
	}

	RETURN
		productions
`;
