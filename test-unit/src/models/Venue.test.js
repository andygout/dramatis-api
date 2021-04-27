import { expect } from 'chai';
import { assert, createSandbox, spy } from 'sinon';

import * as getDuplicateIndicesModule from '../../../src/lib/get-duplicate-indices';
import Venue from '../../../src/models/Venue';

describe('Venue model', () => {

	let stubs;

	const sandbox = createSandbox();

	beforeEach(() => {

		stubs = {
			getDuplicateBaseInstanceIndices:
				sandbox.stub(getDuplicateIndicesModule, 'getDuplicateBaseInstanceIndices').returns([])
		};

	});

	afterEach(() => {

		sandbox.restore();

	});

	describe('constructor method', () => {

		describe('differentiator property', () => {

			it('assigns empty string if absent from props', () => {

				const instance = new Venue({ name: 'New Theatre' });
				expect(instance.differentiator).to.equal('');

			});

			it('assigns empty string if included in props but value is empty string', () => {

				const instance = new Venue({ name: 'New Theatre', differentiator: '' });
				expect(instance.differentiator).to.equal('');

			});

			it('assigns empty string if included in props but value is whitespace-only string', () => {

				const instance = new Venue({ name: 'New Theatre', differentiator: ' ' });
				expect(instance.differentiator).to.equal('');

			});

			it('assigns value if included in props and value is string with length', () => {

				const instance = new Venue({ name: 'New Theatre', differentiator: '1' });
				expect(instance.differentiator).to.equal('1');

			});

			it('trims value before assigning', () => {

				const instance = new Venue({ name: 'New Theatre', differentiator: ' 1 ' });
				expect(instance.differentiator).to.equal('1');

			});

		});

		describe('sub-venues property', () => {

			context('instance is subject', () => {

				it('assigns empty array if absent from props', () => {

					const instance = new Venue({ name: 'National Theatre' });
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
					const instance = new Venue(props);
					expect(instance.subVenues.length).to.equal(3);
					expect(instance.subVenues[0].constructor.name).to.equal('Venue');
					expect(instance.subVenues[1].constructor.name).to.equal('Venue');
					expect(instance.subVenues[2].constructor.name).to.equal('Venue');

				});

			});

			context('instance is not subject, i.e. it is an association of another instance', () => {

				it('will not assign any value if absent from props', () => {

					const instance = new Venue({ name: 'National Theatre', isAssociation: true });
					expect(instance).not.to.have.property('subVenues');

				});

				it('will not assign any value if included in props', () => {

					const props = {
						name: 'National Theatre',
						subVenues: [
							{
								name: 'Olivier Theatre'
							}
						],
						isAssociation: true
					};
					const instance = new Venue(props);
					expect(instance).not.to.have.property('subVenues');

				});

			});

		});

	});

	describe('runInputValidations method', () => {

		it('calls instance validate method and associated models\' validate methods', () => {

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
			const instance = new Venue(props);
			spy(instance, 'validateName');
			spy(instance, 'validateDifferentiator');
			spy(instance.subVenues[0], 'validateName');
			spy(instance.subVenues[0], 'validateDifferentiator');
			spy(instance.subVenues[0], 'validateNoAssociationWithSelf');
			spy(instance.subVenues[0], 'validateUniquenessInGroup');
			instance.runInputValidations();
			assert.callOrder(
				instance.validateName,
				instance.validateDifferentiator,
				stubs.getDuplicateBaseInstanceIndices,
				instance.subVenues[0].validateName,
				instance.subVenues[0].validateDifferentiator,
				instance.subVenues[0].validateNoAssociationWithSelf,
				instance.subVenues[0].validateUniquenessInGroup
			);
			expect(instance.validateName.calledOnce).to.be.true;
			expect(instance.validateName.calledWithExactly({ isRequired: true })).to.be.true;
			expect(instance.validateDifferentiator.calledOnce).to.be.true;
			expect(instance.validateDifferentiator.calledWithExactly()).to.be.true;
			expect(stubs.getDuplicateBaseInstanceIndices.calledOnce).to.be.true;
			expect(stubs.getDuplicateBaseInstanceIndices.calledWithExactly(
				instance.subVenues
			)).to.be.true;
			expect(instance.subVenues[0].validateName.calledOnce).to.be.true;
			expect(instance.subVenues[0].validateName.calledWithExactly({ isRequired: false })).to.be.true;
			expect(instance.subVenues[0].validateDifferentiator.calledOnce).to.be.true;
			expect(instance.subVenues[0].validateDifferentiator.calledWithExactly()).to.be.true;
			expect(instance.subVenues[0].validateNoAssociationWithSelf.calledOnce).to.be.true;
			expect(instance.subVenues[0].validateNoAssociationWithSelf.calledWithExactly(
				'National Theatre', ''
			)).to.be.true;
			expect(instance.subVenues[0].validateUniquenessInGroup.calledOnce).to.be.true;
			expect(instance.subVenues[0].validateUniquenessInGroup.calledWithExactly(
				{ isDuplicate: false }
			)).to.be.true;

		});

	});

});
