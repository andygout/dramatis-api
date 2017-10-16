import Character from '../models/character';
import renderJson from '../lib/render-json';

const editRoute = (req, res, next) => {

	const character = new Character(req.params);

	return character.edit()
		.then(({ character }) => renderJson(res, character))
		.catch(err => next(err));

};

const updateRoute = (req, res, next) => {

	const character = new Character(Object.assign({}, req.body, req.params));

	return character.update()
		.then(({ character }) => renderJson(res, character))
		.catch(err => next(err));

};

const deleteRoute = (req, res, next) => {

	const character = new Character(req.params);

	return character.delete()
		.then(({ character }) => renderJson(res, character))
		.catch(err => next(err));

};

const showRoute = (req, res, next) => {

	const character = new Character(req.params);

	return character.show()
		.then(({ character }) => renderJson(res, character))
		.catch(err => next(err));

};

const listRoute = (req, res, next) => {

	return Character.list('character')
		.then(({ characters }) => renderJson(res, characters))
		.catch(err => next(err));

};

export {
	editRoute,
	updateRoute,
	deleteRoute,
	showRoute,
	listRoute
};
