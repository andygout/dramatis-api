import { expect } from 'chai';
import { assert, createSandbox, spy } from 'sinon';

import * as getDuplicateBaseInstanceIndicesModule from '../../../src/lib/get-duplicate-base-instance-indices';
import Theatre from '../../../src/models/Theatre';

describe('Theatre model', () => {

	let stubs;

	const sandbox = createSandbox();

	beforeEach(() => {

		stubs = {
			getDuplicateBaseInstanceIndices:
				sandbox.stub(getDuplicateBaseInstanceIndicesModule, 'getDuplicateBaseInstanceIndices').returns([])
		};

	});

	afterEach(() => {

		sandbox.restore();

	});

	describe('constructor method', () => {

		describe('differentiator property', () => {

			it('assigns empty string if absent from props', () => {

				const instance = new Theatre({ name: 'New Theatre' });
				expect(instance.differentiator).to.equal('');

			});

			it('assigns empty string if included in props but value is empty string', () => {

				const instance = new Theatre({ name: 'New Theatre', differentiator: '' });
				expect(instance.differentiator).to.equal('');

			});

			it('assigns empty string if included in props but value is whitespace-only string', () => {

				const instance = new Theatre({ name: 'New Theatre', differentiator: ' ' });
				expect(instance.differentiator).to.equal('');

			});

			it('assigns value if included in props and value is string with length', () => {

				const instance = new Theatre({ name: 'New Theatre', differentiator: '1' });
				expect(instance.differentiator).to.equal('1');

			});

			it('trims value before assigning', () => {

				const instance = new Theatre({ name: 'New Theatre', differentiator: ' 1 ' });
				expect(instance.differentiator).to.equal('1');

			});

		});

		describe('sub-theatres property', () => {

			context('instance is subject', () => {

				it('assigns empty array if absent from props', () => {

					const instance = new Theatre({ name: 'National Theatre' });
					expect(instance.subTheatres).to.deep.equal([]);

				});

				it('assigns array of sub-theatres if included in props, retaining those with empty or whitespace-only string names', () => {

					const props = {
						name: 'National Theatre',
						subTheatres: [
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
					const instance = new Theatre(props);
					expect(instance.subTheatres.length).to.equal(3);
					expect(instance.subTheatres[0].constructor.name).to.equal('Theatre');
					expect(instance.subTheatres[1].constructor.name).to.equal('Theatre');
					expect(instance.subTheatres[2].constructor.name).to.equal('Theatre');

				});

			});

			context('instance is not subject, i.e. it is an association of another instance', () => {

				it('will not assign any value if absent from props', () => {

					const instance = new Theatre({ name: 'National Theatre', isAssociation: true });
					expect(instance).not.to.have.property('subTheatres');

				});

				it('will not assign any value if included in props', () => {

					const props = {
						name: 'National Theatre',
						subTheatres: [
							{
								name: 'Olivier Theatre'
							}
						],
						isAssociation: true
					};
					const instance = new Theatre(props);
					expect(instance).not.to.have.property('subTheatres');

				});

			});

		});

	});

	describe('runInputValidations method', () => {

		it('calls instance validate method and associated models\' validate methods', () => {

			const props = {
				name: 'National Theatre',
				differentiator: '',
				subTheatres: [
					{
						name: 'Olivier Theatre',
						differentiator: ''
					}
				]
			};
			const instance = new Theatre(props);
			spy(instance, 'validateName');
			spy(instance, 'validateDifferentiator');
			spy(instance.subTheatres[0], 'validateName');
			spy(instance.subTheatres[0], 'validateDifferentiator');
			spy(instance.subTheatres[0], 'validateNotSubTheatreOfSelf');
			spy(instance.subTheatres[0], 'validateUniquenessInGroup');
			instance.runInputValidations();
			assert.callOrder(
				instance.validateName,
				instance.validateDifferentiator,
				stubs.getDuplicateBaseInstanceIndices,
				instance.subTheatres[0].validateName,
				instance.subTheatres[0].validateDifferentiator,
				instance.subTheatres[0].validateNotSubTheatreOfSelf,
				instance.subTheatres[0].validateUniquenessInGroup
			);
			expect(instance.validateName.calledOnce).to.be.true;
			expect(instance.validateName.calledWithExactly({ isRequired: true })).to.be.true;
			expect(instance.validateDifferentiator.calledOnce).to.be.true;
			expect(instance.validateDifferentiator.calledWithExactly()).to.be.true;
			expect(stubs.getDuplicateBaseInstanceIndices.calledOnce).to.be.true;
			expect(stubs.getDuplicateBaseInstanceIndices.calledWithExactly(
				instance.subTheatres
			)).to.be.true;
			expect(instance.subTheatres[0].validateName.calledOnce).to.be.true;
			expect(instance.subTheatres[0].validateName.calledWithExactly({ isRequired: false })).to.be.true;
			expect(instance.subTheatres[0].validateDifferentiator.calledOnce).to.be.true;
			expect(instance.subTheatres[0].validateDifferentiator.calledWithExactly()).to.be.true;
			expect(instance.subTheatres[0].validateNotSubTheatreOfSelf.calledOnce).to.be.true;
			expect(instance.subTheatres[0].validateNotSubTheatreOfSelf.calledWithExactly(
				'National Theatre', ''
			)).to.be.true;
			expect(instance.subTheatres[0].validateUniquenessInGroup.calledOnce).to.be.true;
			expect(instance.subTheatres[0].validateUniquenessInGroup.calledWithExactly(
				{ isDuplicate: false }
			)).to.be.true;

		});

	});

	describe('validateNotSubTheatreOfSelf method', () => {

		context('valid data', () => {

			context('sur-theatre instance has name value of empty string', () => {

				it('will not add properties to errors property', () => {

					const instance = new Theatre({ name: 'National Theatre', differentiator: '' });
					spy(instance, 'addPropertyError');
					instance.validateNotSubTheatreOfSelf('', '');
					expect(instance.addPropertyError.notCalled).to.be.true;

				});

			});

			context('sur-theatre name and differentiator combination different to instance name and differentiator combination', () => {

				it('will not add properties to errors property', () => {

					const instance = new Theatre({ name: 'Olivier Theatre', differentiator: '' });
					spy(instance, 'addPropertyError');
					instance.validateNotSubTheatreOfSelf('National Theatre', '');
					expect(instance.addPropertyError.notCalled).to.be.true;

				});

			});

		});

		context('invalid data', () => {

			it('adds properties whose values are arrays to errors property', () => {

				const instance = new Theatre({ name: 'National Theatre', differentiator: '' });
				spy(instance, 'addPropertyError');
				instance.validateNotSubTheatreOfSelf('National Theatre', '');
				expect(instance.addPropertyError.calledTwice).to.be.true;
				expect(instance.addPropertyError.firstCall.calledWithExactly(
					'name',
					'Theatre cannot assign iself as one of its sub-theatres'
				)).to.be.true;
				expect(instance.addPropertyError.secondCall.calledWithExactly(
					'differentiator',
					'Theatre cannot assign iself as one of its sub-theatres'
				)).to.be.true;

			});

		});

	});

});
