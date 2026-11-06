export default () => `
	MATCH (place:Place { uuid: $uuid })

	RETURN
		place.uuid AS uuid,
		place.name AS name,
		place.differentiator AS differentiator,
		place.geometryWkt AS geometryWkt
`;
