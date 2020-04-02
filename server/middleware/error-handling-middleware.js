/* eslint
	no-console: 0,
	no-unused-vars: ["error", { "argsIgnorePattern": "next" }]
*/

export default function (error, req, res, next) {

	console.error(error);

	const status = error.status || 500;

	return res.sendStatus(status);

}
