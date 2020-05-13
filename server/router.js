/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "next" }] */

import { Router } from 'express';

import * as controllers from './controllers';

const router = new Router();

router.get('/characters/new', controllers.characters.newRoute);
router.post('/characters', controllers.characters.createRoute);
router.get('/characters/:uuid/edit', controllers.characters.editRoute);
router.put('/characters/:uuid', controllers.characters.updateRoute);
router.delete('/characters/:uuid', controllers.characters.deleteRoute);
router.get('/characters/:uuid', controllers.characters.showRoute);
router.get('/characters', controllers.characters.listRoute);

router.get('/people/new', controllers.people.newRoute);
router.post('/people', controllers.people.createRoute);
router.get('/people/:uuid/edit', controllers.people.editRoute);
router.put('/people/:uuid', controllers.people.updateRoute);
router.delete('/people/:uuid', controllers.people.deleteRoute);
router.get('/people/:uuid', controllers.people.showRoute);
router.get('/people', controllers.people.listRoute);

router.get('/playtexts/new', controllers.playtexts.newRoute);
router.post('/playtexts', controllers.playtexts.createRoute);
router.get('/playtexts/:uuid/edit', controllers.playtexts.editRoute);
router.put('/playtexts/:uuid', controllers.playtexts.updateRoute);
router.delete('/playtexts/:uuid', controllers.playtexts.deleteRoute);
router.get('/playtexts/:uuid', controllers.playtexts.showRoute);
router.get('/playtexts', controllers.playtexts.listRoute);

router.get('/productions/new', controllers.productions.newRoute);
router.post('/productions', controllers.productions.createRoute);
router.get('/productions/:uuid/edit', controllers.productions.editRoute);
router.put('/productions/:uuid', controllers.productions.updateRoute);
router.delete('/productions/:uuid', controllers.productions.deleteRoute);
router.get('/productions/:uuid', controllers.productions.showRoute);
router.get('/productions', controllers.productions.listRoute);

router.get('/theatres/new', controllers.theatres.newRoute);
router.post('/theatres', controllers.theatres.createRoute);
router.get('/theatres/:uuid/edit', controllers.theatres.editRoute);
router.put('/theatres/:uuid', controllers.theatres.updateRoute);
router.delete('/theatres/:uuid', controllers.theatres.deleteRoute);
router.get('/theatres/:uuid', controllers.theatres.showRoute);
router.get('/theatres', controllers.theatres.listRoute);

router.get('*', (request, response, next) => response.sendStatus(404));

export default router;
