/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "next" }] */

import { callInstanceMethod, callStaticListMethod } from '../lib/call-class-methods';
import { renderJson } from '../lib/render-json';
import Person from '../models/person';

const newRoute = (req, res, next) =>
	renderJson(res, new Person());

const createRoute = (req, res, next) =>
	callInstanceMethod(res, next, new Person(req.body), 'create');

const editRoute = (req, res, next) =>
	callInstanceMethod(res, next, new Person(req.params), 'edit');

const updateRoute = (req, res, next) =>
	callInstanceMethod(res, next, new Person(Object.assign({}, req.body, req.params)), 'update');

const deleteRoute = (req, res, next) =>
	callInstanceMethod(res, next, new Person(req.params), 'delete');

const showRoute = (req, res, next) =>
	callInstanceMethod(res, next, new Person(req.params), 'show');

const listRoute = (req, res, next) =>
	callStaticListMethod(res, next, Person, 'person');

export {
	newRoute,
	createRoute,
	editRoute,
	updateRoute,
	deleteRoute,
	showRoute,
	listRoute
};
