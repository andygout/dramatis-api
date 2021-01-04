/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "next" }] */

import { Router } from 'express';

import {
	characters as charactersController,
	materials as materialsController,
	people as peopleController,
	productions as productionsController,
	theatres as theatresController
} from './controllers';

const router = new Router();

router.get('/characters/new', charactersController.newRoute);
router.post('/characters', charactersController.createRoute);
router.get('/characters/:uuid/edit', charactersController.editRoute);
router.put('/characters/:uuid', charactersController.updateRoute);
router.delete('/characters/:uuid', charactersController.deleteRoute);
router.get('/characters/:uuid', charactersController.showRoute);
router.get('/characters', charactersController.listRoute);

router.get('/materials/new', materialsController.newRoute);
router.post('/materials', materialsController.createRoute);
router.get('/materials/:uuid/edit', materialsController.editRoute);
router.put('/materials/:uuid', materialsController.updateRoute);
router.delete('/materials/:uuid', materialsController.deleteRoute);
router.get('/materials/:uuid', materialsController.showRoute);
router.get('/materials', materialsController.listRoute);

router.get('/people/new', peopleController.newRoute);
router.post('/people', peopleController.createRoute);
router.get('/people/:uuid/edit', peopleController.editRoute);
router.put('/people/:uuid', peopleController.updateRoute);
router.delete('/people/:uuid', peopleController.deleteRoute);
router.get('/people/:uuid', peopleController.showRoute);
router.get('/people', peopleController.listRoute);

router.get('/productions/new', productionsController.newRoute);
router.post('/productions', productionsController.createRoute);
router.get('/productions/:uuid/edit', productionsController.editRoute);
router.put('/productions/:uuid', productionsController.updateRoute);
router.delete('/productions/:uuid', productionsController.deleteRoute);
router.get('/productions/:uuid', productionsController.showRoute);
router.get('/productions', productionsController.listRoute);

router.get('/theatres/new', theatresController.newRoute);
router.post('/theatres', theatresController.createRoute);
router.get('/theatres/:uuid/edit', theatresController.editRoute);
router.put('/theatres/:uuid', theatresController.updateRoute);
router.delete('/theatres/:uuid', theatresController.deleteRoute);
router.get('/theatres/:uuid', theatresController.showRoute);
router.get('/theatres', theatresController.listRoute);

router.get('*', (request, response, next) => response.sendStatus(404));

export default router;
