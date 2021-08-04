const getShowQuery = () => `
	MATCH (award:Award { uuid: $uuid })
	RETURN
		'award' AS model,
		award.uuid AS uuid,
		award.name AS name,
		award.differentiator AS differentiator
`;

export {
	getShowQuery
};
