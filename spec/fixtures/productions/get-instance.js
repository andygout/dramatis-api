module.exports = (opts = {}) => {

	return {
		model: 'production',
		uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
		name: 'Hamlet',
		theatre: {
			name: 'Almeida Theatre'
		},
		hasError: opts.hasError || false
	};

};
