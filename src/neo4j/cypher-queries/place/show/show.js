export default () => `
	MATCH (place:Place { uuid: $uuid })

	RETURN
		'PLACE' AS model,
		place.uuid AS uuid,
		place.name AS name,
		place.differentiator AS differentiator
`;
