const getCreateUpdateQuery = action => {

	const createUpdateQueryOpeningMap = {
		create: 'CREATE (theatre:Theatre { uuid: $uuid, name: $name, differentiator: $differentiator })',
		update: `
			MATCH (theatre:Theatre { uuid: $uuid })

			OPTIONAL MATCH (theatre)-[relationship:INCLUDES_SUB_THEATRE]-(:Theatre)

			DELETE relationship

			WITH DISTINCT theatre

			SET
				theatre.name = $name,
				theatre.differentiator = $differentiator
		`
	};

	return `
		${createUpdateQueryOpeningMap[action]}

		WITH theatre

		UNWIND (CASE $subTheatres WHEN [] THEN [null] ELSE $subTheatres END) AS subTheatreParam

			OPTIONAL MATCH (existingTheatre:Theatre { name: subTheatreParam.name })
				WHERE
					(subTheatreParam.differentiator IS NULL AND existingTheatre.differentiator IS NULL) OR
					(subTheatreParam.differentiator = existingTheatre.differentiator)

			WITH
				theatre,
				subTheatreParam,
				CASE existingTheatre WHEN NULL
					THEN {
						uuid: subTheatreParam.uuid,
						name: subTheatreParam.name,
						differentiator: subTheatreParam.differentiator
					}
					ELSE existingTheatre
				END AS subTheatreProps

			FOREACH (item IN CASE subTheatreParam WHEN NULL THEN [] ELSE [1] END |
				MERGE (subTheatre:Theatre { uuid: subTheatreProps.uuid, name: subTheatreProps.name })
					ON CREATE SET subTheatre.differentiator = subTheatreProps.differentiator

				CREATE (theatre)-[:INCLUDES_SUB_THEATRE { position: subTheatreParam.position }]->(subTheatre)
			)

		WITH DISTINCT theatre

		${getEditQuery()}
	`;

};

const getCreateQuery = () => getCreateUpdateQuery('create');

const getEditQuery = () => `
	MATCH (theatre:Theatre { uuid: $uuid })

	OPTIONAL MATCH (theatre)-[subTheatreRel:INCLUDES_SUB_THEATRE]->(subTheatre:Theatre)

	WITH theatre, subTheatreRel, subTheatre
		ORDER BY subTheatreRel.position

	RETURN
		'theatre' AS model,
		theatre.uuid AS uuid,
		theatre.name AS name,
		theatre.differentiator AS differentiator,
		COLLECT(
			CASE subTheatre WHEN NULL
				THEN null
				ELSE {
					name: subTheatre.name,
					differentiator: subTheatre.differentiator
				}
			END
		) + [{}] AS subTheatres
`;

const getUpdateQuery = () => getCreateUpdateQuery('update');

const getShowQuery = () => `
	MATCH (theatre:Theatre { uuid: $uuid })

	OPTIONAL MATCH (surTheatre:Theatre)-[:INCLUDES_SUB_THEATRE]->(theatre)

	OPTIONAL MATCH (theatre)-[subTheatreRel:INCLUDES_SUB_THEATRE]->(subTheatre:Theatre)

	WITH theatre, surTheatre, subTheatre
		ORDER BY subTheatreRel.position

	WITH theatre, surTheatre,
		COLLECT(
			CASE subTheatre WHEN NULL
				THEN null
				ELSE { model: 'theatre', uuid: subTheatre.uuid, name: subTheatre.name }
			END
		) AS subTheatres

	OPTIONAL MATCH path=
		(theatre)-[:INCLUDES_SUB_THEATRE*0..1]->(subTheatreForProduction:Theatre)<-[:PLAYS_AT]-(production:Production)

	WITH
		theatre,
		surTheatre,
		subTheatres,
		subTheatreForProduction,
		LENGTH(path) AS theatreToProductionPathLength,
		production
		ORDER BY production.name

	RETURN
		'theatre' AS model,
		theatre.uuid AS uuid,
		theatre.name AS name,
		theatre.differentiator AS differentiator,
		CASE surTheatre WHEN NULL
			THEN null
			ELSE { model: 'theatre', uuid: surTheatre.uuid, name: surTheatre.name }
		END AS surTheatre,
		subTheatres,
		COLLECT(
			CASE production WHEN NULL
				THEN null
				ELSE {
					model: 'production',
					uuid: production.uuid,
					name: production.name,
					subTheatre: CASE theatreToProductionPathLength WHEN 2
						THEN {
							model: 'theatre',
							uuid: subTheatreForProduction.uuid,
							name: subTheatreForProduction.name
						}
						ELSE null
					END
				}
			END
		) AS productions
`;

const getListQuery = () => `
	MATCH (theatre:Theatre)
		WHERE NOT (:Theatre)-[:INCLUDES_SUB_THEATRE]->(theatre)

	OPTIONAL MATCH (theatre)-[subTheatreRel:INCLUDES_SUB_THEATRE]->(subTheatre:Theatre)

	WITH theatre, subTheatre
		ORDER BY subTheatreRel.position

	RETURN
		'theatre' AS model,
		theatre.uuid AS uuid,
		theatre.name AS name,
		COLLECT(
			CASE subTheatre WHEN NULL
				THEN null
				ELSE {
					model: 'theatre',
					uuid: subTheatre.uuid,
					name: subTheatre.name
				}
			END
		) AS subTheatres

	ORDER BY theatre.name

	LIMIT 100
`;

export {
	getCreateQuery,
	getEditQuery,
	getUpdateQuery,
	getShowQuery,
	getListQuery
};
