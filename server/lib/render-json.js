export const renderJson = (res, instance) => {

	res.setHeader('content-type', 'application/json');

	return res.send(JSON.stringify(instance));

};
