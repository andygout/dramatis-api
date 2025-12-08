import { getStubUuid } from '../../test-e2e/test-helpers/index.js';

export const getRandomUuid = (instanceProps = {}) => {

	if (process.env.NODE_ENV === 'e2e-test') {

		return getStubUuid(instanceProps);

	}

	return crypto.randomUUID({ disableEntropyCache: true });

};
