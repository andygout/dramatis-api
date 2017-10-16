import Playtext from '../models/playtext';
import renderJson from '../lib/render-json';

const editRoute = (req, res, next) => {

	const playtext = new Playtext(req.params);

	return playtext.edit()
		.then(({ playtext }) => renderJson(res, playtext))
		.catch(err => next(err));

};

const updateRoute = (req, res, next) => {

	const playtext = new Playtext(Object.assign({}, req.body, req.params));

	return playtext.update()
		.then(({ playtext }) => renderJson(res, playtext))
		.catch(err => next(err));

};

const deleteRoute = (req, res, next) => {

	const playtext = new Playtext(req.params);

	return playtext.delete()
		.then(({ playtext }) => renderJson(res, playtext))
		.catch(err => next(err));

};

const showRoute = (req, res, next) => {

	const playtext = new Playtext(req.params);

	return playtext.show()
		.then(({ playtext }) => renderJson(res, playtext))
		.catch(err => next(err));

};

const listRoute = (req, res, next) => {

	return Playtext.list('playtext')
		.then(({ playtexts }) => renderJson(res, playtexts))
		.catch(err => next(err));

};

export {
	editRoute,
	updateRoute,
	deleteRoute,
	showRoute,
	listRoute
};
