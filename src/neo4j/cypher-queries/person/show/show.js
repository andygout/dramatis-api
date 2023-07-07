export default () => `
	MATCH (person:Person { uuid: $uuid })

	RETURN
		'PERSON' AS model,
		person.uuid AS uuid,
		person.name AS name,
		person.differentiator AS differentiator
`;
