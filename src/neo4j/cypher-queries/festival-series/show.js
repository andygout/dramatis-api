export default () => [`
	MATCH (festivalSeries:FestivalSeries { uuid: $uuid })

	OPTIONAL MATCH (festivalSeries)<-[:PART_OF_FESTIVAL_SERIES]-(festival:Festival)

	WITH festivalSeries, festival
		ORDER BY festival.name DESC

	RETURN
		'FESTIVAL_SERIES' AS model,
		festivalSeries.uuid AS uuid,
		festivalSeries.name AS name,
		festivalSeries.differentiator AS differentiator,
		COLLECT(
			CASE WHEN festival IS NULL
				THEN null
				ELSE festival { model: 'FESTIVAL', .uuid, .name }
			END
		) AS festivals
`];
