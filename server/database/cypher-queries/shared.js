import { getShowQuery as getCharacterShowQuery } from './character';
import { getShowQuery as getPersonShowQuery } from './person';
import { getShowQuery as getTheatreShowQuery } from './theatre';
import capitalise from '../../lib/capitalise';
import pluralise from '../../lib/pluralise';

const getValidateUpdateQuery = model => `
	MATCH (n:${capitalise(model)} { name: $name })
		WHERE n.uuid <> $uuid

	RETURN SIGN(COUNT(n)) AS instanceCount
`;

const getEditQuery = model => `
	MATCH (n:${capitalise(model)} { uuid: $uuid })

	RETURN {
		model: '${model}',
		uuid: n.uuid,
		name: n.name
	} AS ${model}
`;

const getUpdateQuery = model => `
	MATCH (n:${capitalise(model)} { uuid: $uuid })
		SET n.name = $name

	RETURN {
		model: '${model}',
		uuid: n.uuid,
		name: n.name
	} AS ${model}
`;

const getDeleteQuery = model => `
	MATCH (n:${capitalise(model)} { uuid: $uuid })

	WITH n, n.name AS name
		DETACH DELETE n

	RETURN {
		model: '${model}',
		name: name
	} AS ${model}
`;

const getShowQueries = {
	character: getCharacterShowQuery,
	person: getPersonShowQuery,
	theatre: getTheatreShowQuery
};

const getListQuery = model => {

	const theatreRelationship = (model === 'production') ? '-[:PLAYS_AT]->(t:Theatre)' : '';

	const theatreObject = (model === 'production') ? ", theatre: { model: 'theatre', uuid: t.uuid, name: t.name }" : '';

	return `
		MATCH (n:${capitalise(model)})${theatreRelationship}

		RETURN COLLECT({
			model: '${model}',
			uuid: n.uuid,
			name: n.name
			${theatreObject}
		}) AS ${pluralise(model)}
	`;

};

export {
	getValidateUpdateQuery,
	getEditQuery,
	getUpdateQuery,
	getDeleteQuery,
	getShowQueries,
	getListQuery
};
