const irregularPluralNouns = {
	'person': 'people'
};

export default model => irregularPluralNouns[model] || `${model}s`;
