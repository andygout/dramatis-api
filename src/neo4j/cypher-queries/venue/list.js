export default () => `
	MATCH (venue:Venue)
		WHERE NOT EXISTS((:Venue)-[:HAS_SUB_VENUE]->(venue))

	OPTIONAL MATCH (venue)-[subVenueRel:HAS_SUB_VENUE]->(subVenue:Venue)

	WITH venue, subVenue
		ORDER BY subVenueRel.position

	RETURN
		'VENUE' AS model,
		venue.uuid AS uuid,
		venue.name AS name,
		COLLECT(
			CASE WHEN subVenue IS NULL
				THEN null
				ELSE subVenue { model: 'VENUE', .uuid, .name }
			END
		) AS subVenues

	ORDER BY
		venue.name

	LIMIT 1000
`;
