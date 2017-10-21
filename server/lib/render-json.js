export default (res, instance) => {

	res.setHeader('Content-Type', 'application/json');

	return res.send(JSON.stringify(instance));

};
