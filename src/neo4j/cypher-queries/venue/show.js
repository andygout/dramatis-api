export default () => [`
	MATCH (venue:Venue { uuid: $uuid })

	OPTIONAL MATCH (surVenue:Venue)-[:HAS_SUB_VENUE]->(venue)

	WITH venue,
		CASE WHEN surVenue IS NULL
			THEN null
			ELSE surVenue { model: 'VENUE', .uuid, .name }
		END AS surVenue

	OPTIONAL MATCH (venue)-[subVenueRel:HAS_SUB_VENUE]->(subVenue:Venue)

	WITH venue, surVenue, subVenue
		ORDER BY subVenueRel.position

	WITH venue, surVenue,
		COLLECT(
			CASE WHEN subVenue IS NULL
				THEN null
				ELSE subVenue { model: 'VENUE', .uuid, .name }
			END
		) AS subVenues

	OPTIONAL MATCH (venue)-[:HAS_SUB_VENUE*0..1]->(venueLinkedToProduction:Venue)<-[:PLAYS_AT]-(production:Production)
		WHERE NOT EXISTS(
			(venue)-[:HAS_SUB_VENUE*0..1]->(venueLinkedToProduction)
			<-[:PLAYS_AT]-(:Production)<-[:HAS_SUB_PRODUCTION*1..2]-(production)
		)

	OPTIONAL MATCH (production)<-[surProductionRel:HAS_SUB_PRODUCTION]-(surProduction:Production)

	OPTIONAL MATCH (surProduction)<-[surSurProductionRel:HAS_SUB_PRODUCTION]-(surSurProduction:Production)

	WITH
		venue,
		surVenue,
		subVenues,
		venueLinkedToProduction,
		production,
		surProduction,
		surProductionRel,
		surSurProduction,
		surSurProductionRel
		ORDER BY
			production.startDate DESC,
			COALESCE(surSurProduction.name, surProduction.name, production.name),
			surSurProductionRel.position DESC,
			surProductionRel.position DESC

	RETURN
		'VENUE' AS model,
		venue.uuid AS uuid,
		venue.name AS name,
		venue.differentiator AS differentiator,
		surVenue,
		subVenues,
		COLLECT(
			CASE WHEN production IS NULL
				THEN null
				ELSE production {
					model: 'PRODUCTION',
					.uuid,
					.name,
					.startDate,
					.endDate,
					subVenue: CASE WHEN venue <> venueLinkedToProduction
						THEN venueLinkedToProduction { model: 'VENUE', .uuid, .name }
						ELSE null
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
`];
