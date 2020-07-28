# theatrebase-api [![CircleCI](https://circleci.com/gh/andygout/theatrebase-api.svg?style=svg)](https://circleci.com/gh/andygout/theatrebase-api)

Graph database-driven API for site of theatrical productions, playtexts, and associated data.

## Setup
- Clone this repo.
- Set local Node version to same as listed in `package.json` `engines.node`.
- Install node modules: `$ npm install`.
- Compile code: `$ npm run build`.
- Copy development environment variables from `.env-dev` into `.env` by running command `$ node transfer-env-dev`. N.B. Values may need to be amended to match your specific local database configuration (see: [Database setup](https://github.com/andygout/theatrebase-api#user-content-database-setup)).

## Database setup
- Download the [Neo4j Desktop app](https://neo4j.com/download) (the version of the Neo4j image in `docker/docker-compose.yml` will be a compatible version).
- Create a local Neo4j graph database, configuring as to:
	- Neo4j user name matches `.env` `DATABASE_USERNAME` value.
	- Neo4j local graph database password matches `.env` `DATABASE_PASSWORD` value.
	- `.env` `DATABASE_URL` value is endpoint on which Neo4j local graph database is running.
	- N.B. Neo4j user name and Neo4j local graph database endpoint can be viewed via the Desktop app by running the local Neo4j graph database, then launching the Neo4j Browser and viewing its connection status, which is displayed upon opening the browser and can be returned via browser command `:server status`).

## To run local Neo4j graph database
- Open Neo4j Desktop app.
- Press `► Start` for requisite database.

## To run locally
- Run local Neo4j graph database.
- Run server using `$ npm start`.
- Visit routes via `http://localhost:3000` (e.g. `http://localhost:3000/productions`).

## To edit content via CMS (content management system) (locally)
- Run a local instance of [`theatrebase-cms`](https://github.com/andygout/theatrebase-cms) on `http://localhost:3001`, which will point at this API on port 3000.

## To view content via user interface (locally)
- Run a local instance of [`theatrebase-spa`](https://github.com/andygout/theatrebase-spa) (single-page application) on `http://localhost:3002`, which will point at this API on port 3000.

or

- Run a local instance of [`theatrebase-ssr`](https://github.com/andygout/theatrebase-ssr) (server-side rendered) on `http://localhost:3003`, which will point at this API on port 3000.

## To run linting checks
- `$ npm run lint-check`.

## To run unit tests
- `$ npm run unit-test`.

## To run end-to-end tests
- Download and run the [Docker Desktop app](https://www.docker.com/products/docker-desktop).
- Stop any Neo4j databases running on the Desktop app.
- Start the Docker-served resources by running `$ npm run e2e-test-resources` and wait until they are ready.
- In a separate CLI tab run `$ npm run e2e-test`.
- The Docker-served Neo4j database can be queried via the Neo4j browser by visiting `http://localhost:7474`.

## Endpoints
Using theatre model as an example.

### GET `/theatres/new`
- Get data required to prepare **new** theatre.

### POST `/theatres`
- **Create** theatre.
- Requires body, e.g.: `{ "name": "National Theatre" }`.

### GET `/theatres/:uuid/edit`
- Get data required to **edit** specific theatre.

### PUT `/theatres/:uuid`
- **Update** specific theatre.
- Requires body, e.g.: `{ "name": "Almeida Theatre" }`.

### DELETE `/theatres/:uuid`
- **Delete** specific theatre.

### GET `/theatres/:uuid`
- **Show** specific theatre.

### GET `/theatres`
- **List** theatres.
