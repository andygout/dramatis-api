import { randomUUID } from 'node:crypto';

import { getStubUuid } from '../../test-e2e/test-helpers/index.js';

export const getRandomUuid = (opts = {}) => {

	if (process.env.NODE_ENV === 'e2e-test') {

		return getStubUuid(opts);

	}

	return randomUUID({ disableEntropyCache: true });

};
