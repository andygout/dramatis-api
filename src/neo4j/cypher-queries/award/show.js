export default () => [`
	MATCH (award:Award { uuid: $uuid })

	OPTIONAL MATCH (award)-[:PRESENTED_AT]->(ceremony:AwardCeremony)

	WITH award, ceremony
		ORDER BY ceremony.name DESC

	RETURN
		'AWARD' AS model,
		award.uuid AS uuid,
		award.name AS name,
		award.differentiator AS differentiator,
		COLLECT(
			CASE WHEN ceremony IS NULL
				THEN null
				ELSE ceremony { model: 'AWARD_CEREMONY', .uuid, .name }
			END
		) AS ceremonies
`];
