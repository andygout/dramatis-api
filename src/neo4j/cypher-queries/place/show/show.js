export default () => `
	MATCH (place:Place { uuid: $uuid })

	CALL (place) {
		OPTIONAL MATCH (surPlace:Place)-[:CONTAINS]->(place)
			WHERE surPlace <> place

		WITH surPlace
			ORDER BY surPlace.name

		RETURN
			COLLECT(
				CASE WHEN surPlace IS NULL
					THEN null
					ELSE surPlace { model: 'PLACE', .uuid, .name }
				END
			) AS surPlaces
	}

	CALL (place) {
		OPTIONAL MATCH (place)-[:CONTAINS]->(subPlace:Place)
			WHERE subPlace <> place

		WITH subPlace
			ORDER BY subPlace.name

		RETURN
			COLLECT(
				CASE WHEN subPlace IS NULL
					THEN null
					ELSE subPlace { model: 'PLACE', .uuid, .name }
				END
			) AS subPlaces
	}

	RETURN
		'PLACE' AS model,
		place.uuid AS uuid,
		place.name AS name,
		place.differentiator AS differentiator,
		surPlaces,
		subPlaces
`;
