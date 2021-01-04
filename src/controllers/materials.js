/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "next" }] */

import { material as materialSeedProps } from './model-seed-props';
import { callInstanceMethod, callStaticListMethod } from '../lib/call-class-methods';
import { sendJsonResponse } from '../lib/send-json-response';
import { Material } from '../models';

const newRoute = (request, response, next) =>
	sendJsonResponse(response, new Material(materialSeedProps));

const createRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Material(request.body), 'create');

const editRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Material(request.params), 'edit');

const updateRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Material({ ...request.body, ...request.params }), 'update');

const deleteRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Material(request.params), 'delete');

const showRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Material(request.params), 'show');

const listRoute = (request, response, next) =>
	callStaticListMethod(response, next, Material, 'material');

export {
	newRoute,
	createRoute,
	editRoute,
	updateRoute,
	deleteRoute,
	showRoute,
	listRoute
};
