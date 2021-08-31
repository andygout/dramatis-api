/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "next" }] */

import { venue as venueSeedProps } from './model-seed-props';
import { callInstanceMethod, callStaticListMethod } from '../lib/call-class-methods';
import { sendJsonResponse } from '../lib/send-json-response';
import { Venue } from '../models';
import { MODELS } from '../utils/constants';

const newRoute = (request, response, next) =>
	sendJsonResponse(response, new Venue(venueSeedProps));

const createRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Venue(request.body), 'create');

const editRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Venue(request.params), 'edit');

const updateRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Venue({ ...request.body, ...request.params }), 'update');

const deleteRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Venue(request.params), 'delete');

const showRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Venue(request.params), 'show');

const listRoute = (request, response, next) =>
	callStaticListMethod(response, next, Venue, MODELS.VENUE);

export {
	newRoute,
	createRoute,
	editRoute,
	updateRoute,
	deleteRoute,
	showRoute,
	listRoute
};
