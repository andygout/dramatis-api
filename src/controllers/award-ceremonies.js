/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "next" }] */

import { callInstanceMethod, callStaticListMethod } from '../lib/call-class-methods';
import { sendJsonResponse } from '../lib/send-json-response';
import { AwardCeremony } from '../models';
import { MODELS } from '../utils/constants';

const newRoute = (request, response, next) =>
	sendJsonResponse(response, new AwardCeremony());

const createRoute = (request, response, next) =>
	callInstanceMethod(response, next, new AwardCeremony(request.body), 'create');

const editRoute = (request, response, next) =>
	callInstanceMethod(response, next, new AwardCeremony(request.params), 'edit');

const updateRoute = (request, response, next) =>
	callInstanceMethod(response, next, new AwardCeremony({ ...request.body, ...request.params }), 'update');

const deleteRoute = (request, response, next) =>
	callInstanceMethod(response, next, new AwardCeremony(request.params), 'delete');

const showRoute = (request, response, next) =>
	callInstanceMethod(response, next, new AwardCeremony(request.params), 'show');

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
