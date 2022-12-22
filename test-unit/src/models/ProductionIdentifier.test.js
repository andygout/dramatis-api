import { expect } from 'chai';
import { spy, stub } from 'sinon';

import { ProductionIdentifier } from '../../../src/models';

describe('ProductionIdentifier model', () => {

	describe('validateUuid method', () => {

		it('will call validateStringForProperty method', () => {

			const instance = new ProductionIdentifier({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });
			spy(instance, 'validateStringForProperty');
			instance.validateUuid();
			expect(instance.validateStringForProperty.calledOnce).to.be.true;
			expect(instance.validateStringForProperty.calledWithExactly('uuid', { isRequired: false })).to.be.true;

		});

	});

	describe('runDatabaseValidations method', () => {

		context('confirmExistenceInDatabase method resolves (i.e. production uuid exists in database)', () => {

			it('will not call addPropertyError method', async () => {

				const instance = new ProductionIdentifier({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });
				stub(instance, 'confirmExistenceInDatabase').resolves();
				spy(instance, 'addPropertyError');
				await instance.runDatabaseValidations();
				expect(instance.confirmExistenceInDatabase.calledOnce).to.be.true;
				expect(instance.confirmExistenceInDatabase.calledWithExactly({ model: 'PRODUCTION' })).to.be.true;
				expect(instance.addPropertyError.notCalled).to.be.true;

			});

		});

		context('confirmExistenceInDatabase method throws a \'Not Found\' error (i.e. production uuid does not exist in database)', () => {

			it('will call addPropertyError method', async () => {

				const instance = new ProductionIdentifier({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });
				stub(instance, 'confirmExistenceInDatabase').rejects(new Error('Not Found'));
				spy(instance, 'addPropertyError');
				await instance.runDatabaseValidations();
				expect(instance.confirmExistenceInDatabase.calledOnce).to.be.true;
				expect(instance.confirmExistenceInDatabase.calledWithExactly({ model: 'PRODUCTION' })).to.be.true;
				expect(instance.addPropertyError.calledOnce).to.be.true;
				expect(instance.addPropertyError.calledWithExactly(
					'uuid',
					'Production with this UUID does not exist'
				)).to.be.true;

			});

		});

	});

});
