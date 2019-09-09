/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "next" }] */

import { callInstanceMethod, callStaticListMethod } from '../lib/call-class-methods';
import { renderJson } from '../lib/render-json';
import Theatre from '../models/theatre';

const newRoute = (req, res, next) =>
	renderJson(res, new Theatre());

const createRoute = (req, res, next) =>
	callInstanceMethod(res, next, new Theatre(req.body), 'create');

const editRoute = (req, res, next) =>
	callInstanceMethod(res, next, new Theatre(req.params), 'edit');

const updateRoute = (req, res, next) =>
	callInstanceMethod(res, next, new Theatre(Object.assign({}, req.body, req.params)), 'update');

const deleteRoute = (req, res, next) =>
	callInstanceMethod(res, next, new Theatre(req.params), 'delete');

const showRoute = (req, res, next) =>
	callInstanceMethod(res, next, new Theatre(req.params), 'show');

const listRoute = (req, res, next) =>
	callStaticListMethod(res, next, Theatre, 'theatre');

export {
	newRoute,
	createRoute,
	editRoute,
	updateRoute,
	deleteRoute,
	showRoute,
	listRoute
};
