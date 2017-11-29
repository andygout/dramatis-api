/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "next" }] */

import { callInstanceMethod, callStaticListMethod } from '../lib/call-class-methods';
import renderJson from '../lib/render-json';
import Production from '../models/production';

const newRoute = (req, res, next) =>
	renderJson(res, new Production());

const createRoute = (req, res, next) =>
	callInstanceMethod(res, next, new Production(req.body), 'create');

const editRoute = (req, res, next) =>
	callInstanceMethod(res, next, new Production(req.params), 'edit');

const updateRoute = (req, res, next) =>
	callInstanceMethod(res, next, new Production(Object.assign({}, req.body, req.params)), 'update');

const deleteRoute = (req, res, next) =>
	callInstanceMethod(res, next, new Production(req.params), 'delete');

const showRoute = (req, res, next) =>
	callInstanceMethod(res, next, new Production(req.params), 'show');

const listRoute = (req, res, next) =>
	callStaticListMethod(res, next, Production, 'production');

export {
	newRoute,
	createRoute,
	editRoute,
	updateRoute,
	deleteRoute,
	showRoute,
	listRoute
};
