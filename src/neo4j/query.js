import neo4j from 'neo4j-driver';

import { getDriver } from './get-driver';

const driver = getDriver();

const convertRecordsToObjects = response => {

	let records = response.records || [];

	records = records.map(record => {

		const object = {};

		record.keys.forEach((key, index) => {

			object[key] = record._fields[index];

			if (neo4j.isInt(object[key])) {

				const neoInt = neo4j.int(object[key]);

				if (neoInt.inSafeRange()) object[key] = neoInt.toNumber();

			}

		});

		return object;

	});

	return records;

};

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
