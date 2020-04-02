/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "next" }] */

export default function (error, req, res, next) {

	console.error(error); // eslint-disable-line no-console

	const status = error.status || 500;

	return res.sendStatus(status);

}
