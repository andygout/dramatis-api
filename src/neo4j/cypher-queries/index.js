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
import {
	getExistenceQuery as getSharedExistenceQuery,
	getDuplicateRecordCountQuery as getSharedDuplicateRecordCountQuery,
	getCreateQuery as getSharedCreateQuery,
	getEditQuery as getSharedEditQuery,
	getUpdateQuery as getSharedUpdateQuery,
	getDeleteQuery as getSharedDeleteQuery,
	getListQuery as getSharedListQuery
} from './shared';
import {
	getCreateQuery as getVenueCreateQuery,
	getEditQuery as getVenueEditQuery,
	getUpdateQuery as getVenueUpdateQuery,
	getShowQuery as getVenueShowQuery,
	getListQuery as getVenueListQuery
} from './venue';
import { MODELS } from '../../utils/constants';

const getCreateQueries = {
	[MODELS.AWARD_CEREMONY]: getAwardCeremonyCreateQuery,
	[MODELS.MATERIAL]: getMaterialCreateQuery,
	[MODELS.PRODUCTION]: getProductionCreateQuery,
	[MODELS.VENUE]: getVenueCreateQuery
};

const getEditQueries = {
	[MODELS.AWARD_CEREMONY]: getAwardCeremonyEditQuery,
	[MODELS.MATERIAL]: getMaterialEditQuery,
	[MODELS.PRODUCTION]: getProductionEditQuery,
	[MODELS.VENUE]: getVenueEditQuery
};

const getUpdateQueries = {
	[MODELS.AWARD_CEREMONY]: getAwardCeremonyUpdateQuery,
	[MODELS.MATERIAL]: getMaterialUpdateQuery,
	[MODELS.PRODUCTION]: getProductionUpdateQuery,
	[MODELS.VENUE]: getVenueUpdateQuery
};

const getShowQueries = {
	[MODELS.AWARD]: getAwardShowQuery,
	[MODELS.AWARD_CEREMONY]: getAwardCeremonyShowQuery,
	[MODELS.CHARACTER]: getCharacterShowQuery,
	[MODELS.COMPANY]: getCompanyShowQuery,
	[MODELS.PERSON]: getPersonShowQuery,
	[MODELS.MATERIAL]: getMaterialShowQuery,
	[MODELS.PRODUCTION]: getProductionShowQuery,
	[MODELS.VENUE]: getVenueShowQuery
};

const getListQueries = {
	[MODELS.AWARD_CEREMONY]: getAwardCeremonyListQuery,
	[MODELS.MATERIAL]: getMaterialListQuery,
	[MODELS.PRODUCTION]: getProductionListQuery,
	[MODELS.VENUE]: getVenueListQuery
};

const sharedQueries = {
	getExistenceQuery: getSharedExistenceQuery,
	getDuplicateRecordCountQuery: getSharedDuplicateRecordCountQuery,
	getCreateQuery: getSharedCreateQuery,
	getEditQuery: getSharedEditQuery,
	getUpdateQuery: getSharedUpdateQuery,
	getDeleteQuery: getSharedDeleteQuery,
	getListQuery: getSharedListQuery
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
