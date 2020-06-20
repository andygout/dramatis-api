import convertRecordsToObjects from './convert-records-to-objects';
import { getDriver } from './get-driver';

const driver = getDriver();

export const neo4jQuery = async (queryData, queryOpts = {}) => {

	const { query, params } = queryData;

	const isRequiredResult = queryOpts.isRequiredResult === false ? false : true;
	const returnArray = queryOpts.returnArray || false;

	const session = driver.session();

	try {

		const response = await session.run(query, params);

		session.close();

		const results = convertRecordsToObjects(response);

		if (!results.length && isRequiredResult) throw new Error('Not Found');

		return returnArray ? results : results[0];

	} catch (error) {

		throw error;

	}

};
