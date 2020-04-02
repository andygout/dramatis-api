/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "next" }] */

import { callInstanceMethod, callStaticListMethod } from '../lib/call-class-methods';
import { renderJson } from '../lib/render-json';
import { Theatre } from '../models';

const newRoute = (request, response, next) =>
	renderJson(response, new Theatre());

const createRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Theatre(request.body), 'create');

const editRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Theatre(request.params), 'edit');

const updateRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Theatre({ ...request.body, ...request.params }), 'update');

const deleteRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Theatre(request.params), 'delete');

const showRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Theatre(request.params), 'show');

const listRoute = (request, response, next) =>
	callStaticListMethod(response, next, Theatre, 'theatre');

export {
	newRoute,
	createRoute,
	editRoute,
	updateRoute,
	deleteRoute,
	showRoute,
	listRoute
};
