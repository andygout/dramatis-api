import { getShowQuery as getCharacterShowQuery } from './character';
import {
	getCreateQuery as getMaterialCreateQuery,
	getEditQuery as getMaterialEditQuery,
	getUpdateQuery as getMaterialUpdateQuery,
	getShowQuery as getMaterialShowQuery,
	getListQuery as getMaterialListQuery
} from './material';
import { getShowQuery as getPersonShowQuery } from './person';
import {
	getCreateQuery as getProductionCreateQuery,
	getEditQuery as getProductionEditQuery,
	getUpdateQuery as getProductionUpdateQuery,
	getShowQuery as getProductionShowQuery,
	getListQuery as getProductionListQuery
} from './production';
import * as sharedQueries from './shared';
import {
	getCreateQuery as getTheatreCreateQuery,
	getEditQuery as getTheatreEditQuery,
	getUpdateQuery as getTheatreUpdateQuery,
	getShowQuery as getTheatreShowQuery,
	getListQuery as getTheatreListQuery
} from './theatre';

const getCreateQueries = {
	material: getMaterialCreateQuery,
	production: getProductionCreateQuery,
	theatre: getTheatreCreateQuery
};

const getEditQueries = {
	material: getMaterialEditQuery,
	production: getProductionEditQuery,
	theatre: getTheatreEditQuery
};

const getUpdateQueries = {
	material: getMaterialUpdateQuery,
	production: getProductionUpdateQuery,
	theatre: getTheatreUpdateQuery
};

const getShowQueries = {
	character: getCharacterShowQuery,
	person: getPersonShowQuery,
	material: getMaterialShowQuery,
	production: getProductionShowQuery,
	theatre: getTheatreShowQuery
};

const getListQueries = {
	material: getMaterialListQuery,
	production: getProductionListQuery,
	theatre: getTheatreListQuery
};

export {
	getCreateQueries,
	getEditQueries,
	getUpdateQueries,
	getShowQueries,
	getListQueries,
	sharedQueries
};
