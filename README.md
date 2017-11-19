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
Using production model as an example.

### GET /productions/new
- Get data required to prepare **new** production.
- N.B. Currently only for productions.

### POST /productions
- **Create** production.
- N.B. Currently only for productions.
- Requires body, e.g.:
```
{
	"name": "Hamlet",
	"theatre": {
		"name": "National Theatre"
	},
	"playtext": {
		"name": "Hamlet"
	}
}
```

### GET /productions/:uuid/edit
- Get data required to **edit** specific production.

### POST /productions/:uuid
- **Update** specific production.
- Requires body, e.g.:
```
{
	"name": "Hamlet",
	"theatre": {
		"name": "National Theatre"
	},
	"playtext": {
		"name": "Hamlet"
	}
}
```

### DELETE /productions/:uuid
- **Delete** specific production.

### GET /productions/:uuid
- **Show** specific production.

### GET /productions
- **List** productions.
