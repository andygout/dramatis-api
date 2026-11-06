import convertNeo4jRecordsToObjects from './convert-neo4j-records-to-objects.js';
import { getDriver } from './get-driver.js';

const { DATABASE_NAME } = process.env;

const driver = getDriver();

export const neo4jQuery = async (queryData, opts = {}) => {
	const { query, params } = queryData;

	const isOptionalResult = Boolean(opts.isOptionalResult);
	const isArrayResult = Boolean(opts.isArrayResult);

	const session = driver.session({ database: DATABASE_NAME });

	const response = await session.run(query, params);

	session.close();

	const resultObjects = convertNeo4jRecordsToObjects(response);

	if (!resultObjects.length && !isOptionalResult) throw new Error('Not Found');

	return isArrayResult ? resultObjects : resultObjects[0];
};
