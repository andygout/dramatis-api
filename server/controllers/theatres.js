import { callInstanceMethod, callStaticListMethod } from '../lib/call-class-methods';
import Theatre from '../models/theatre';

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
	editRoute,
	updateRoute,
	deleteRoute,
	showRoute,
	listRoute
};
