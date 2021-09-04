/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "next" }] */

import { callInstanceMethod, callStaticListMethod } from '../lib/call-class-methods';
import { sendJsonResponse } from '../lib/send-json-response';
import { AwardCeremony } from '../models';
import { ACTIONS, MODELS } from '../utils/constants';

const newRoute = (request, response, next) =>
	sendJsonResponse(response, new AwardCeremony());

const createRoute = (request, response, next) =>
	callInstanceMethod(response, next, new AwardCeremony(request.body), ACTIONS.CREATE);

const editRoute = (request, response, next) =>
	callInstanceMethod(response, next, new AwardCeremony(request.params), ACTIONS.EDIT);

const updateRoute = (request, response, next) =>
	callInstanceMethod(response, next, new AwardCeremony({ ...request.body, ...request.params }), ACTIONS.UPDATE);

const deleteRoute = (request, response, next) =>
	callInstanceMethod(response, next, new AwardCeremony(request.params), ACTIONS.DELETE);

const showRoute = (request, response, next) =>
	callInstanceMethod(response, next, new AwardCeremony(request.params), ACTIONS.SHOW);

const listRoute = (request, response, next) =>
	callStaticListMethod(response, next, AwardCeremony, MODELS.AWARD_CEREMONY);

export {
	newRoute,
	createRoute,
	editRoute,
	updateRoute,
	deleteRoute,
	showRoute,
	listRoute
};
