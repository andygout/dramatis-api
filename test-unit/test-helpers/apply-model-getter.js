export default (object, model = 'BASE') => {

	return Object.defineProperty(object, 'model', {
		get: () => model
	});

};
