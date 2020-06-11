import createNeo4jConstraints from '../src/neo4j/create-constraints';

before(async () => {

	await createNeo4jConstraints();

});
