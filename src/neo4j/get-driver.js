import neo4j from 'neo4j-driver';

const { DATABASE_URL, DATABASE_USERNAME, DATABASE_PASSWORD, NODE_ENV } = process.env;

const driver = (NODE_ENV !== 'unit-test') ?
	neo4j.driver(DATABASE_URL, neo4j.auth.basic(DATABASE_USERNAME, DATABASE_PASSWORD)) :
	null;

export const getDriver = () => driver;
