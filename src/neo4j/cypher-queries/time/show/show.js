export default () => `
	MATCH (time:Time { uuid: $uuid })

	RETURN
		'TIME' AS model,
		time.uuid AS uuid,
		time.name AS name,
		time.differentiator AS differentiator
`;
