import neo4j from 'neo4j';

const { DATABASE_HOST, DATABASE_NAME, DATABASE_PORT } = process.env;

const db = new neo4j.GraphDatabase({
	url: `http://neo4j:${DATABASE_NAME}@${DATABASE_HOST}:${DATABASE_PORT}`
});

export default (queryData, queryOpts = {}) => {

	const isReqdResult = queryOpts.isReqdResult === false ? false : true;
	const returnArray = queryOpts.returnArray || false;

	return new Promise((resolve, reject) => {

		db.cypher(queryData, (err, results) => {

			if (err) return reject(err);

			return (!results.length && isReqdResult) ?
				reject(new Error('Not Found')) :
				resolve(returnArray ? results : results[0]);

		});

	});

};
