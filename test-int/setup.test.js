import createNeo4jConstraints from '../server/neo4j/create-constraints';

before(async () => {

	await createNeo4jConstraints();

});
