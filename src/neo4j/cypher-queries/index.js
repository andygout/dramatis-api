import { getShowQuery as getCharacterShowQuery } from './character';
import { getShowQuery as getPersonShowQuery } from './person';
import {
	getCreateQuery as getPlaytextCreateQuery,
	getEditQuery as getPlaytextEditQuery,
	getUpdateQuery as getPlaytextUpdateQuery,
	getShowQuery as getPlaytextShowQuery,
	getListQuery as getPlaytextListQuery
} from './playtext';
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
	playtext: getPlaytextCreateQuery,
	production: getProductionCreateQuery,
	theatre: getTheatreCreateQuery
};

const getEditQueries = {
	playtext: getPlaytextEditQuery,
	production: getProductionEditQuery,
	theatre: getTheatreEditQuery
};

const getUpdateQueries = {
	playtext: getPlaytextUpdateQuery,
	production: getProductionUpdateQuery,
	theatre: getTheatreUpdateQuery
};

const getShowQueries = {
	character: getCharacterShowQuery,
	person: getPersonShowQuery,
	playtext: getPlaytextShowQuery,
	production: getProductionShowQuery,
	theatre: getTheatreShowQuery
};

const getListQueries = {
	playtext: getPlaytextListQuery,
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
