import { getShowQueries as getAwardShowQueries } from './award';
import {
	getCreateQuery as getAwardCeremonyCreateQuery,
	getEditQuery as getAwardCeremonyEditQuery,
	getUpdateQuery as getAwardCeremonyUpdateQuery,
	getShowQueries as getAwardCeremonyShowQueries,
	getListQuery as getAwardCeremonyListQuery
} from './award-ceremony';
import { getShowQueries as getCharacterShowQueries } from './character';
import { getShowQueries as getCompanyShowQueries } from './company';
import {
	getCreateQuery as getFestivalCreateQuery,
	getEditQuery as getFestivalEditQuery,
	getUpdateQuery as getFestivalUpdateQuery,
	getShowQueries as getFestivalShowQueries,
	getListQuery as getFestivalListQuery
} from './festival';
import { getShowQueries as getFestivalSeriesShowQueries } from './festival-series';
import {
	getCreateQuery as getMaterialCreateQuery,
	getEditQuery as getMaterialEditQuery,
	getUpdateQuery as getMaterialUpdateQuery,
	getShowQueries as getMaterialShowQueries,
	getListQuery as getMaterialListQuery
} from './material';
import { getShowQueries as getPersonShowQueries } from './person';
import {
	getCreateQuery as getProductionCreateQuery,
	getEditQuery as getProductionEditQuery,
	getUpdateQuery as getProductionUpdateQuery,
	getShowQueries as getProductionShowQueries,
	getListQuery as getProductionListQuery
} from './production';
import { getSearchQuery } from './search';
import { getShowQueries as getSeasonShowQueries } from './season';
import {
	getCreateQuery as getSharedCreateQuery,
	getEditQuery as getSharedEditQuery,
	getUpdateQuery as getSharedUpdateQuery,
	getDeleteQuery as getSharedDeleteQuery,
	getListQuery as getSharedListQuery
} from './shared';
import {
	getAwardContextualDuplicateRecordCheckQuery,
	getDuplicateRecordCheckQuery,
	getExistenceCheckQuery,
	getOriginalVersionMaterialChecksQuery,
	getSourceMaterialChecksQuery,
	getSubMaterialChecksQuery,
	getSubProductionChecksQuery,
	getSubVenueChecksQuery
} from './validation';
import {
	getCreateQuery as getVenueCreateQuery,
	getEditQuery as getVenueEditQuery,
	getUpdateQuery as getVenueUpdateQuery,
	getShowQueries as getVenueShowQueries,
	getListQuery as getVenueListQuery
} from './venue';
import { MODELS } from '../../utils/constants';

const getCreateQueries = {
	[MODELS.AWARD_CEREMONY]: getAwardCeremonyCreateQuery,
	[MODELS.FESTIVAL]: getFestivalCreateQuery,
	[MODELS.MATERIAL]: getMaterialCreateQuery,
	[MODELS.PRODUCTION]: getProductionCreateQuery,
	[MODELS.VENUE]: getVenueCreateQuery
};

const getEditQueries = {
	[MODELS.AWARD_CEREMONY]: getAwardCeremonyEditQuery,
	[MODELS.FESTIVAL]: getFestivalEditQuery,
	[MODELS.MATERIAL]: getMaterialEditQuery,
	[MODELS.PRODUCTION]: getProductionEditQuery,
	[MODELS.VENUE]: getVenueEditQuery
};

const getUpdateQueries = {
	[MODELS.AWARD_CEREMONY]: getAwardCeremonyUpdateQuery,
	[MODELS.FESTIVAL]: getFestivalUpdateQuery,
	[MODELS.MATERIAL]: getMaterialUpdateQuery,
	[MODELS.PRODUCTION]: getProductionUpdateQuery,
	[MODELS.VENUE]: getVenueUpdateQuery
};

const getShowQueries = {
	[MODELS.AWARD]: getAwardShowQueries,
	[MODELS.AWARD_CEREMONY]: getAwardCeremonyShowQueries,
	[MODELS.CHARACTER]: getCharacterShowQueries,
	[MODELS.COMPANY]: getCompanyShowQueries,
	[MODELS.FESTIVAL]: getFestivalShowQueries,
	[MODELS.FESTIVAL_SERIES]: getFestivalSeriesShowQueries,
	[MODELS.MATERIAL]: getMaterialShowQueries,
	[MODELS.PERSON]: getPersonShowQueries,
	[MODELS.PRODUCTION]: getProductionShowQueries,
	[MODELS.SEASON]: getSeasonShowQueries,
	[MODELS.VENUE]: getVenueShowQueries
};

const getListQueries = {
	[MODELS.AWARD_CEREMONY]: getAwardCeremonyListQuery,
	[MODELS.FESTIVAL]: getFestivalListQuery,
	[MODELS.MATERIAL]: getMaterialListQuery,
	[MODELS.PRODUCTION]: getProductionListQuery,
	[MODELS.VENUE]: getVenueListQuery
};

const sharedQueries = {
	getCreateQuery: getSharedCreateQuery,
	getEditQuery: getSharedEditQuery,
	getUpdateQuery: getSharedUpdateQuery,
	getDeleteQuery: getSharedDeleteQuery,
	getListQuery: getSharedListQuery
};

const validationQueries = {
	getAwardContextualDuplicateRecordCheckQuery,
	getDuplicateRecordCheckQuery,
	getExistenceCheckQuery,
	getOriginalVersionMaterialChecksQuery,
	getSourceMaterialChecksQuery,
	getSubMaterialChecksQuery,
	getSubProductionChecksQuery,
	getSubVenueChecksQuery
};

const searchQueries = {
	getSearchQuery
};

export {
	getCreateQueries,
	getEditQueries,
	getUpdateQueries,
	getShowQueries,
	getListQueries,
	searchQueries,
	sharedQueries,
	validationQueries
};
