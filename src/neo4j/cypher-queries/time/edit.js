export default () => `
	MATCH (time:Time { uuid: $uuid })

	RETURN
		time.uuid AS uuid,
		time.name AS name,
		time.differentiator AS differentiator,
		time.fromDate AS fromDate,
		time.toDate AS toDate
`;
