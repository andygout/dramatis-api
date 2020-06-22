/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "next" }] */

import { callInstanceMethod, callStaticListMethod } from '../lib/call-class-methods';
import { sendJsonResponse } from '../lib/send-json-response';
import { Character } from '../models';

const newRoute = (request, response, next) =>
	sendJsonResponse(response, new Character());

const createRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Character(request.body), 'create');

const editRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Character(request.params), 'edit');

const updateRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Character({ ...request.body, ...request.params }), 'update');

const deleteRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Character(request.params), 'delete');

const showRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Character(request.params), 'show');

const listRoute = (request, response, next) =>
	callStaticListMethod(response, next, Character, 'character');

export {
	newRoute,
	createRoute,
	editRoute,
	updateRoute,
	deleteRoute,
	showRoute,
	listRoute
};
