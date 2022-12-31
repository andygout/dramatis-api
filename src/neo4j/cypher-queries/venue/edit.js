export default () => `
	MATCH (venue:Venue { uuid: $uuid })

	OPTIONAL MATCH (venue)-[subVenueRel:HAS_SUB_VENUE]->(subVenue:Venue)

	WITH venue, subVenueRel, subVenue
		ORDER BY subVenueRel.position

	RETURN
		venue.uuid AS uuid,
		venue.name AS name,
		venue.differentiator AS differentiator,
		COLLECT(
			CASE subVenue WHEN NULL
				THEN null
				ELSE subVenue { .name, .differentiator }
			END
		) + [{}] AS subVenues
`;
