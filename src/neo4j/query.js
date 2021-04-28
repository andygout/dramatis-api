import { convertNeo4jRecordsToObjects } from './convert-neo4j-records-to-objects';
import { getDriver } from './get-driver';

const driver = getDriver();

export const neo4jQuery = async (queryData, queryOpts = {}) => {

	const { query, params } = queryData;

	const isOptionalResult = Boolean(queryOpts.isOptionalResult);
	const isArrayResult = Boolean(queryOpts.isArrayResult);

	const session = driver.session();

	const response = await session.run(query, params);

	session.close();

	const resultObjects = convertNeo4jRecordsToObjects(response);

	if (!resultObjects.length && !isOptionalResult) throw new Error('Not Found');

	return isArrayResult
		? resultObjects
		: resultObjects[0];

};
