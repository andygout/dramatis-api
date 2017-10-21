import Theatre from '../models/theatre';
import renderJson from '../lib/render-json';

const editRoute = (req, res, next) => {

	const theatre = new Theatre(req.params);

	return theatre.edit()
		.then(({ theatre }) => renderJson(res, theatre))
		.catch(err => next(err));

};

const updateRoute = (req, res, next) => {

	const theatre = new Theatre(Object.assign({}, req.body, req.params));

	return theatre.update()
		.then(({ theatre }) => renderJson(res, theatre))
		.catch(err => next(err));

};

const deleteRoute = (req, res, next) => {

	const theatre = new Theatre(req.params);

	return theatre.delete()
		.then(({ theatre }) => renderJson(res, theatre))
		.catch(err => next(err));

};

const showRoute = (req, res, next) => {

	const theatre = new Theatre(req.params);

	return theatre.show()
		.then(({ theatre }) => renderJson(res, theatre))
		.catch(err => next(err));

};

const listRoute = (req, res, next) => {

	return Theatre.list('theatre')
		.then(({ theatres }) => renderJson(res, theatres))
		.catch(err => next(err));

};

export {
	editRoute,
	updateRoute,
	deleteRoute,
	showRoute,
	listRoute
};
