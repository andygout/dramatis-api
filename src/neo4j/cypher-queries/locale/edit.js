export default () => `
	MATCH (locale:Locale { uuid: $uuid })

	OPTIONAL MATCH (locale)<-[:CONTAINS]-(surLocale:Locale)

	RETURN
		locale.uuid AS uuid,
		locale.name AS name,
		locale.differentiator AS differentiator,
		{
			name: COALESCE(surLocale.name, ''),
			differentiator: COALESCE(surLocale.differentiator, '')
		} AS surLocale
`;
