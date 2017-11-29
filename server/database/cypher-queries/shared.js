import { getShowQuery as getCharacterShowQuery } from './character';
import { getShowQuery as getPersonShowQuery } from './person';
import {
	getShowQuery as getPlaytextShowQuery,
	getCreateQuery as getPlaytextCreateQuery,
	getEditQuery as getPlaytextEditQuery,
	getUpdateQuery as getPlaytextUpdateQuery
} from './playtext';
import {
	getCreateQuery as getProductionCreateQuery,
	getEditQuery as getProductionEditQuery,
	getUpdateQuery as getProductionUpdateQuery,
	getDeleteQuery as getProductionDeleteQuery,
	getShowQuery as getProductionShowQuery
} from './production';
import { getShowQuery as getTheatreShowQuery } from './theatre';
import capitalise from '../../lib/capitalise';

const getValidateQuery = model => `
	MATCH (n:${capitalise(model)} { name: $name })
		WHERE n.uuid <> $uuid

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

const getCreateQueries = {
	playtext: getPlaytextCreateQuery,
	production: getProductionCreateQuery
};

const getEditQuery = model => `
	MATCH (n:${capitalise(model)} { uuid: $uuid })

	RETURN {
		model: '${model}',
		uuid: n.uuid,
		name: n.name
	} AS instance
`;

const getEditQueries = {
	playtext: getPlaytextEditQuery,
	production: getProductionEditQuery
};

const getUpdateQuery = model => `
	MATCH (n:${capitalise(model)} { uuid: $uuid })
		SET n.name = $name

	RETURN {
		model: '${model}',
		uuid: n.uuid,
		name: n.name
	} AS instance
`;

const getUpdateQueries = {
	playtext: getPlaytextUpdateQuery,
	production: getProductionUpdateQuery
};

const getDeleteQuery = model => `
	MATCH (n:${capitalise(model)} { uuid: $uuid })

	WITH n, n.name AS name
		DETACH DELETE n

	RETURN {
		model: '${model}',
		name: name
	} AS instance
`;

const getDeleteQueries = {
	production: getProductionDeleteQuery
};

const getShowQueries = {
	character: getCharacterShowQuery,
	person: getPersonShowQuery,
	playtext: getPlaytextShowQuery,
	production: getProductionShowQuery,
	theatre: getTheatreShowQuery
};

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
	getCreateQueries,
	getEditQuery,
	getEditQueries,
	getUpdateQuery,
	getUpdateQueries,
	getDeleteQuery,
	getDeleteQueries,
	getShowQueries,
	getListQuery
};
