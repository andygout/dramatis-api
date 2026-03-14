import { afterEach, describe, it } from 'node:test';

import { assert as sinonAssert, restore, spy, stub } from 'sinon';

import { NominatedProductionIdentifier } from '../../../src/models/index.js';

const context = describe;

describe('NominatedProductionIdentifier model', () => {
	afterEach(() => {
		restore();
	});

	describe('runDatabaseValidations method', () => {
		context(
			'confirmExistenceInDatabase method resolves with true (i.e. production uuid exists in database)',
			() => {
				it('will not call addPropertyError method', async () => {
					const instance = new NominatedProductionIdentifier({
						uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
					});

					stub(instance, 'confirmExistenceInDatabase').resolves(true);

					spy(instance, 'addPropertyError');

					await instance.runDatabaseValidations();

					sinonAssert.calledOnceWithExactly(instance.confirmExistenceInDatabase, { model: 'PRODUCTION' });
					sinonAssert.notCalled(instance.addPropertyError);
				});
			}
		);

		context(
			'confirmExistenceInDatabase method resolves with false (i.e. production uuid does not exist in database)',
			() => {
				it('will call addPropertyError method', async () => {
					const instance = new NominatedProductionIdentifier({
						uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
					});

					stub(instance, 'confirmExistenceInDatabase').resolves(false);

					spy(instance, 'addPropertyError');

					await instance.runDatabaseValidations();

					sinonAssert.calledOnceWithExactly(instance.confirmExistenceInDatabase, { model: 'PRODUCTION' });
					sinonAssert.calledOnceWithExactly(
						instance.addPropertyError,
						'uuid',
						'Production with this UUID does not exist'
					);
				});
			}
		);
	});
});
