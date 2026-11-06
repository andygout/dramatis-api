export default () => `
	OPTIONAL MATCH (place:Place { uuid: $uuid })

	WITH
		place,
		place.name AS name,
		place.differentiator AS differentiator,
		true AS isDeleted,
		[] AS associatedModels

	CALL spatial.removeNode('place-geometries', place) YIELD nodeId

	DETACH DELETE place

	RETURN
		name,
		differentiator
`;
