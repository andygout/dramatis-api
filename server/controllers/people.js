import { callInstanceMethod, callStaticListMethod } from '../lib/call-class-methods';
import Person from '../models/person';

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
	editRoute,
	updateRoute,
	deleteRoute,
	showRoute,
	listRoute
};
