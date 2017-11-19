import renderJson from './render-json';

const callInstanceMethod = (res, next, instance, method) => {

	return instance[method]()
		.then(({ instance }) => renderJson(res, instance))
		.catch(err => {

			if (err.message === 'Not Found') return res.status(404).send(err.message);

			return next(err);

		});

};

const callStaticListMethod = (res, next, Class, model = null) => {

	return Class.list(model)
		.then(({ instances }) => renderJson(res, instances))
		.catch(err => next(err));

};

export {
	callInstanceMethod,
	callStaticListMethod
};
