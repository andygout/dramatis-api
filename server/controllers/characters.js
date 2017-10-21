import { callInstanceMethod, callStaticListMethod } from '../lib/call-class-methods';
import Character from '../models/character';

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
	editRoute,
	updateRoute,
	deleteRoute,
	showRoute,
	listRoute
};
