/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "next" }] */

import { production as productionSeedProps } from './model-seed-props';
import { callInstanceMethod, callStaticListMethod } from '../lib/call-class-methods';
import { sendJsonResponse } from '../lib/send-json-response';
import { Production } from '../models';
import { MODELS } from '../utils/constants';

const newRoute = (request, response, next) =>
	sendJsonResponse(response, new Production(productionSeedProps));

const createRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Production(request.body), 'create');

const editRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Production(request.params), 'edit');

const updateRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Production({ ...request.body, ...request.params }), 'update');

const deleteRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Production(request.params), 'delete');

const showRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Production(request.params), 'show');

const listRoute = (request, response, next) =>
	callStaticListMethod(response, next, Production, MODELS.PRODUCTION);

export {
	newRoute,
	createRoute,
	editRoute,
	updateRoute,
	deleteRoute,
	showRoute,
	listRoute
};
