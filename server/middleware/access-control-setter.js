export default (request, response, next) => {

	response.header('Access-Control-Allow-Origin', '*');
	response.header('Access-Control-Allow-Headers', 'content-type');

	if (request.method === 'OPTIONS') {

		response.header('Access-Control-Allow-Methods', 'PUT');

		return response.sendStatus(200);

	}

	next();

}
