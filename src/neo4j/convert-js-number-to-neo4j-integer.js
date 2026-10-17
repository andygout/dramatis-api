import neo4j from 'neo4j-driver';

const convertJsNumberToNeo4jInteger = (value) => {
	return neo4j.int(value);
};

export default convertJsNumberToNeo4jInteger;
