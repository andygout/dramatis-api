const getCreateUpdateQuery = action => {

	const createUpdateQueryOpeningMap = {
		create: 'CREATE (theatre:Theatre { uuid: $uuid, name: $name, differentiator: $differentiator })',
		update: `
			MATCH (theatre:Theatre { uuid: $uuid })

			OPTIONAL MATCH (theatre)-[relationship:INCLUDES_SUB_THEATRE]->(:Theatre)

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

			FOREACH (item IN CASE subTheatreParam WHEN NULL THEN [] ELSE [1] END |
				MERGE (subTheatre:Theatre {
					uuid: COALESCE(existingTheatre.uuid, subTheatreParam.uuid),
					name: subTheatreParam.name
				})
					ON CREATE SET subTheatre.differentiator = subTheatreParam.differentiator

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
				ELSE subTheatre { .name, .differentiator }
			END
		) + [{}] AS subTheatres
`;

const getUpdateQuery = () => getCreateUpdateQuery('update');

const getShowQuery = () => `
	MATCH (theatre:Theatre { uuid: $uuid })

	OPTIONAL MATCH (surTheatre:Theatre)-[:INCLUDES_SUB_THEATRE]->(theatre)

	WITH theatre,
		CASE surTheatre WHEN NULL
			THEN null
			ELSE surTheatre { model: 'theatre', .uuid, .name }
		END AS surTheatre

	OPTIONAL MATCH (theatre)-[subTheatreRel:INCLUDES_SUB_THEATRE]->(subTheatre:Theatre)

	WITH theatre, surTheatre, subTheatre
		ORDER BY subTheatreRel.position

	WITH theatre, surTheatre,
		COLLECT(
			CASE subTheatre WHEN NULL
				THEN null
				ELSE subTheatre { model: 'theatre', .uuid, .name }
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
		surTheatre,
		subTheatres,
		COLLECT(
			CASE production WHEN NULL
				THEN null
				ELSE production {
					model: 'production',
					.uuid,
					.name,
					subTheatre: CASE theatreToProductionPathLength WHEN 2
						THEN subTheatreForProduction { model: 'theatre', .uuid, .name }
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
				ELSE subTheatre { model: 'theatre', .uuid, .name }
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
