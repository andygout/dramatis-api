export default () => `
	MATCH (festival:Festival { uuid: $uuid })

	CALL {
		WITH festival

		OPTIONAL MATCH (festival)-[:PART_OF_FESTIVAL_SERIES]->(festivalSeries:FestivalSeries)

		RETURN
			CASE WHEN festivalSeries IS NULL
				THEN null
				ELSE festivalSeries { model: 'FESTIVAL_SERIES', .uuid, .name }
			END AS festivalSeries
	}

	RETURN
		'FESTIVAL' AS model,
		festival.uuid AS uuid,
		festival.name AS name,
		festival.differentiator AS differentiator,
		festivalSeries
`;
