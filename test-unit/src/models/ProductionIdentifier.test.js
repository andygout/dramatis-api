import { assert, createSandbox, spy, stub } from 'sinon';

import { ProductionIdentifier } from '../../../src/models';
import * as cypherQueries from '../../../src/neo4j/cypher-queries';
import * as neo4jQueryModule from '../../../src/neo4j/query';

describe('ProductionIdentifier model', () => {

	let stubs;
	let instance;

	const neo4jQueryMockResponse = { neo4jQueryMockResponseProperty: 'neo4jQueryMockResponseValue' };

	const sandbox = createSandbox();

	beforeEach(() => {

		stubs = {
			validationQueries: {
				getSubProductionChecksQuery:
					sandbox.stub(cypherQueries.validationQueries, 'getSubProductionChecksQuery')
						.returns('getSubProductionChecksQuery response')
			},
			neo4jQuery: sandbox.stub(neo4jQueryModule, 'neo4jQuery').resolves(neo4jQueryMockResponse)
		};

		instance = new ProductionIdentifier({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });

	});

	afterEach(() => {

		sandbox.restore();

	});

	describe('validateUuid method', () => {

		it('will call validateStringForProperty method', () => {

			spy(instance, 'validateStringForProperty');
			instance.validateUuid();
			assert.calledOnce(instance.validateStringForProperty);
			assert.calledWithExactly(instance.validateStringForProperty, 'uuid', { isRequired: false });

		});

	});

	describe('runDatabaseValidations method', () => {

		context('confirmExistenceInDatabase method resolves (i.e. production uuid exists in database)', () => {

			it('will not call addPropertyError method', async () => {

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

	describe('runSubProductionDatabaseValidations method', () => {

		context('valid data', () => {

			it('will not call addPropertyError method', async () => {

				stubs.neo4jQuery.resolves({
					exists: true,
					isAssignedToSurProduction: false,
					isSurSurProduction: false,
					isSurProductionOfSubjectProduction: false,
					isSubjectProductionASubSubProduction: false
				});
				spy(instance, 'addPropertyError');
				await instance.runSubProductionDatabaseValidations({
					subjectProductionUuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
				});
				assert.callOrder(
					stubs.validationQueries.getSubProductionChecksQuery,
					stubs.neo4jQuery
				);
				assert.calledOnce(stubs.validationQueries.getSubProductionChecksQuery);
				assert.calledWithExactly(stubs.validationQueries.getSubProductionChecksQuery);
				assert.calledOnce(stubs.neo4jQuery);
				assert.calledWithExactly(
					stubs.neo4jQuery,
					{
						query: 'getSubProductionChecksQuery response',
						params: {
							uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
							subjectProductionUuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
						}
					}
				);
				assert.notCalled(instance.addPropertyError);

			});

		});

		context('invalid data (instance does not exist)', () => {

			it('will call addPropertyError method', async () => {

				stubs.neo4jQuery.resolves({
					exists: false,
					isAssignedToSurProduction: false,
					isSurSurProduction: false,
					isSurProductionOfSubjectProduction: false,
					isSubjectProductionASubSubProduction: false
				});
				spy(instance, 'addPropertyError');
				await instance.runSubProductionDatabaseValidations({
					subjectProductionUuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
				});
				assert.callOrder(
					stubs.validationQueries.getSubProductionChecksQuery,
					stubs.neo4jQuery,
					instance.addPropertyError
				);
				assert.calledOnce(stubs.validationQueries.getSubProductionChecksQuery);
				assert.calledWithExactly(stubs.validationQueries.getSubProductionChecksQuery);
				assert.calledOnce(stubs.neo4jQuery);
				assert.calledWithExactly(
					stubs.neo4jQuery,
					{
						query: 'getSubProductionChecksQuery response',
						params: {
							uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
							subjectProductionUuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
						}
					}
				);
				assert.calledOnce(instance.addPropertyError);
				assert.calledWithExactly(
					instance.addPropertyError,
					'uuid', 'Production with this UUID does not exist'
				);

			});

		});

		context('invalid data (instance is already assigned to another sur-production)', () => {

			it('will call addPropertyError method', async () => {

				stubs.neo4jQuery.resolves({
					exists: true,
					isAssignedToSurProduction: true,
					isSurSurProduction: false,
					isSurProductionOfSubjectProduction: false,
					isSubjectProductionASubSubProduction: false
				});
				spy(instance, 'addPropertyError');
				await instance.runSubProductionDatabaseValidations({
					subjectProductionUuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
				});
				assert.callOrder(
					stubs.validationQueries.getSubProductionChecksQuery,
					stubs.neo4jQuery,
					instance.addPropertyError
				);
				assert.calledOnce(stubs.validationQueries.getSubProductionChecksQuery);
				assert.calledWithExactly(stubs.validationQueries.getSubProductionChecksQuery);
				assert.calledOnce(stubs.neo4jQuery);
				assert.calledWithExactly(
					stubs.neo4jQuery,
					{
						query: 'getSubProductionChecksQuery response',
						params: {
							uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
							subjectProductionUuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
						}
					}
				);
				assert.calledOnce(instance.addPropertyError);
				assert.calledWithExactly(
					instance.addPropertyError,
					'uuid', 'Production with this UUID is already assigned to another sur-production'
				);

			});

		});

		context('invalid data (instance is the sur-most production of a three-tiered production collection)', () => {

			it('will call addPropertyError method', async () => {

				stubs.neo4jQuery.resolves({
					exists: true,
					isAssignedToSurProduction: false,
					isSurSurProduction: true,
					isSurProductionOfSubjectProduction: false,
					isSubjectProductionASubSubProduction: false
				});
				spy(instance, 'addPropertyError');
				await instance.runSubProductionDatabaseValidations({
					subjectProductionUuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
				});
				assert.callOrder(
					stubs.validationQueries.getSubProductionChecksQuery,
					stubs.neo4jQuery,
					instance.addPropertyError
				);
				assert.calledOnce(stubs.validationQueries.getSubProductionChecksQuery);
				assert.calledWithExactly(stubs.validationQueries.getSubProductionChecksQuery);
				assert.calledOnce(stubs.neo4jQuery);
				assert.calledWithExactly(
					stubs.neo4jQuery,
					{
						query: 'getSubProductionChecksQuery response',
						params: {
							uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
							subjectProductionUuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
						}
					}
				);
				assert.calledOnce(instance.addPropertyError);
				assert.calledWithExactly(
					instance.addPropertyError,
					'uuid', 'Production with this UUID is the sur-most production of a three-tiered production collection'
				);

			});

		});

		context('invalid data (instance is the subject production\'s sur-production)', () => {

			it('will call addPropertyError method', async () => {

				stubs.neo4jQuery.resolves({
					exists: true,
					isAssignedToSurProduction: false,
					isSurSurProduction: false,
					isSurProductionOfSubjectProduction: true,
					isSubjectProductionASubSubProduction: false
				});
				spy(instance, 'addPropertyError');
				await instance.runSubProductionDatabaseValidations({
					subjectProductionUuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
				});
				assert.callOrder(
					stubs.validationQueries.getSubProductionChecksQuery,
					stubs.neo4jQuery,
					instance.addPropertyError
				);
				assert.calledOnce(stubs.validationQueries.getSubProductionChecksQuery);
				assert.calledWithExactly(stubs.validationQueries.getSubProductionChecksQuery);
				assert.calledOnce(stubs.neo4jQuery);
				assert.calledWithExactly(
					stubs.neo4jQuery,
					{
						query: 'getSubProductionChecksQuery response',
						params: {
							uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
							subjectProductionUuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
						}
					}
				);
				assert.calledOnce(instance.addPropertyError);
				assert.calledWithExactly(
					instance.addPropertyError,
					'uuid', 'Production with this UUID is this production\'s sur-production'
				);

			});

		});

		context('invalid data (instance cannot be assigned to a three-tiered production collection)', () => {

			it('will call addPropertyError method', async () => {

				stubs.neo4jQuery.resolves({
					exists: true,
					isAssignedToSurProduction: false,
					isSurSurProduction: false,
					isSurProductionOfSubjectProduction: false,
					isSubjectProductionASubSubProduction: true
				});
				spy(instance, 'addPropertyError');
				await instance.runSubProductionDatabaseValidations({
					subjectProductionUuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
				});
				assert.callOrder(
					stubs.validationQueries.getSubProductionChecksQuery,
					stubs.neo4jQuery,
					instance.addPropertyError
				);
				assert.calledOnce(stubs.validationQueries.getSubProductionChecksQuery);
				assert.calledWithExactly(stubs.validationQueries.getSubProductionChecksQuery);
				assert.calledOnce(stubs.neo4jQuery);
				assert.calledWithExactly(
					stubs.neo4jQuery,
					{
						query: 'getSubProductionChecksQuery response',
						params: {
							uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
							subjectProductionUuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
						}
					}
				);
				assert.calledOnce(instance.addPropertyError);
				assert.calledWithExactly(
					instance.addPropertyError,
					'uuid', 'Sub-production cannot be assigned to a three-tiered production collection'
				);

			});

		});

	});

});
