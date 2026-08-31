export default () => `
	MATCH (time:Time { uuid: $uuid })

	CALL {
		WITH time

		OPTIONAL MATCH (surTime:Time)
			WHERE surTime <> time AND
				(
					surTime.fromDate <= time.fromDate AND
					surTime.toDate >= time.toDate
				)

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

	CALL {
		WITH time

		OPTIONAL MATCH (subTime:Time)
			WHERE subTime <> time AND
				(
					subTime.fromDate >= time.fromDate AND
					subTime.toDate <= time.toDate
				)

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
