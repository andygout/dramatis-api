import { renderJson } from './render-json';

const callInstanceMethod = async (response, next, classInstance, method) => {

	try {

		const instance = await classInstance[method]();

		return renderJson(response, instance)

	} catch (error) {

		if (error.message === 'Not Found') return response.status(404).send(error.message);

		return next(error);

	}

};

const callStaticListMethod = async (response, next, Class, model) => {

	try {

		const instances = await Class.list(model);

		return renderJson(response, instances);

	} catch (error) {

		return next(error);

	}

};

export {
	callInstanceMethod,
	callStaticListMethod
};
