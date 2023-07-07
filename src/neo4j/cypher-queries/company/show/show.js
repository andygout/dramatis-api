export default () => `
	MATCH (company:Company { uuid: $uuid })

	RETURN
		'COMPANY' AS model,
		company.uuid AS uuid,
		company.name AS name,
		company.differentiator AS differentiator
`;
