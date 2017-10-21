module.exports = (opts = {}) => {

	return {
		model: 'theatre',
		uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
		name: 'Almeida Theatre',
		errors: opts.errorsAssociations || {},
		hasError: opts.hasError || false
	};

};
