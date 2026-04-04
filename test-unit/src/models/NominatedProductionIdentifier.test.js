import { describe, it } from 'node:test';

import { NominatedProductionIdentifier } from '../../../src/models/index.js';

const context = describe;

describe('NominatedProductionIdentifier model', () => {
	describe('runDatabaseValidations method', () => {
		context(
			'confirmExistenceInDatabase method resolves with true (i.e. production uuid exists in database)',
			() => {
				it('will not call addPropertyError method', async (test) => {
					const instance = new NominatedProductionIdentifier({
						uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
					});

					test.mock.method(instance, 'confirmExistenceInDatabase', async () => true);
					test.mock.method(instance, 'addPropertyError', () => undefined);

					await instance.runDatabaseValidations();

					assert.strictEqual(instance.confirmExistenceInDatabase.mock.calls.length, 1);
					assert.deepStrictEqual(instance.confirmExistenceInDatabase.mock.calls[0].arguments, [{ model: 'PRODUCTION' }]);
					assert.strictEqual(instance.addPropertyError.mock.calls.length, 0);
				});
			}
		);

		context(
			'confirmExistenceInDatabase method resolves with false (i.e. production uuid does not exist in database)',
			() => {
				it('will call addPropertyError method', async (test) => {
					const instance = new NominatedProductionIdentifier({
						uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
					});

					test.mock.method(instance, 'confirmExistenceInDatabase', async () => false);
					test.mock.method(instance, 'addPropertyError', () => undefined);

					await instance.runDatabaseValidations();

					assert.strictEqual(instance.confirmExistenceInDatabase.mock.calls.length, 1);
					assert.deepStrictEqual(instance.confirmExistenceInDatabase.mock.calls[0].arguments, [{ model: 'PRODUCTION' }]);
					assert.strictEqual(instance.addPropertyError.mock.calls.length, 1);
					assert.deepStrictEqual(
						instance.addPropertyError.mock.calls[0].arguments,
						['uuid', 'Production with this UUID does not exist']
					);
				});
			}
		);
	});
});
