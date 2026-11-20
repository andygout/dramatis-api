export default () => `
	MATCH (place:Place { uuid: $uuid })

	OPTIONAL MATCH (place)<-[:CONTAINS]-(surPlace:Place)

	RETURN
		place.uuid AS uuid,
		place.name AS name,
		place.differentiator AS differentiator,
		{
			name: COALESCE(surPlace.name, ''),
			differentiator: COALESCE(surPlace.differentiator, '')
		} AS surPlace
`;
