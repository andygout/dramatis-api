import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { assert, createStubInstance, spy, stub } from 'sinon';

import { SubVenue } from '../../../src/models';

describe('Venue model', () => {

	let stubs;

	const SubVenueStub = function () {

		return createStubInstance(SubVenue);

	};

	beforeEach(() => {

		stubs = {
			getDuplicateIndicesModule: {
				getDuplicateBaseInstanceIndices: stub().returns([])
			},
			models: {
				SubVenue: SubVenueStub
			}
		};

	});

	const createSubject = () =>

		proxyquire('../../../src/models/Venue', {
			'../lib/get-duplicate-indices': stubs.getDuplicateIndicesModule,
			'.': stubs.models
		}).default;

	const createInstance = props => {

		const Venue = createSubject();

		return new Venue(props);

	};

	describe('constructor method', () => {

		describe('sub-venues property', () => {

			it('assigns empty array if absent from props', () => {

				const instance = createInstance({ name: 'National Theatre' });
				expect(instance.subVenues).to.deep.equal([]);

			});

			it('assigns array of sub-venues if included in props, retaining those with empty or whitespace-only string names', () => {

				const props = {
					name: 'National Theatre',
					subVenues: [
						{
							name: 'Olivier Theatre'
						},
						{
							name: ''
						},
						{
							name: ' '
						}
					]
				};
				const instance = createInstance(props);
				expect(instance.subVenues.length).to.equal(3);
				expect(instance.subVenues[0] instanceof SubVenue).to.be.true;
				expect(instance.subVenues[1] instanceof SubVenue).to.be.true;
				expect(instance.subVenues[2] instanceof SubVenue).to.be.true;

			});

		});

	});

	describe('runInputValidations method', () => {

		it('calls instance\'s validate methods and associated models\' validate methods', () => {

			const props = {
				name: 'National Theatre',
				differentiator: '',
				subVenues: [
					{
						name: 'Olivier Theatre',
						differentiator: ''
					}
				]
			};
			const instance = createInstance(props);
			spy(instance, 'validateName');
			spy(instance, 'validateDifferentiator');
			instance.runInputValidations();
			assert.callOrder(
				instance.validateName,
				instance.validateDifferentiator,
				stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices,
				instance.subVenues[0].validateName,
				instance.subVenues[0].validateDifferentiator,
				instance.subVenues[0].validateNoAssociationWithSelf,
				instance.subVenues[0].validateUniquenessInGroup
			);
			assert.calledOnce(instance.validateName);
			assert.calledWithExactly(instance.validateName, { isRequired: true });
			assert.calledOnce(instance.validateDifferentiator);
			assert.calledWithExactly(instance.validateDifferentiator);
			assert.calledOnce(stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices);
			assert.calledWithExactly(
				stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices,
				instance.subVenues
			);
			assert.calledOnce(instance.subVenues[0].validateName);
			assert.calledWithExactly(instance.subVenues[0].validateName, { isRequired: false });
			assert.calledOnce(instance.subVenues[0].validateDifferentiator);
			assert.calledWithExactly(instance.subVenues[0].validateDifferentiator);
			assert.calledOnce(instance.subVenues[0].validateNoAssociationWithSelf);
			assert.calledWithExactly(
				instance.subVenues[0].validateNoAssociationWithSelf,
				{ name: 'National Theatre', differentiator: '' }
			);
			assert.calledOnce(instance.subVenues[0].validateUniquenessInGroup);
			assert.calledWithExactly(
				instance.subVenues[0].validateUniquenessInGroup,
				{ isDuplicate: false }
			);

		});

	});

	describe('runDatabaseValidations method', () => {

		it('calls associated sub-venues\' runDatabaseValidations method', async () => {

			const props = {
				uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
				name: 'National Theatre',
				subVenues: [
					{
						name: 'Olivier Theatre'
					}
				]
			};
			const instance = createInstance(props);
			stub(instance, 'validateUniquenessInDatabase');
			await instance.runDatabaseValidations();
			assert.calledOnce(instance.validateUniquenessInDatabase);
			assert.calledWithExactly(instance.validateUniquenessInDatabase);
			assert.calledOnce(instance.subVenues[0].runDatabaseValidations);
			assert.calledWithExactly(
				instance.subVenues[0].runDatabaseValidations,
				{ subjectVenueUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' }
			);

		});

	});

});
