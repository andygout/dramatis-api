/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "next" }] */

import { callInstanceMethod, callStaticListMethod } from '../lib/call-class-methods';
import { sendJsonResponse } from '../lib/send-json-response';
import { Person } from '../models';
import { MODELS } from '../utils/constants';

const newRoute = (request, response, next) =>
	sendJsonResponse(response, new Person());

const createRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Person(request.body), 'create');

const editRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Person(request.params), 'edit');

const updateRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Person({ ...request.body, ...request.params }), 'update');

const deleteRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Person(request.params), 'delete');

const showRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Person(request.params), 'show');

const listRoute = (request, response, next) =>
	callStaticListMethod(response, next, Person, MODELS.PERSON);

export {
	newRoute,
	createRoute,
	editRoute,
	updateRoute,
	deleteRoute,
	showRoute,
	listRoute
};
