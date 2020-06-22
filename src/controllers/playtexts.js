/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "next" }] */

import { playtext as playtextTemplateProps } from './model-template-props';
import { callInstanceMethod, callStaticListMethod } from '../lib/call-class-methods';
import { sendJsonResponse } from '../lib/send-json-response';
import { Playtext } from '../models';

const newRoute = (request, response, next) =>
	sendJsonResponse(response, new Playtext(playtextTemplateProps));

const createRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Playtext(request.body), 'create');

const editRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Playtext(request.params), 'edit');

const updateRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Playtext({ ...request.body, ...request.params }), 'update');

const deleteRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Playtext(request.params), 'delete');

const showRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Playtext(request.params), 'show');

const listRoute = (request, response, next) =>
	callStaticListMethod(response, next, Playtext, 'playtext');

export {
	newRoute,
	createRoute,
	editRoute,
	updateRoute,
	deleteRoute,
	showRoute,
	listRoute
};
