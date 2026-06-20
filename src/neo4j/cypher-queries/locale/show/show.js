export default () => `
	MATCH (locale:Locale { uuid: $uuid })

	RETURN
		'LOCALE' AS model,
		locale.uuid AS uuid,
		locale.name AS name,
		locale.differentiator AS differentiator
`;
