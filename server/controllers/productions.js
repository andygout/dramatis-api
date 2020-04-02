/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "next" }] */

import { callInstanceMethod, callStaticListMethod } from '../lib/call-class-methods';
import { renderJson } from '../lib/render-json';
import { Production } from '../models';

const newRoute = (request, response, next) =>
	renderJson(response, new Production());

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
	callStaticListMethod(response, next, Production, 'production');

export {
	newRoute,
	createRoute,
	editRoute,
	updateRoute,
	deleteRoute,
	showRoute,
	listRoute
};
