export default () => `
	MATCH (place:Place { uuid: $uuid })

	RETURN
		place.uuid AS uuid,
		place.name AS name,
		place.differentiator AS differentiator,
		place.minLatitude AS minLatitude,
		place.maxLatitude AS maxLatitude,
		place.minLongitude AS minLongitude,
		place.maxLongitude AS maxLongitude
`;
