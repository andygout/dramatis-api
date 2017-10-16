import Production from '../models/production';
import renderJson from '../lib/render-json';

const newRoute = (req, res, next) => {

	const production = new Production();

	return renderJson(res, production);

};

const createRoute = (req, res, next) => {

	const production = new Production(Object.assign({}, req.body, req.params));

	return production.create()
		.then(({ production }) => renderJson(res, production))
		.catch(err => next(err));

};

const editRoute = (req, res, next) => {

	const production = new Production(req.params);

	return production.edit()
		.then(({ production }) => renderJson(res, production))
		.catch(err => next(err));

};

const updateRoute = (req, res, next) => {

	const production = new Production(Object.assign({}, req.body, req.params));

	return production.update()
		.then(({ production }) => renderJson(res, production))
		.catch(err => next(err));

};

const deleteRoute = (req, res, next) => {

	const production = new Production(req.params);

	return production.delete()
		.then(({ production }) => renderJson(res, production))
		.catch(err => next(err));

};

const showRoute = (req, res, next) => {

	const production = new Production(req.params);

	return production.show()
		.then(({ production }) => renderJson(res, production))
		.catch(err => next(err));

};

const listRoute = (req, res, next) => {

	return Production.list()
		.then(({ productions }) => renderJson(res, productions))
		.catch(err => next(err));

};

export {
	newRoute,
	createRoute,
	editRoute,
	updateRoute,
	deleteRoute,
	showRoute,
	listRoute
};
