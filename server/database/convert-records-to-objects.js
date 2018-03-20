import neo4j from 'neo4j-driver';

export default response => {

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
