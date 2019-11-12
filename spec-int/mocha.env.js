// Docker-served Neo4j logs display: `Bolt enabled on 0.0.0.0:7687`.
process.env.DATABASE_URL = 'bolt://0.0.0.0:7687';
// Docker-served Neo4j is configured in `docker/docker-compose.yml` to require no authorisation: `NEO4J_AUTH=none`.
process.env.DATABASE_USERNAME = null;
// Docker-served Neo4j is configured in `docker/docker-compose.yml` to require no authorisation: `NEO4J_AUTH=none`.
process.env.DATABASE_PASSWORD = null;
