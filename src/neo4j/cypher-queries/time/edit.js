export default () => `
	MATCH (time:Time { uuid: $uuid })

	RETURN
		time.uuid AS uuid,
		time.name AS name,
		time.differentiator AS differentiator,
		toString(time.fromDate) AS fromDate,
		toString(time.toDate) AS toDate
`;
