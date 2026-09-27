import neo4j from 'neo4j-driver';

const convertNeo4jIntegerToNumber = (value) => {
	const neo4jInteger = neo4j.int(value);

	if (neo4jInteger.inSafeRange()) {
		return neo4jInteger.toNumber();
	} else {
		return null;
	}
};

export default convertNeo4jIntegerToNumber;
