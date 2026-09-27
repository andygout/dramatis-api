import neo4j from 'neo4j-driver';

import convertAstronomicalToHistoricalDate from './convert-astronomical-to-historical-date.js';
import convertNeo4jIntegerToNumber from './convert-neo4j-integer-to-number.js';
import isObjectWithKeys from '../lib/is-object-with-keys.js';

const convertNeo4jFieldsToJsValues = (inputValue) => {
	const applyModifications = (object) => {
		return Object.keys(object).reduce((accumulator, key) => {
			const value = object[key];

			// Note: Neo4j dates are returned as objects that contain integers
			// to describe the year, month, and day, meaning that
			// Neo4j dates must be converted before Neo4j integers.
			if (neo4j.isDate(value)) {
				accumulator[key] = convertAstronomicalToHistoricalDate(value);
			} else if (neo4j.isInt(value)) {
				const safeRangeNumber = convertNeo4jIntegerToNumber(value);

				if (safeRangeNumber) accumulator[key] = safeRangeNumber;
			} else if (isObjectWithKeys(value)) {
				accumulator[key] = applyModifications(value);
			} else if (Array.isArray(value)) {
				accumulator[key] = value.map((item) => (isObjectWithKeys(item) ? applyModifications(item) : item));
			} else {
				accumulator[key] = value;
			}

			return accumulator;
		}, {});
	};

	const { key: modifiedValue } = applyModifications({ key: inputValue });

	return modifiedValue;
};

export default convertNeo4jFieldsToJsValues;
