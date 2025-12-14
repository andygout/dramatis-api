/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "next" }] */

const errorHandler = (error, request, response, next) => {

	console.error(error); // eslint-disable-line no-console

	const status = error.status || 500;

	return response.sendStatus(status);

};

export default errorHandler;
