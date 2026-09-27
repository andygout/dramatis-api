import convertNeo4jFieldsToJsValues from './convert-neo4j-fields-to-js-values.js';

const convertNeo4jRecordsToObjects = (response) => {
	const records = response.records || [];

	return records.reduce((recordAccumulator, record) => {
		const object = record.keys.reduce((keyAccumulator, key, index) => {
			keyAccumulator[key] = convertNeo4jFieldsToJsValues(record._fields[index]); // eslint-disable-line no-underscore-dangle

			return keyAccumulator;
		}, {});

		recordAccumulator.push(object);

		return recordAccumulator;
	}, []);
};

export default convertNeo4jRecordsToObjects;
