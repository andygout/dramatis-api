import { assert, createSandbox, spy } from 'sinon';

import { SubMaterial } from '../../../src/models';
import * as cypherQueries from '../../../src/neo4j/cypher-queries';
import * as neo4jQueryModule from '../../../src/neo4j/query';

describe('SubMaterial model', () => {

	let stubs;
	let instance;

	const neo4jQueryMockResponse = { neo4jQueryMockResponseProperty: 'neo4jQueryMockResponseValue' };

	const sandbox = createSandbox();

	beforeEach(() => {

		stubs = {
			validationQueries: {
				getSubMaterialChecksQuery:
					sandbox.stub(cypherQueries.validationQueries, 'getSubMaterialChecksQuery')
						.returns('getSubMaterialChecksQuery response')
			},
			neo4jQuery: sandbox.stub(neo4jQueryModule, 'neo4jQuery').resolves(neo4jQueryMockResponse)
		};

		instance = new SubMaterial({ name: 'Foobar', differentiator: '1' });

	});

	afterEach(() => {

		sandbox.restore();

	});

	describe('runDatabaseValidations method', () => {

		context('valid data', () => {

			it('will not call addPropertyError method', async () => {

				stubs.neo4jQuery.resolves({
					isAssignedToSurMaterial: false,
					isSurSurMaterial: false,
					isSurMaterialOfSubjectMaterial: false,
					isSubjectMaterialASubSubMaterial: false
				});
				spy(instance, 'addPropertyError');
				await instance.runDatabaseValidations({
					subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
				});
				assert.callOrder(
					stubs.validationQueries.getSubMaterialChecksQuery,
					stubs.neo4jQuery
				);
				assert.calledOnce(stubs.validationQueries.getSubMaterialChecksQuery);
				assert.calledWithExactly(stubs.validationQueries.getSubMaterialChecksQuery);
				assert.calledOnce(stubs.neo4jQuery);
				assert.calledWithExactly(
					stubs.neo4jQuery,
					{
						query: 'getSubMaterialChecksQuery response',
						params: {
							name: 'Foobar',
							differentiator: '1',
							subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
						}
					}
				);
				assert.notCalled(instance.addPropertyError);

			});

		});

		context('invalid data (instance is already assigned to another sur-material)', () => {

			it('will call addPropertyError method', async () => {

				stubs.neo4jQuery.resolves({
					isAssignedToSurMaterial: true,
					isSurSurMaterial: false,
					isSurMaterialOfSubjectMaterial: false,
					isSubjectMaterialASubSubMaterial: false
				});
				spy(instance, 'addPropertyError');
				await instance.runDatabaseValidations({
					subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
				});
				assert.callOrder(
					stubs.validationQueries.getSubMaterialChecksQuery,
					stubs.neo4jQuery,
					instance.addPropertyError
				);
				assert.calledOnce(stubs.validationQueries.getSubMaterialChecksQuery);
				assert.calledWithExactly(stubs.validationQueries.getSubMaterialChecksQuery);
				assert.calledOnce(stubs.neo4jQuery);
				assert.calledWithExactly(
					stubs.neo4jQuery,
					{
						query: 'getSubMaterialChecksQuery response',
						params: {
							name: 'Foobar',
							differentiator: '1',
							subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
						}
					}
				);
				assert.calledTwice(instance.addPropertyError);
				assert.calledWithExactly(
					instance.addPropertyError.firstCall,
					'name', 'Material with these attributes is already assigned to another sur-material'
				);
				assert.calledWithExactly(
					instance.addPropertyError.secondCall,
					'differentiator', 'Material with these attributes is already assigned to another sur-material'
				);

			});

		});

		context('invalid data (instance is the sur-most material of a three-tiered material collection)', () => {

			it('will call addPropertyError method', async () => {

				stubs.neo4jQuery.resolves({
					isAssignedToSurMaterial: false,
					isSurSurMaterial: true,
					isSurMaterialOfSubjectMaterial: false,
					isSubjectMaterialASubSubMaterial: false
				});
				spy(instance, 'addPropertyError');
				await instance.runDatabaseValidations({
					subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
				});
				assert.callOrder(
					stubs.validationQueries.getSubMaterialChecksQuery,
					stubs.neo4jQuery,
					instance.addPropertyError
				);
				assert.calledOnce(stubs.validationQueries.getSubMaterialChecksQuery);
				assert.calledWithExactly(stubs.validationQueries.getSubMaterialChecksQuery);
				assert.calledOnce(stubs.neo4jQuery);
				assert.calledWithExactly(
					stubs.neo4jQuery,
					{
						query: 'getSubMaterialChecksQuery response',
						params: {
							name: 'Foobar',
							differentiator: '1',
							subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
						}
					}
				);
				assert.calledTwice(instance.addPropertyError);
				assert.calledWithExactly(
					instance.addPropertyError.firstCall,
					'name', 'Material with these attributes is the sur-most material of a three-tiered material collection'
				);
				assert.calledWithExactly(
					instance.addPropertyError.secondCall,
					'differentiator', 'Material with these attributes is the sur-most material of a three-tiered material collection'
				);

			});

		});

		context('invalid data (instance is the subject material\'s sur-material)', () => {

			it('will call addPropertyError method', async () => {

				stubs.neo4jQuery.resolves({
					isAssignedToSurMaterial: false,
					isSurSurMaterial: false,
					isSurMaterialOfSubjectMaterial: true,
					isSubjectMaterialASubSubMaterial: false
				});
				spy(instance, 'addPropertyError');
				await instance.runDatabaseValidations({
					subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
				});
				assert.callOrder(
					stubs.validationQueries.getSubMaterialChecksQuery,
					stubs.neo4jQuery,
					instance.addPropertyError
				);
				assert.calledOnce(stubs.validationQueries.getSubMaterialChecksQuery);
				assert.calledWithExactly(stubs.validationQueries.getSubMaterialChecksQuery);
				assert.calledOnce(stubs.neo4jQuery);
				assert.calledWithExactly(
					stubs.neo4jQuery,
					{
						query: 'getSubMaterialChecksQuery response',
						params: {
							name: 'Foobar',
							differentiator: '1',
							subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
						}
					}
				);
				assert.calledTwice(instance.addPropertyError);
				assert.calledWithExactly(
					instance.addPropertyError.firstCall,
					'name', 'Material with these attributes is this material\'s sur-material'
				);
				assert.calledWithExactly(
					instance.addPropertyError.secondCall,
					'differentiator', 'Material with these attributes is this material\'s sur-material'
				);

			});

		});

		context('invalid data (instance cannot be assigned to a three-tiered material collection)', () => {

			it('will call addPropertyError method', async () => {

				stubs.neo4jQuery.resolves({
					isAssignedToSurMaterial: false,
					isSurSurMaterial: false,
					isSurMaterialOfSubjectMaterial: false,
					isSubjectMaterialASubSubMaterial: true
				});
				spy(instance, 'addPropertyError');
				await instance.runDatabaseValidations({
					subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
				});
				assert.callOrder(
					stubs.validationQueries.getSubMaterialChecksQuery,
					stubs.neo4jQuery,
					instance.addPropertyError
				);
				assert.calledOnce(stubs.validationQueries.getSubMaterialChecksQuery);
				assert.calledWithExactly(stubs.validationQueries.getSubMaterialChecksQuery);
				assert.calledOnce(stubs.neo4jQuery);
				assert.calledWithExactly(
					stubs.neo4jQuery,
					{
						query: 'getSubMaterialChecksQuery response',
						params: {
							name: 'Foobar',
							differentiator: '1',
							subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
						}
					}
				);
				assert.calledTwice(instance.addPropertyError);
				assert.calledWithExactly(
					instance.addPropertyError.firstCall,
					'name', 'Sub-material cannot be assigned to a three-tiered material collection'
				);
				assert.calledWithExactly(
					instance.addPropertyError.secondCall,
					'differentiator', 'Sub-material cannot be assigned to a three-tiered material collection'
				);

			});

		});

	});

});
