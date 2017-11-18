import propIsObject from './prop-is-object';

const objectWithErrors = item => propIsObject(item) && searchForErrors(item);

const propHasErrors = (prop, instanceProp) => prop === 'errors' && propIsObject(instanceProp);

const searchForErrors = instance => {

	for (const prop in instance) if (instance.hasOwnProperty(prop)) {

		if (propHasErrors(prop, instance[prop])) return true;

		if (objectWithErrors(instance[prop])) return true;

		if (Array.isArray(instance[prop]) && instance[prop].find(item => objectWithErrors(item))) return true;

	}

	return false;

};

export default instance => searchForErrors(instance);
