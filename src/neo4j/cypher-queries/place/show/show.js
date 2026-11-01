export default () => `
	MATCH (place:Place { uuid: $uuid })

	CALL (place) {
		OPTIONAL MATCH (surPlace:Place)
			WHERE surPlace <> place AND
				(
					surPlace.minLatitude <= place.minLatitude AND
					surPlace.maxLatitude >= place.maxLatitude AND (
						(
							surPlace.minLongitude = -180 AND surPlace.maxLongitude = 180
						) OR (
							surPlace.minLongitude <= surPlace.maxLongitude AND
							place.minLongitude <= place.maxLongitude AND
							place.minLongitude >= surPlace.minLongitude AND
							place.maxLongitude <= surPlace.maxLongitude
						) OR (
							(
								surPlace.minLongitude > surPlace.maxLongitude
							) AND (
								(
									place.minLongitude > place.maxLongitude AND
									place.minLongitude >= surPlace.minLongitude AND
									place.maxLongitude <= surPlace.maxLongitude
								) OR (
									(
										place.minLongitude <= place.maxLongitude
									) AND (
										place.minLongitude >= surPlace.minLongitude OR
										place.maxLongitude <= surPlace.maxLongitude
									)
								)
							)
						)
					)
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

	CALL (place) {
		OPTIONAL MATCH (subPlace:Place)
			WHERE subPlace <> place AND
				(
					subPlace.minLatitude >= place.minLatitude AND
					subPlace.maxLatitude <= place.maxLatitude AND (
						(
							place.minLongitude = -180 AND place.maxLongitude = 180
						) OR (
							place.minLongitude <= place.maxLongitude AND
							subPlace.minLongitude <= subPlace.maxLongitude AND
							subPlace.minLongitude >= place.minLongitude AND
							subPlace.maxLongitude <= place.maxLongitude
						) OR (
							(
								place.minLongitude > place.maxLongitude
							) AND (
								(
									subPlace.minLongitude > subPlace.maxLongitude AND
									subPlace.minLongitude >= place.minLongitude AND
									subPlace.maxLongitude <= place.maxLongitude
								) OR (
									(
										subPlace.minLongitude <= subPlace.maxLongitude
									) AND (
										subPlace.minLongitude >= place.minLongitude OR
										subPlace.maxLongitude <= place.maxLongitude
									)
								)
							)
						)
					)
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
