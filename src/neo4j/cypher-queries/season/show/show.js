export default () => `
	MATCH (season:Season { uuid: $uuid })

	RETURN
		'SEASON' AS model,
		season.uuid AS uuid,
		season.name AS name,
		season.differentiator AS differentiator
`;
