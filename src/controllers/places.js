/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "next" }] */

import { callInstanceMethod, callStaticListMethod } from '../lib/call-class-methods.js';
import sendJsonResponse from '../lib/send-json-response.js';
import { Place } from '../models/index.js';
import { ACTIONS, MODELS } from '../utils/constants.js';

const newRoute = (request, response, next) => sendJsonResponse(response, new Place());

const createRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Place(request.body), ACTIONS.CREATE);

const editRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Place(request.params), ACTIONS.EDIT);

const updateRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Place({ ...request.body, ...request.params }), ACTIONS.UPDATE);

const deleteRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Place(request.params), ACTIONS.DELETE);

const showRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Place(request.params), ACTIONS.SHOW);

const listRoute = (request, response, next) => callStaticListMethod(response, next, Place, MODELS.PLACE);

export { newRoute, createRoute, editRoute, updateRoute, deleteRoute, showRoute, listRoute };
