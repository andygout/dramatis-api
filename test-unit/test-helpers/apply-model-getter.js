export default (object, model = 'base') => {

	return Object.defineProperty(object, 'model', {
		get: () => model
	});

};
