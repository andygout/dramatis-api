export default (model) => `
	MATCH (time:Time)

	RETURN
		'TIME' AS model,
		time.uuid AS uuid,
		time.name AS name

	ORDER BY
		(time.toDate IS NULL OR time.fromDate IS NULL),
		time.toDate DESC,
		time.fromDate,
		time.name

	LIMIT 1000
`;
