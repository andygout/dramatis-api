export default () => `
	MATCH (venue:Venue { uuid: $uuid })

	CALL {
		WITH venue

		OPTIONAL MATCH (venue)<-[:HAS_SUB_VENUE]-(surVenue:Venue)

		RETURN
			CASE WHEN surVenue IS NULL
				THEN null
				ELSE surVenue { model: 'VENUE', .uuid, .name }
			END AS surVenue
	}

	CALL {
		WITH venue

		OPTIONAL MATCH (venue)-[subVenueRel:HAS_SUB_VENUE]->(subVenue:Venue)

		WITH subVenue
			ORDER BY subVenueRel.position

		RETURN
			COLLECT(
				CASE WHEN subVenue IS NULL
					THEN null
					ELSE subVenue { model: 'VENUE', .uuid, .name }
				END
			) AS subVenues
	}

	RETURN
		'VENUE' AS model,
		venue.uuid AS uuid,
		venue.name AS name,
		venue.differentiator AS differentiator,
		surVenue,
		subVenues
`;
