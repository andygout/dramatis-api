import convertRecordsToObjects from './convert-records-to-objects';
import { getDriver } from './get-driver';

const driver = getDriver();

export const neo4jQuery = async (queryData, queryOpts = {}) => {

	const { query, params } = queryData;

	const isOptionalResult = !!queryOpts.isOptionalResult;
	const isArrayResult = !!queryOpts.isArrayResult;

	const session = driver.session();

	try {

		const response = await session.run(query, params);

		session.close();

		const results = convertRecordsToObjects(response);

		if (!results.length && !isOptionalResult) throw new Error('Not Found');

		return isArrayResult
			? results
			: results[0];

	} catch (error) {

		throw error;

	}

};
