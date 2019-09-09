/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "next" }] */

import { callInstanceMethod, callStaticListMethod } from '../lib/call-class-methods';
import { renderJson } from '../lib/render-json';
import Character from '../models/character';

const newRoute = (req, res, next) =>
	renderJson(res, new Character());

const createRoute = (req, res, next) =>
	callInstanceMethod(res, next, new Character(req.body), 'create');

const editRoute = (req, res, next) =>
	callInstanceMethod(res, next, new Character(req.params), 'edit');

const updateRoute = (req, res, next) =>
	callInstanceMethod(res, next, new Character(Object.assign({}, req.body, req.params)), 'update');

const deleteRoute = (req, res, next) =>
	callInstanceMethod(res, next, new Character(req.params), 'delete');

const showRoute = (req, res, next) =>
	callInstanceMethod(res, next, new Character(req.params), 'show');

const listRoute = (req, res, next) =>
	callStaticListMethod(res, next, Character, 'character');

export {
	newRoute,
	createRoute,
	editRoute,
	updateRoute,
	deleteRoute,
	showRoute,
	listRoute
};
