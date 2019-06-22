import neo4j from 'neo4j-driver';

import convertRecordsToObjects from './convert-records-to-objects';

const { DATABASE_URL, DATABASE_USERNAME, DATABASE_PASSWORD, NODE_ENV } = process.env;

const driver = (NODE_ENV !== 'test') ?
	neo4j.driver(DATABASE_URL, neo4j.auth.basic(DATABASE_USERNAME, DATABASE_PASSWORD)) :
	null;

export default async (queryData, queryOpts = {}) => {

	const { query, params } = queryData;

	const isReqdResult = queryOpts.isReqdResult === false ? false : true;
	const returnArray = queryOpts.returnArray || false;

	const session = driver.session();

	try {

		const response = await session.run(query, params);

		session.close();

		driver.close();

		const results = convertRecordsToObjects(response);

		if (!results.length && isReqdResult) throw new Error('Not Found');

		return returnArray ? results : results[0];

	} catch (err) {

		throw err;

	}

};
