import { capitalise } from '../../lib/strings';

const getExistenceQuery = model => `
	MATCH (n:${capitalise(model)} { uuid: $uuid })

	RETURN n
`;

const getDuplicateNameCountQuery = (model, uuid) => `
	MATCH (n:${capitalise(model)} { name: $name })
		${uuid
			? 'WHERE n.uuid <> $uuid'
			: ''
		}

	RETURN SIGN(COUNT(n)) AS instanceCount
`;

const getCreateQuery = model => `
	CREATE (n:${capitalise(model)} { uuid: $uuid, name: $name })

	WITH n

	${getEditQuery(model)}
`;

const getEditQuery = model => `
	MATCH (n:${capitalise(model)} { uuid: $uuid })

	RETURN
		'${model}' AS model,
		n.uuid AS uuid,
		n.name AS name
`;

const getUpdateQuery = model => `
	MATCH (n:${capitalise(model)} { uuid: $uuid })
		SET n.name = $name

	WITH n

	${getEditQuery(model)}
`;

const getDeleteQuery = model => `
	MATCH (n:${capitalise(model)} { uuid: $uuid })

	WITH n, n.name AS name

	DETACH DELETE n

	RETURN
		'${model}' AS model,
		name
`;

const getListQuery = model => {

	const theatreRelationship = (model === 'production')
		? 'OPTIONAL MATCH (n)-[:PLAYS_AT]->(t:Theatre)'
		: '';

	const theatreObject = (model === 'production')
		? ', CASE WHEN t IS NULL THEN null ELSE { model: \'theatre\', uuid: t.uuid, name: t.name } END AS theatre'
		: '';

	return `
		MATCH (n:${capitalise(model)})

		${theatreRelationship}

		RETURN
			'${model}' AS model,
			n.uuid AS uuid,
			n.name AS name
			${theatreObject}

		LIMIT 100
	`;

};

export {
	getExistenceQuery,
	getDuplicateNameCountQuery,
	getCreateQuery,
	getEditQuery,
	getUpdateQuery,
	getDeleteQuery,
	getListQuery
};
