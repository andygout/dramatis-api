import neo4j from 'neo4j-driver';

const convertJsIntegerToNeo4jInteger = (value) => {
	return neo4j.int(value);
};

export default convertJsIntegerToNeo4jInteger;
