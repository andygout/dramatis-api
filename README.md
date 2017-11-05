# theatrebase-api [![CircleCI](https://circleci.com/gh/andygout/theatrebase-api.svg?style=svg)](https://circleci.com/gh/andygout/theatrebase-api)

API for site of theatrical productions and playtexts.

To run locally
-------
- Clone this repo.
- Install node modules: `$ npm install`.
- Copy development environment variables from `.env-dev` into `.env` by running command: `$ node transfer-env-dev`.
- Create Neo4j database called `theatrebase` and run on port `localhost:7474` (using [Neo4j Community Edition](https://neo4j.com/download/community-edition)).
- Run server using: `$ npm start` and visit homepage: `localhost:4000`.

To test
-------
- Ensure `$ npm install` has been run.
- `$ npm test`.
