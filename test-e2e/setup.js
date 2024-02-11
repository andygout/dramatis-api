import createNeo4jConstraints from '../src/neo4j/create-constraints';
import createNeo4jFullTextIndexes from '../src/neo4j/create-full-text-indexes';
import createNeo4jIndexes from '../src/neo4j/create-indexes';
import { shutDown } from '../src/app';

before(async () => {

	await createNeo4jConstraints();

	await createNeo4jIndexes();

	await createNeo4jFullTextIndexes();

});

after(() => {

	shutDown();

});
