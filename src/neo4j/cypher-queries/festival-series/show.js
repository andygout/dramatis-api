export default () => [`
	MATCH (festivalSeries:FestivalSeries { uuid: $uuid })
	RETURN
		'FESTIVAL_SERIES' AS model,
		festivalSeries.uuid AS uuid,
		festivalSeries.name AS name,
		festivalSeries.differentiator AS differentiator
`];
