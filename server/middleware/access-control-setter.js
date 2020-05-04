export default function (request, response, next) {

	response.header('Access-Control-Allow-Origin', '*');
	response.header('Access-Control-Allow-Headers', 'content-type');

	next();

}
