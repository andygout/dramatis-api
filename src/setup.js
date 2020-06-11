import './dotenv';

import createNeo4jConstraints from './neo4j/create-constraints';

(async () => {

	await createNeo4jConstraints();

})();
