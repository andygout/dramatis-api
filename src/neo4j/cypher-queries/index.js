import { getShowQuery as getAwardShowQuery } from './award';
import {
	getAwardContextualDuplicateRecordCountQuery,
	getCreateQuery as getAwardCeremonyCreateQuery,
	getEditQuery as getAwardCeremonyEditQuery,
	getUpdateQuery as getAwardCeremonyUpdateQuery,
	getShowQuery as getAwardCeremonyShowQuery,
	getListQuery as getAwardCeremonyListQuery
} from './award-ceremony';
import { getShowQuery as getCharacterShowQuery } from './character';
import { getShowQuery as getCompanyShowQuery } from './company';
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
	getCreateQuery as getVenueCreateQuery,
	getEditQuery as getVenueEditQuery,
	getUpdateQuery as getVenueUpdateQuery,
	getShowQuery as getVenueShowQuery,
	getListQuery as getVenueListQuery
} from './venue';

const getCreateQueries = {
	awardCeremony: getAwardCeremonyCreateQuery,
	material: getMaterialCreateQuery,
	production: getProductionCreateQuery,
	venue: getVenueCreateQuery
};

const getEditQueries = {
	awardCeremony: getAwardCeremonyEditQuery,
	material: getMaterialEditQuery,
	production: getProductionEditQuery,
	venue: getVenueEditQuery
};

const getUpdateQueries = {
	awardCeremony: getAwardCeremonyUpdateQuery,
	material: getMaterialUpdateQuery,
	production: getProductionUpdateQuery,
	venue: getVenueUpdateQuery
};

const getShowQueries = {
	award: getAwardShowQuery,
	awardCeremony: getAwardCeremonyShowQuery,
	character: getCharacterShowQuery,
	company: getCompanyShowQuery,
	person: getPersonShowQuery,
	material: getMaterialShowQuery,
	production: getProductionShowQuery,
	venue: getVenueShowQuery
};

const getListQueries = {
	awardCeremony: getAwardCeremonyListQuery,
	material: getMaterialListQuery,
	production: getProductionListQuery,
	venue: getVenueListQuery
};

export {
	getAwardContextualDuplicateRecordCountQuery,
	getCreateQueries,
	getEditQueries,
	getUpdateQueries,
	getShowQueries,
	getListQueries,
	sharedQueries
};
