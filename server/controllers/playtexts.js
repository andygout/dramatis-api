import { callInstanceMethod, callStaticListMethod } from '../lib/call-class-methods';
import Playtext from '../models/playtext';

const editRoute = (req, res, next) =>
	callInstanceMethod(res, next, new Playtext(req.params), 'edit');

const updateRoute = (req, res, next) =>
	callInstanceMethod(res, next, new Playtext(Object.assign({}, req.body, req.params)), 'update');

const deleteRoute = (req, res, next) =>
	callInstanceMethod(res, next, new Playtext(req.params), 'delete');

const showRoute = (req, res, next) =>
	callInstanceMethod(res, next, new Playtext(req.params), 'show');

const listRoute = (req, res, next) =>
	callStaticListMethod(res, next, Playtext);

export {
	editRoute,
	updateRoute,
	deleteRoute,
	showRoute,
	listRoute
};
