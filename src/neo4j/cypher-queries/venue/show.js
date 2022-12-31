export default () => `
	MATCH (venue:Venue { uuid: $uuid })

	OPTIONAL MATCH (surVenue:Venue)-[:HAS_SUB_VENUE]->(venue)

	WITH venue,
		CASE surVenue WHEN NULL
			THEN null
			ELSE surVenue { model: 'VENUE', .uuid, .name }
		END AS surVenue

	OPTIONAL MATCH (venue)-[subVenueRel:HAS_SUB_VENUE]->(subVenue:Venue)

	WITH venue, surVenue, subVenue
		ORDER BY subVenueRel.position

	WITH venue, surVenue,
		COLLECT(
			CASE subVenue WHEN NULL
				THEN null
				ELSE subVenue { model: 'VENUE', .uuid, .name }
			END
		) AS subVenues

	OPTIONAL MATCH (venue)-[:HAS_SUB_VENUE*0..1]->(venueLinkedToProduction:Venue)<-[:PLAYS_AT]-(production:Production)
		WHERE NOT EXISTS(
			(venue)-[:HAS_SUB_VENUE*0..1]->(venueLinkedToProduction)
			<-[:PLAYS_AT]-(:Production)<-[:HAS_SUB_PRODUCTION]-(production)
		)

	OPTIONAL MATCH (production)<-[:HAS_SUB_PRODUCTION]-(surProduction:Production)

	WITH
		venue,
		surVenue,
		subVenues,
		venueLinkedToProduction,
		production,
		surProduction
		ORDER BY production.startDate DESC, production.name

	RETURN
		'VENUE' AS model,
		venue.uuid AS uuid,
		venue.name AS name,
		venue.differentiator AS differentiator,
		surVenue,
		subVenues,
		COLLECT(
			CASE production WHEN NULL
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
					surProduction: CASE surProduction WHEN NULL
						THEN null
						ELSE surProduction { model: 'PRODUCTION', .uuid, .name }
					END
				}
			END
		) AS productions
`;
