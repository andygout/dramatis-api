/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "next" }] */

export default (error, request, response, next) => {

	console.error(error); // eslint-disable-line no-console

	const status = error.status || 500;

	return response.sendStatus(status);

};
