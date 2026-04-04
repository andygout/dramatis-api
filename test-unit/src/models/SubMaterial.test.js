import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';

const context = describe;

describe('SubMaterial model', () => {
	let stubs;
	let SubMaterial;

	const neo4jQueryMockResponse = { neo4jQueryMockResponseProperty: 'neo4jQueryMockResponseValue' };

	beforeEach(async (test) => {
		stubs = {
			prepareAsParams: test.mock.fn(() => ({ name: 'NAME_VALUE', differentiator: 'DIFFERENTIATOR_VALUE' })),
			cypherQueriesModule: {
				validationQueries: {
					getSubMaterialChecksQuery: test.mock.fn(() => 'getSubMaterialChecksQuery response')
				}
			},
			neo4jQueryModule: {
				neo4jQuery: test.mock.fn(async () => neo4jQueryMockResponse)
			}
		};

		SubMaterial = await esmock(
			'../../../src/models/SubMaterial.js',
			{},
			// globalmocks: mock definitions imported everywhere.
			// Required for when functions are invoked by ancestor class methods.
			{
				'../../../src/lib/prepare-as-params.js': stubs.prepareAsParams,
				'../../../src/neo4j/cypher-queries/index.js': stubs.cypherQueriesModule,
				'../../../src/neo4j/query.js': stubs.neo4jQueryModule
			}
		);
	});

	describe('runDatabaseValidations method', () => {
		context('valid data', () => {
			it('will not call addPropertyError method', async (test) => {
				stubs.neo4jQueryModule.neo4jQuery.mock.mockImplementation(async () => ({
					isAssignedToSurMaterial: false,
					isSurSurMaterial: false,
					isSurMaterialOfSubjectMaterial: false,
					isSubjectMaterialASubSubMaterial: false
				}));

				const instance = new SubMaterial({ name: 'NAME_VALUE', differentiator: '1' });

				test.mock.method(instance, 'addPropertyError');

				await instance.runDatabaseValidations({
					subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
				});

				assert.equal(stubs.prepareAsParams.mock.callCount(), 1);
				assert.deepEqual(stubs.prepareAsParams.mock.calls[0].arguments, [instance]);
				assert.equal(stubs.cypherQueriesModule.validationQueries.getSubMaterialChecksQuery.mock.callCount(), 1);
				assert.deepEqual(
					stubs.cypherQueriesModule.validationQueries.getSubMaterialChecksQuery.mock.calls[0].arguments,
					[]
				);
				assert.equal(stubs.neo4jQueryModule.neo4jQuery.mock.callCount(), 1);
				assert.deepEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls[0].arguments, [{
					query: 'getSubMaterialChecksQuery response',
					params: {
						name: 'NAME_VALUE',
						differentiator: 'DIFFERENTIATOR_VALUE',
						subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
					}
				}]);
				assert.equal(instance.addPropertyError.mock.callCount(), 0);
			});
		});

		context('invalid data (instance is already assigned to another sur-material)', () => {
			it('will call addPropertyError method', async (test) => {
				stubs.neo4jQueryModule.neo4jQuery.mock.mockImplementation(async () => ({
					isAssignedToSurMaterial: true,
					isSurSurMaterial: false,
					isSurMaterialOfSubjectMaterial: false,
					isSubjectMaterialASubSubMaterial: false
				}));

				const instance = new SubMaterial({ name: 'NAME_VALUE', differentiator: '1' });

				test.mock.method(instance, 'addPropertyError');

				await instance.runDatabaseValidations({
					subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
				});

				assert.equal(stubs.prepareAsParams.mock.callCount(), 1);
				assert.deepEqual(stubs.prepareAsParams.mock.calls[0].arguments, [instance]);
				assert.equal(stubs.cypherQueriesModule.validationQueries.getSubMaterialChecksQuery.mock.callCount(), 1);
				assert.deepEqual(
					stubs.cypherQueriesModule.validationQueries.getSubMaterialChecksQuery.mock.calls[0].arguments,
					[]
				);
				assert.equal(stubs.neo4jQueryModule.neo4jQuery.mock.callCount(), 1);
				assert.deepEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls[0].arguments, [{
					query: 'getSubMaterialChecksQuery response',
					params: {
						name: 'NAME_VALUE',
						differentiator: 'DIFFERENTIATOR_VALUE',
						subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
					}
				}]);
				assert.equal(instance.addPropertyError.mock.callCount(), 2);
				assert.deepEqual(
					instance.addPropertyError.mock.calls[0].arguments,
					[
						'name',
						'Material with these attributes is already assigned to another sur-material'
					]
				);
				assert.deepEqual(
					instance.addPropertyError.mock.calls[1].arguments,
					[
						'differentiator',
						'Material with these attributes is already assigned to another sur-material'
					]
				);
			});
		});

		context('invalid data (instance is the sur-most material of a three-tiered material collection)', () => {
			it('will call addPropertyError method', async (test) => {
				stubs.neo4jQueryModule.neo4jQuery.mock.mockImplementation(async () => ({
					isAssignedToSurMaterial: false,
					isSurSurMaterial: true,
					isSurMaterialOfSubjectMaterial: false,
					isSubjectMaterialASubSubMaterial: false
				}));

				const instance = new SubMaterial({ name: 'NAME_VALUE', differentiator: '1' });

				test.mock.method(instance, 'addPropertyError');

				await instance.runDatabaseValidations({
					subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
				});

				assert.equal(stubs.prepareAsParams.mock.callCount(), 1);
				assert.deepEqual(stubs.prepareAsParams.mock.calls[0].arguments, [instance]);
				assert.equal(stubs.cypherQueriesModule.validationQueries.getSubMaterialChecksQuery.mock.callCount(), 1);
				assert.deepEqual(
					stubs.cypherQueriesModule.validationQueries.getSubMaterialChecksQuery.mock.calls[0].arguments,
					[]
				);
				assert.equal(stubs.neo4jQueryModule.neo4jQuery.mock.callCount(), 1);
				assert.deepEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls[0].arguments, [{
					query: 'getSubMaterialChecksQuery response',
					params: {
						name: 'NAME_VALUE',
						differentiator: 'DIFFERENTIATOR_VALUE',
						subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
					}
				}]);
				assert.equal(instance.addPropertyError.mock.callCount(), 2);
				assert.deepEqual(
					instance.addPropertyError.mock.calls[0].arguments,
					[
						'name',
						'Material with these attributes is the sur-most material of a three-tiered material collection'
					]
				);
				assert.deepEqual(
					instance.addPropertyError.mock.calls[1].arguments,
					[
						'differentiator',
						'Material with these attributes is the sur-most material of a three-tiered material collection'
					]
				);
			});
		});

		context("invalid data (instance is the subject material's sur-material)", () => {
			it('will call addPropertyError method', async (test) => {
				stubs.neo4jQueryModule.neo4jQuery.mock.mockImplementation(async () => ({
					isAssignedToSurMaterial: false,
					isSurSurMaterial: false,
					isSurMaterialOfSubjectMaterial: true,
					isSubjectMaterialASubSubMaterial: false
				}));

				const instance = new SubMaterial({ name: 'NAME_VALUE', differentiator: '1' });

				test.mock.method(instance, 'addPropertyError');

				await instance.runDatabaseValidations({
					subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
				});

				assert.equal(stubs.prepareAsParams.mock.callCount(), 1);
				assert.deepEqual(stubs.prepareAsParams.mock.calls[0].arguments, [instance]);
				assert.equal(stubs.cypherQueriesModule.validationQueries.getSubMaterialChecksQuery.mock.callCount(), 1);
				assert.deepEqual(
					stubs.cypherQueriesModule.validationQueries.getSubMaterialChecksQuery.mock.calls[0].arguments,
					[]
				);
				assert.equal(stubs.neo4jQueryModule.neo4jQuery.mock.callCount(), 1);
				assert.deepEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls[0].arguments, [{
					query: 'getSubMaterialChecksQuery response',
					params: {
						name: 'NAME_VALUE',
						differentiator: 'DIFFERENTIATOR_VALUE',
						subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
					}
				}]);
				assert.equal(instance.addPropertyError.mock.callCount(), 2);
				assert.deepEqual(
					instance.addPropertyError.mock.calls[0].arguments,
					[
						'name',
						"Material with these attributes is this material's sur-material"
					]
				);
				assert.deepEqual(
					instance.addPropertyError.mock.calls[1].arguments,
					[
						'differentiator',
						"Material with these attributes is this material's sur-material"
					]
				);
			});
		});

		context('invalid data (instance cannot be assigned to a three-tiered material collection)', () => {
			it('will call addPropertyError method', async (test) => {
				stubs.neo4jQueryModule.neo4jQuery.mock.mockImplementation(async () => ({
					isAssignedToSurMaterial: false,
					isSurSurMaterial: false,
					isSurMaterialOfSubjectMaterial: false,
					isSubjectMaterialASubSubMaterial: true
				}));

				const instance = new SubMaterial({ name: 'NAME_VALUE', differentiator: '1' });

				test.mock.method(instance, 'addPropertyError');

				await instance.runDatabaseValidations({
					subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
				});

				assert.equal(stubs.prepareAsParams.mock.callCount(), 1);
				assert.deepEqual(stubs.prepareAsParams.mock.calls[0].arguments, [instance]);
				assert.equal(stubs.cypherQueriesModule.validationQueries.getSubMaterialChecksQuery.mock.callCount(), 1);
				assert.deepEqual(
					stubs.cypherQueriesModule.validationQueries.getSubMaterialChecksQuery.mock.calls[0].arguments,
					[]
				);
				assert.equal(stubs.neo4jQueryModule.neo4jQuery.mock.callCount(), 1);
				assert.deepEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls[0].arguments, [{
					query: 'getSubMaterialChecksQuery response',
					params: {
						name: 'NAME_VALUE',
						differentiator: 'DIFFERENTIATOR_VALUE',
						subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
					}
				}]);
				assert.equal(instance.addPropertyError.mock.callCount(), 2);
				assert.deepEqual(
					instance.addPropertyError.mock.calls[0].arguments,
					[
						'name',
						'Sub-material cannot be assigned to a three-tiered material collection'
					]
				);
				assert.deepEqual(
					instance.addPropertyError.mock.calls[1].arguments,
					[
						'differentiator',
						'Sub-material cannot be assigned to a three-tiered material collection'
					]
				);
			});
		});
	});
});
