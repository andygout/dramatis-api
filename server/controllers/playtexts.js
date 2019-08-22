/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "next" }] */

import { callInstanceMethod, callStaticListMethod } from '../lib/call-class-methods';
import { renderJson } from '../lib/render-json';
import Playtext from '../models/playtext';

const newRoute = (req, res, next) =>
	renderJson(res, new Playtext());

const createRoute = (req, res, next) =>
	callInstanceMethod(res, next, new Playtext(req.body), 'create');

const editRoute = (req, res, next) =>
	callInstanceMethod(res, next, new Playtext(req.params), 'edit');

const updateRoute = (req, res, next) =>
	callInstanceMethod(res, next, new Playtext(Object.assign({}, req.body, req.params)), 'update');

const deleteRoute = (req, res, next) =>
	callInstanceMethod(res, next, new Playtext(req.params), 'delete');

const showRoute = (req, res, next) =>
	callInstanceMethod(res, next, new Playtext(req.params), 'show');

const listRoute = (req, res, next) =>
	callStaticListMethod(res, next, Playtext, 'playtext');

export {
	newRoute,
	createRoute,
	editRoute,
	updateRoute,
	deleteRoute,
	showRoute,
	listRoute
};
