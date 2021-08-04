/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "next" }] */

import { callInstanceMethod, callStaticListMethod } from '../lib/call-class-methods';
import { sendJsonResponse } from '../lib/send-json-response';
import { Award } from '../models';

const newRoute = (request, response, next) =>
	sendJsonResponse(response, new Award());

const createRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Award(request.body), 'create');

const editRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Award(request.params), 'edit');

const updateRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Award({ ...request.body, ...request.params }), 'update');

const deleteRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Award(request.params), 'delete');

const showRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Award(request.params), 'show');

const listRoute = (request, response, next) =>
	callStaticListMethod(response, next, Award, 'award');

export {
	newRoute,
	createRoute,
	editRoute,
	updateRoute,
	deleteRoute,
	showRoute,
	listRoute
};
