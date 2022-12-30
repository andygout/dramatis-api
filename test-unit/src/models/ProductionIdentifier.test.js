import { assert, spy, stub } from 'sinon';

import { ProductionIdentifier } from '../../../src/models';

describe('ProductionIdentifier model', () => {

	describe('validateUuid method', () => {

		it('will call validateStringForProperty method', () => {

			const instance = new ProductionIdentifier({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });
			spy(instance, 'validateStringForProperty');
			instance.validateUuid();
			assert.calledOnce(instance.validateStringForProperty);
			assert.calledWithExactly(instance.validateStringForProperty, 'uuid', { isRequired: false });

		});

	});

	describe('runDatabaseValidations method', () => {

		context('confirmExistenceInDatabase method resolves (i.e. production uuid exists in database)', () => {

			it('will not call addPropertyError method', async () => {

				const instance = new ProductionIdentifier({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });
				stub(instance, 'confirmExistenceInDatabase').resolves();
				spy(instance, 'addPropertyError');
				await instance.runDatabaseValidations();
				assert.calledOnce(instance.confirmExistenceInDatabase);
				assert.calledWithExactly(instance.confirmExistenceInDatabase, { model: 'PRODUCTION' });
				assert.notCalled(instance.addPropertyError);

			});

		});

		context('confirmExistenceInDatabase method throws a \'Not Found\' error (i.e. production uuid does not exist in database)', () => {

			it('will call addPropertyError method', async () => {

				const instance = new ProductionIdentifier({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });
				stub(instance, 'confirmExistenceInDatabase').rejects(new Error('Not Found'));
				spy(instance, 'addPropertyError');
				await instance.runDatabaseValidations();
				assert.calledOnce(instance.confirmExistenceInDatabase);
				assert.calledWithExactly(instance.confirmExistenceInDatabase, { model: 'PRODUCTION' });
				assert.calledOnce(instance.addPropertyError);
				assert.calledWithExactly(
					instance.addPropertyError,
					'uuid', 'Production with this UUID does not exist'
				);

			});

		});

	});

});
