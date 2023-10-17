export default () => `
	MATCH (festival:Festival { uuid: $uuid })

	OPTIONAL MATCH (festival)-[:PART_OF_FESTIVAL_SERIES]->(festivalSeries:FestivalSeries)

	WITH festival, festivalSeries

	RETURN
		festival.uuid AS uuid,
		festival.name AS name,
		festival.differentiator AS differentiator,
		{
			name: COALESCE(festivalSeries.name, ''),
			differentiator: COALESCE(festivalSeries.differentiator, '')
		} AS festivalSeries
`;
