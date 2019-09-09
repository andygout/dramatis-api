import { renderJson } from './render-json';

const callInstanceMethod = async (res, next, instance, method) => {

	try {

		const response = await instance[method]();

		return renderJson(res, response)

	} catch (err) {

		if (err.message === 'Not Found') return res.status(404).send(err.message);

		return next(err);

	}

};

const callStaticListMethod = async (res, next, Class, model) => {

	try {

		const instances = await Class.list(model);

		return renderJson(res, instances);

	} catch (err) {

		return next(err);

	}

};

export {
	callInstanceMethod,
	callStaticListMethod
};
