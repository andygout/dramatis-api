export default () => `
	MATCH (festival:Festival)

	OPTIONAL MATCH (festival)-[:PART_OF_FESTIVAL_SERIES]->(festivalSeries:FestivalSeries)

	RETURN
		'FESTIVAL' AS model,
		festival.uuid AS uuid,
		festival.name AS name,
		CASE WHEN festivalSeries IS NULL
			THEN null
			ELSE festivalSeries { model: 'FESTIVAL_SERIES', .uuid, .name }
		END AS festivalSeries

	ORDER BY
		festival.name DESC, festivalSeries.name

	LIMIT 1000
`;
