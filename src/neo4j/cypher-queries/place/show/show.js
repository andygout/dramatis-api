export default () => `
	MATCH (place:Place { uuid: $uuid })

	CALL {
		WITH place

		OPTIONAL MATCH (surPlace:Place)
			WHERE surPlace <> place AND
				(
					surPlace.minLatitude <= place.minLatitude
					AND surPlace.maxLatitude >= place.maxLatitude
					AND surPlace.minLongitude <= place.minLongitude
					AND surPlace.maxLongitude >= place.maxLongitude
				)

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

	CALL {
		WITH place

		OPTIONAL MATCH (subPlace:Place)
			WHERE subPlace <> place AND
				(
					subPlace.minLatitude >= place.minLatitude
					AND subPlace.maxLatitude <= place.maxLatitude
					AND subPlace.minLongitude >= place.minLongitude
					AND subPlace.maxLongitude <= place.maxLongitude
				)

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
