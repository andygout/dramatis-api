import capitalise from '../../lib/capitalise';

const getValidateQuery = (model, uuid) => `
	MATCH (n:${capitalise(model)} { name: $name })
		${uuid ? 'WHERE n.uuid <> $uuid' : ''}

	RETURN SIGN(COUNT(n)) AS instanceCount
`;

const getCreateQuery = model => `
	CREATE (n:${capitalise(model)} { uuid: $uuid, name: $name })

	RETURN {
		model: '${model}',
		uuid: n.uuid,
		name: n.name
	} AS instance
`;

const getEditQuery = model => `
	MATCH (n:${capitalise(model)} { uuid: $uuid })

	RETURN {
		model: '${model}',
		uuid: n.uuid,
		name: n.name
	} AS instance
`;

const getUpdateQuery = model => `
	MATCH (n:${capitalise(model)} { uuid: $uuid })
		SET n.name = $name

	RETURN {
		model: '${model}',
		uuid: n.uuid,
		name: n.name
	} AS instance
`;

const getDeleteQuery = model => `
	MATCH (n:${capitalise(model)} { uuid: $uuid })

	WITH n, n.name AS name
		DETACH DELETE n

	RETURN {
		model: '${model}',
		name: name
	} AS instance
`;

const getListQuery = model => {

	const theatreRelationship = (model === 'production') ? '-[:PLAYS_AT]->(t:Theatre)' : '';

	const theatreObject = (model === 'production') ? ', theatre: { model: \'theatre\', uuid: t.uuid, name: t.name }' : '';

	return `
		MATCH (n:${capitalise(model)})${theatreRelationship}

		RETURN COLLECT({
			model: '${model}',
			uuid: n.uuid,
			name: n.name
			${theatreObject}
		}) AS instances
	`;

};

export {
	getValidateQuery,
	getCreateQuery,
	getEditQuery,
	getUpdateQuery,
	getDeleteQuery,
	getListQuery
};
