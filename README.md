# theatrebase-api [![CircleCI](https://circleci.com/gh/andygout/theatrebase-api.svg?style=svg)](https://circleci.com/gh/andygout/theatrebase-api)

Graph database-driven API for site of theatrical productions and playtexts.

## To run locally
- Clone this repo.
- Install node modules: `$ npm install`.
- Copy development environment variables from `.env-dev` into `.env` by running command `$ node transfer-env-dev`.
- Create Neo4j database called `theatrebase` and run on `http://localhost:7474` (using [Neo4j Community Edition](https://neo4j.com/download/community-edition)).
- Run server using `$ npm start` and visit routes on `http://localhost:3000` (e.g. `http://localhost:3000/productions`).

## To view content via user interface
- Run a local instance of [`theatrebase-frontend`](https://github.com/andygout/theatrebase-frontend) on `http://localhost:3001`.

## To test
- Ensure `$ npm install` has been run.
- `$ npm test`.

## Endpoints
Using theatre model as an example.

### GET /theatres/new
- Get data required to prepare **new** theatre.

### POST /theatres
- **Create** theatre.
- Requires body, e.g.: `{ "name": "National Theatre" }`.

### GET /theatres/:uuid/edit
- Get data required to **edit** specific theatre.

### POST /theatres/:uuid
- **Update** specific theatre.
- Requires body, e.g.: `{ "name": "Almeida Theatre", "uuid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" }`.

### DELETE /theatres/:uuid
- **Delete** specific theatre.

### GET /theatres/:uuid
- **Show** specific theatre.

### GET /theatres
- **List** theatres.
