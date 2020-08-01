import neo4j from 'neo4j-driver';

export default response => {

	let records = response.records || [];

	records = records.map(record => {

		const object = {};

		record.keys.forEach((key, index) => {

			object[key] = record._fields[index]; // eslint-disable-line no-underscore-dangle

			if (neo4j.isInt(object[key])) {

				const neo4jInt = neo4j.int(object[key]);

				if (neo4jInt.inSafeRange()) object[key] = neo4jInt.toNumber();

			}

		});

		return object;

	});

	return records;

};
