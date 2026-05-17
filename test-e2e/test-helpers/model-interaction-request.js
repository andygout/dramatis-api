import supertest from 'supertest';

import { flushModelInteractionSeedQueue, queueModelInteractionSeed } from './model-interaction-seed-queue.js';

export default (app) => {
	const request = supertest(app);

	return {
		get: async (...args) => {
			await flushModelInteractionSeedQueue();

			return request.get(...args);
		},
		post: (path) => ({
			send: async (body) => {
				queueModelInteractionSeed(path, body);

				return { status: 201 };
			}
		})
	};
};
