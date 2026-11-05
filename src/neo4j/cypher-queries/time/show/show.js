export default () => `
	MATCH (time:Time { uuid: $uuid })

	CALL (time) {
		OPTIONAL MATCH (surTime:Time)-[:CONTAINS]->(time)
			WHERE surTime <> time

		WITH surTime
			ORDER BY surTime.toDate DESC, surTime.fromDate

		RETURN
			COLLECT(
				CASE WHEN surTime IS NULL
					THEN null
					ELSE surTime { model: 'TIME', .uuid, .name }
				END
			) AS surTimes
	}

	CALL (time) {
		OPTIONAL MATCH (time)-[:CONTAINS]->(subTime:Time)
			WHERE subTime <> time

		WITH subTime
			ORDER BY subTime.toDate DESC, subTime.fromDate

		RETURN
			COLLECT(
				CASE WHEN subTime IS NULL
					THEN null
					ELSE subTime { model: 'TIME', .uuid, .name }
				END
			) AS subTimes
	}

	RETURN
		'TIME' AS model,
		time.uuid AS uuid,
		time.name AS name,
		time.differentiator AS differentiator,
		surTimes,
		subTimes
`;
