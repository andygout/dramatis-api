import Person from '../models/person';
import renderJson from '../lib/render-json';

const editRoute = (req, res, next) => {

	const person = new Person(req.params);

	return person.edit()
		.then(({ person }) => renderJson(res, person))
		.catch(err => next(err));

};

const updateRoute = (req, res, next) => {

	const person = new Person(Object.assign({}, req.body, req.params));

	return person.update()
		.then(({ person }) => renderJson(res, person))
		.catch(err => next(err));

};

const deleteRoute = (req, res, next) => {

	const person = new Person(req.params);

	return person.delete()
		.then(({ person }) => renderJson(res, person))
		.catch(err => next(err));

};

const showRoute = (req, res, next) => {

	const person = new Person(req.params);

	return person.show()
		.then(({ person }) => renderJson(res, person))
		.catch(err => next(err));

};

const listRoute = (req, res, next) => {

	return Person.list('person')
		.then(({ people }) => renderJson(res, people))
		.catch(err => next(err));

};

export {
	editRoute,
	updateRoute,
	deleteRoute,
	showRoute,
	listRoute
};
