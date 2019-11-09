# theatrebase-api [![CircleCI](https://circleci.com/gh/andygout/theatrebase-api.svg?style=svg)](https://circleci.com/gh/andygout/theatrebase-api)

Graph database-driven API for site of theatrical productions and playtexts.

## To run locally
- Clone this repo.
- Install node modules: `$ npm install`.
- Copy development environment variables from `.env-dev` into `.env` by running command `$ node transfer-env-dev`.
- Download the [Neo4j desktop app](https://neo4j.com/download).
- Create and run a local Neo4j graph database, configuring as to:
	- Neo4j user name matches `.env` `DATABASE_USERNAME` value.
	- Neo4j local graph database password matches `.env` `DATABASE_PASSWORD` value.
	- `.env` `DATABASE_URL` value is endpoint on which Neo4j local graph database is running. This can be ascertained by launching the Neo4j Browser from the desktop app and viewing its connection status, which is displayed upon opening the browser, or returned via browser command `:server status`).
- Run server using `$ npm start` and visit routes via `http://localhost:3000` (e.g. `http://localhost:3000/productions`).

## To view content via user interface (locally)
- Run a local instance of [`theatrebase-frontend`](https://github.com/andygout/theatrebase-frontend) on `http://localhost:3001`, which will point at this API on port 3000.

## To edit content via CMS (content management system) (locally)
- Run a local instance of [`theatrebase-cms`](https://github.com/andygout/theatrebase-cms) on `http://localhost:3002`, which will point at this API on port 3000.

## To test
- Ensure `$ npm install` has been run.
- `$ npm test`.

## To run integration tests
- Ensure `$ npm install` has been run.
- Download and run the [Docker desktop app](https://www.docker.com/products/docker-desktop).
- Stop any Neo4j databases running on the Desktop app.
- Start the Docker-served resources by running `$ npm run start:test-int:dependencies` and wait until they are ready.
- In a separate CLI tab run `$ npm run test-int`.
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

### POST `/theatres/:uuid`
- **Update** specific theatre.
- Requires body, e.g.: `{ "name": "Almeida Theatre" }`.

### DELETE `/theatres/:uuid`
- **Delete** specific theatre.

### GET `/theatres/:uuid`
- **Show** specific theatre.

### GET `/theatres`
- **List** theatres.
