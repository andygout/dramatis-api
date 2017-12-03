import { v1 as neo4j } from 'neo4j-driver';

import convertRecordsToObjects from './convert-records-to-objects';

const { DATABASE_URL, DATABASE_USERNAME, DATABASE_PASSWORD, NODE_ENV } = process.env;

const driver = (NODE_ENV !== 'test') ?
	neo4j.driver(DATABASE_URL, neo4j.auth.basic(DATABASE_USERNAME, DATABASE_PASSWORD)) :
	null;

export default (queryData, queryOpts = {}) => {

	const { query, params } = queryData;

	const isReqdResult = queryOpts.isReqdResult === false ? false : true;
	const returnArray = queryOpts.returnArray || false;

	const session = driver.session();

	return new Promise((resolve, reject) => {

		return session
			.run(query, params)
			.then(response => {

				session.close();

				driver.close();

				const results = convertRecordsToObjects(response);

				return (!results.length && isReqdResult) ?
					reject(new Error('Not Found')) :
					resolve(returnArray ? results : results[0]);

			})
			.catch(err => reject(err));

	});

};
