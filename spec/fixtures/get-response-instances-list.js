module.exports = pluralisedModel => {

	const responseInstancesList = {};

	responseInstancesList[pluralisedModel] = [
		{
			responseInstancesListProperty: 'responseInstancesListValue'
		}
	];

	return responseInstancesList;

};
