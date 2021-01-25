const getShowQuery = () => `
	MATCH (company:Company { uuid: $uuid })

	RETURN
		'company' AS model,
		company.uuid AS uuid,
		company.name AS name,
		company.differentiator AS differentiator
`;

export {
	getShowQuery
};
