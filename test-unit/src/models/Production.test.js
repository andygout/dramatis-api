import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { assert, createStubInstance, spy, stub } from 'sinon';

import { CastMember, CreativeCredit, CrewCredit, MaterialBase, ProducerCredit, VenueBase } from '../../../src/models';

describe('Production model', () => {

	let stubs;

	const CastMemberStub = function () {

		return createStubInstance(CastMember);

	};

	const CreativeCreditStub = function () {

		return createStubInstance(CreativeCredit);

	};

	const CrewCreditStub = function () {

		return createStubInstance(CrewCredit);

	};

	const MaterialBaseStub = function () {

		return createStubInstance(MaterialBase);

	};

	const ProducerCreditStub = function () {

		return createStubInstance(ProducerCredit);

	};

	const VenueBaseStub = function () {

		return createStubInstance(VenueBase);

	};

	beforeEach(() => {

		stubs = {
			getDuplicateIndicesModule: {
				getDuplicateBaseInstanceIndices: stub().returns([]),
				getDuplicateNameIndices: stub().returns([])
			},
			Base: {
				neo4jQueryModule: {
					neo4jQuery: stub()
				}
			},
			models: {
				CastMember: CastMemberStub,
				CreativeCredit: CreativeCreditStub,
				CrewCredit: CrewCreditStub,
				MaterialBase: MaterialBaseStub,
				ProducerCredit: ProducerCreditStub,
				VenueBase: VenueBaseStub
			}
		};

	});

	const createSubject = () =>
		proxyquire('../../../src/models/Production', {
			'../lib/get-duplicate-indices': stubs.getDuplicateIndicesModule,
			'./Base': proxyquire('../../../src/models/Base', {
				'../neo4j/query': stubs.Base.neo4jQueryModule
			}),
			'.': stubs.models
		}).default;

	const createInstance = props => {

		const Production = createSubject();

		return new Production(props);

	};

	describe('constructor method', () => {

		describe('startDate property', () => {

			it('assigns empty string if absent from props', () => {

				const instance = createInstance({ name: 'Hamlet' });
				expect(instance.startDate).to.equal('');

			});

			it('assigns empty string if included in props but value is empty string', () => {

				const instance = createInstance({ name: 'Hamlet', startDate: '' });
				expect(instance.startDate).to.equal('');

			});

			it('assigns empty string if included in props but value is whitespace-only string', () => {

				const instance = createInstance({ name: 'Hamlet', startDate: ' ' });
				expect(instance.startDate).to.equal('');

			});

			it('assigns value if included in props and value is string with length', () => {

				const instance = createInstance({ name: 'Hamlet', startDate: '2010-09-30' });
				expect(instance.startDate).to.equal('2010-09-30');

			});

			it('trims value before assigning', () => {

				const instance = createInstance({ name: 'Hamlet', startDate: ' 2010-09-30 ' });
				expect(instance.startDate).to.equal('2010-09-30');

			});

		});

		describe('pressDate property', () => {

			it('assigns empty string if absent from props', () => {

				const instance = createInstance({ name: 'Hamlet' });
				expect(instance.pressDate).to.equal('');

			});

			it('assigns empty string if included in props but value is empty string', () => {

				const instance = createInstance({ name: 'Hamlet', pressDate: '' });
				expect(instance.pressDate).to.equal('');

			});

			it('assigns empty string if included in props but value is whitespace-only string', () => {

				const instance = createInstance({ name: 'Hamlet', pressDate: ' ' });
				expect(instance.pressDate).to.equal('');

			});

			it('assigns value if included in props and value is string with length', () => {

				const instance = createInstance({ name: 'Hamlet', pressDate: '2010-10-07' });
				expect(instance.pressDate).to.equal('2010-10-07');

			});

			it('trims value before assigning', () => {

				const instance = createInstance({ name: 'Hamlet', pressDate: ' 2010-10-07 ' });
				expect(instance.pressDate).to.equal('2010-10-07');

			});

		});

		describe('endDate property', () => {

			it('assigns empty string if absent from props', () => {

				const instance = createInstance({ name: 'Hamlet' });
				expect(instance.endDate).to.equal('');

			});

			it('assigns empty string if included in props but value is empty string', () => {

				const instance = createInstance({ name: 'Hamlet', endDate: '' });
				expect(instance.endDate).to.equal('');

			});

			it('assigns empty string if included in props but value is whitespace-only string', () => {

				const instance = createInstance({ name: 'Hamlet', endDate: ' ' });
				expect(instance.endDate).to.equal('');

			});

			it('assigns value if included in props and value is string with length', () => {

				const instance = createInstance({ name: 'Hamlet', endDate: '2011-01-26' });
				expect(instance.endDate).to.equal('2011-01-26');

			});

			it('trims value before assigning', () => {

				const instance = createInstance({ name: 'Hamlet', endDate: ' 2011-01-26 ' });
				expect(instance.endDate).to.equal('2011-01-26');

			});

		});

		describe('producerCredits property', () => {

			it('assigns empty array if absent from props', () => {

				const instance = createInstance({ name: 'Hamlet' });
				expect(instance.producerCredits).to.deep.equal([]);

			});

			it('assigns array of produucerCredits if included in props, retaining those with empty or whitespace-only string names', () => {

				const props = {
					name: 'Hamlet',
					producerCredits: [
						{
							name: 'Produced by'
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
				expect(instance.producerCredits.length).to.equal(3);
				expect(instance.producerCredits[0] instanceof ProducerCredit).to.be.true;
				expect(instance.producerCredits[1] instanceof ProducerCredit).to.be.true;
				expect(instance.producerCredits[2] instanceof ProducerCredit).to.be.true;

			});

		});

		describe('cast property', () => {

			it('assigns empty array if absent from props', () => {

				const instance = createInstance({ name: 'Hamlet' });
				expect(instance.cast).to.deep.equal([]);

			});

			it('assigns array of cast if included in props, retaining those with empty or whitespace-only string names', () => {

				const props = {
					name: 'Hamlet',
					cast: [
						{
							name: 'Patrick Stewart'
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
				expect(instance.cast.length).to.equal(3);
				expect(instance.cast[0] instanceof CastMember).to.be.true;
				expect(instance.cast[1] instanceof CastMember).to.be.true;
				expect(instance.cast[2] instanceof CastMember).to.be.true;

			});

		});

		describe('creativeCredits property', () => {

			it('assigns empty array if absent from props', () => {

				const instance = createInstance({ name: 'Hamlet' });
				expect(instance.creativeCredits).to.deep.equal([]);

			});

			it('assigns array of creativeCredits if included in props, retaining those with empty or whitespace-only string names', () => {

				const props = {
					name: 'Hamlet',
					creativeCredits: [
						{
							name: 'Sound Designer'
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
				expect(instance.creativeCredits.length).to.equal(3);
				expect(instance.creativeCredits[0] instanceof CreativeCredit).to.be.true;
				expect(instance.creativeCredits[1] instanceof CreativeCredit).to.be.true;
				expect(instance.creativeCredits[2] instanceof CreativeCredit).to.be.true;

			});

		});

		describe('crewCredits property', () => {

			it('assigns empty array if absent from props', () => {

				const instance = createInstance({ name: 'Hamlet' });
				expect(instance.crewCredits).to.deep.equal([]);

			});

			it('assigns array of crewCredits if included in props, retaining those with empty or whitespace-only string names', () => {

				const props = {
					name: 'Hamlet',
					crewCredits: [
						{
							name: 'Stage Manager'
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
				expect(instance.crewCredits.length).to.equal(3);
				expect(instance.crewCredits[0] instanceof CrewCredit).to.be.true;
				expect(instance.crewCredits[1] instanceof CrewCredit).to.be.true;
				expect(instance.crewCredits[2] instanceof CrewCredit).to.be.true;

			});

		});

	});

	describe('runInputValidations method', () => {

		it('calls instance validate method and associated models\' validate methods', () => {

			const props = {
				name: 'Hamlet',
				producerCredits: [
					{
						name: 'Produced by'
					}
				],
				cast: [
					{
						name: 'Patrick Stewart'
					}
				],
				creativeCredits: [
					{
						name: 'Sound Designer'
					}
				],
				crewCredits: [
					{
						name: 'Stage Manager'
					}
				]
			};
			const instance = createInstance(props);
			spy(instance, 'validateName');
			spy(instance, 'validateDates');
			instance.runInputValidations();
			assert.callOrder(
				instance.validateName,
				instance.validateDates,
				instance.material.validateName,
				instance.material.validateDifferentiator,
				instance.venue.validateName,
				instance.venue.validateDifferentiator,
				stubs.getDuplicateIndicesModule.getDuplicateNameIndices,
				instance.producerCredits[0].runInputValidations,
				stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices,
				instance.cast[0].runInputValidations,
				stubs.getDuplicateIndicesModule.getDuplicateNameIndices,
				instance.creativeCredits[0].runInputValidations,
				stubs.getDuplicateIndicesModule.getDuplicateNameIndices,
				instance.crewCredits[0].runInputValidations
			);
			expect(instance.validateName.calledOnce).to.be.true;
			expect(instance.validateName.calledWithExactly({ isRequired: true })).to.be.true;
			expect(instance.validateDates.calledOnce).to.be.true;
			expect(instance.validateDates.calledWithExactly()).to.be.true;
			expect(instance.material.validateName.calledOnce).to.be.true;
			expect(instance.material.validateName.calledWithExactly({ isRequired: false })).to.be.true;
			expect(instance.material.validateDifferentiator.calledOnce).to.be.true;
			expect(instance.material.validateDifferentiator.calledWithExactly()).to.be.true;
			expect(instance.venue.validateName.calledOnce).to.be.true;
			expect(instance.venue.validateName.calledWithExactly({ isRequired: false })).to.be.true;
			expect(instance.venue.validateDifferentiator.calledOnce).to.be.true;
			expect(instance.venue.validateDifferentiator.calledWithExactly()).to.be.true;
			expect(stubs.getDuplicateIndicesModule.getDuplicateNameIndices.calledThrice).to.be.true;
			expect(stubs.getDuplicateIndicesModule.getDuplicateNameIndices.getCall(0).calledWithExactly(
				instance.producerCredits
			)).to.be.true;
			expect(instance.producerCredits[0].runInputValidations.calledOnce).to.be.true;
			expect(instance.producerCredits[0].runInputValidations.calledWithExactly(
				{ isDuplicate: false }
			)).to.be.true;
			expect(stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices.calledOnce).to.be.true;
			expect(stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices.getCall(0).calledWithExactly(
				instance.cast
			)).to.be.true;
			expect(instance.cast[0].runInputValidations.calledOnce).to.be.true;
			expect(instance.cast[0].runInputValidations.calledWithExactly({ isDuplicate: false })).to.be.true;
			expect(stubs.getDuplicateIndicesModule.getDuplicateNameIndices.getCall(1).calledWithExactly(
				instance.creativeCredits
			)).to.be.true;
			expect(instance.creativeCredits[0].runInputValidations.calledOnce).to.be.true;
			expect(instance.creativeCredits[0].runInputValidations.calledWithExactly(
				{ isDuplicate: false }
			)).to.be.true;
			expect(stubs.getDuplicateIndicesModule.getDuplicateNameIndices.getCall(2).calledWithExactly(
				instance.crewCredits
			)).to.be.true;
			expect(instance.crewCredits[0].runInputValidations.calledOnce).to.be.true;
			expect(instance.crewCredits[0].runInputValidations.calledWithExactly(
				{ isDuplicate: false }
			)).to.be.true;

		});

	});

	describe('validateDates method', () => {

		context('valid data', () => {

			context('startDate with empty string values', () => {

				it('will not call addPropertyError method', () => {

					const instance = createInstance({ name: 'Hamlet', startDate: '' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					expect(instance.addPropertyError.notCalled).to.be.true;

				});

			});

			context('startDate with valid date format', () => {

				it('will not call addPropertyError method', () => {

					const instance = createInstance({ name: 'Hamlet', startDate: '2010-09-30' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					expect(instance.addPropertyError.notCalled).to.be.true;

				});

			});

			context('pressDate with empty string values', () => {

				it('will not call addPropertyError method', () => {

					const instance = createInstance({ name: 'Hamlet', pressDate: '' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					expect(instance.addPropertyError.notCalled).to.be.true;

				});

			});

			context('pressDate with valid date format', () => {

				it('will not call addPropertyError method', () => {

					const instance = createInstance({ name: 'Hamlet', pressDate: '2010-10-07' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					expect(instance.addPropertyError.notCalled).to.be.true;

				});

			});

			context('endDate with empty string values', () => {

				it('will not call addPropertyError method', () => {

					const instance = createInstance({ name: 'Hamlet', endDate: '' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					expect(instance.addPropertyError.notCalled).to.be.true;

				});

			});

			context('pressDate with valid date format', () => {

				it('will not call addPropertyError method', () => {

					const instance = createInstance({ name: 'Hamlet', endDate: '2011-01-26' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					expect(instance.addPropertyError.notCalled).to.be.true;

				});

			});

			context('startDate and endDate with valid date format with startDate before endDate', () => {

				it('will not call addPropertyError method', () => {

					const instance = createInstance({ name: 'Hamlet', startDate: '2010-09-30', endDate: '2011-01-26' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					expect(instance.addPropertyError.notCalled).to.be.true;

				});

			});

			context('startDate and endDate with valid date format with startDate same as endDate', () => {

				it('will not call addPropertyError method', () => {

					const instance = createInstance({ name: 'Hamlet', startDate: '2010-09-30', endDate: '2010-09-30' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					expect(instance.addPropertyError.notCalled).to.be.true;

				});

			});

			context('startDate and pressDate with valid date format with startDate before pressDate', () => {

				it('will not call addPropertyError method', () => {

					const instance = createInstance({
						name: 'Hamlet',
						startDate: '2010-09-30',
						pressDate: '2010-10-07'
					});
					spy(instance, 'addPropertyError');
					instance.validateDates();
					expect(instance.addPropertyError.notCalled).to.be.true;

				});

			});

			context('startDate and pressDate with valid date format with startDate same as pressDate', () => {

				it('will not call addPropertyError method', () => {

					const instance = createInstance({ name: 'Hamlet', startDate: '2010-09-30', pressDate: '2010-09-30' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					expect(instance.addPropertyError.notCalled).to.be.true;

				});

			});

			context('pressDate and endDate with valid date format with pressDate before endDate', () => {

				it('will not call addPropertyError method', () => {

					const instance = createInstance({ name: 'Hamlet', pressDate: '2010-10-07', endDate: '2011-01-26' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					expect(instance.addPropertyError.notCalled).to.be.true;

				});

			});

			context('pressDate and endDate with valid date format with pressDate same as endDate', () => {

				it('will not call addPropertyError method', () => {

					const instance = createInstance({ name: 'Hamlet', pressDate: '2010-09-30', endDate: '2010-09-30' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					expect(instance.addPropertyError.notCalled).to.be.true;

				});

			});

			context('startDate, pressDate, and endDate with empty string values', () => {

				it('will not call addPropertyError method', () => {

					const instance = createInstance({ name: 'Hamlet', startDate: '', pressDate: '', endDate: '' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					expect(instance.addPropertyError.notCalled).to.be.true;

				});

			});

			context('startDate, pressDate, and endDate with valid date format with startDate before pressDate and pressDate before endDate', () => {

				it('will not call addPropertyError method', () => {

					const instance = createInstance({
						name: 'Hamlet',
						startDate: '2010-09-30',
						pressDate: '2010-10-07',
						endDate: '2011-01-26'
					});
					spy(instance, 'addPropertyError');
					instance.validateDates();
					expect(instance.addPropertyError.notCalled).to.be.true;

				});

			});

			context('startDate, pressDate, and endDate with valid date format all with same value', () => {

				it('will not call addPropertyError method', () => {

					const instance = createInstance({
						name: 'Hamlet',
						startDate: '2010-09-30',
						pressDate: '2010-09-30',
						endDate: '2010-09-30'
					});
					spy(instance, 'addPropertyError');
					instance.validateDates();
					expect(instance.addPropertyError.notCalled).to.be.true;

				});

			});

		});

		context('invalid data', () => {

			context('startDate with invalid date format', () => {

				it('will call addPropertyError method', () => {

					const instance = createInstance({ name: 'Hamlet', startDate: 'foobar' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					expect(instance.addPropertyError.calledOnce).to.be.true;
					expect(instance.addPropertyError.calledWithExactly(
						'startDate',
						'Value needs to be in date format'
					)).to.be.true;

				});

			});

			context('pressDate with invalid date format', () => {

				it('will call addPropertyError method', () => {

					const instance = createInstance({ name: 'Hamlet', pressDate: 'foobar' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					expect(instance.addPropertyError.calledOnce).to.be.true;
					expect(instance.addPropertyError.calledWithExactly(
						'pressDate',
						'Value needs to be in date format'
					)).to.be.true;

				});

			});

			context('endDate with invalid date format', () => {

				it('will call addPropertyError method', () => {

					const instance = createInstance({ name: 'Hamlet', endDate: 'foobar' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					expect(instance.addPropertyError.calledOnce).to.be.true;
					expect(instance.addPropertyError.calledWithExactly(
						'endDate',
						'Value needs to be in date format'
					)).to.be.true;

				});

			});

			context('startDate and endDate with valid date format with startDate after endDate', () => {

				it('will call addPropertyError method', () => {

					const instance = createInstance({ name: 'Hamlet', startDate: '2011-01-26', endDate: '2010-09-30' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					expect(instance.addPropertyError.calledTwice).to.be.true;
					expect(instance.addPropertyError.getCall(0).calledWithExactly(
						'startDate',
						'Start date must not be after end date'
					)).to.be.true;
					expect(instance.addPropertyError.getCall(1).calledWithExactly(
						'endDate',
						'End date must not be before start date'
					)).to.be.true;

				});

			});

			context('startDate and pressDate with valid date format with startDate after pressDate', () => {

				it('will call addPropertyError method', () => {

					const instance = createInstance({ name: 'Hamlet', startDate: '2010-10-07', pressDate: '2010-09-30' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					expect(instance.addPropertyError.calledTwice).to.be.true;
					expect(instance.addPropertyError.getCall(0).calledWithExactly(
						'startDate',
						'Start date must not be after press date'
					)).to.be.true;
					expect(instance.addPropertyError.getCall(1).calledWithExactly(
						'pressDate',
						'Press date must not be before start date'
					)).to.be.true;

				});

			});

			context('pressDate and endDate with valid date format with pressDate after endDate', () => {

				it('will call addPropertyError method', () => {

					const instance = createInstance({ name: 'Hamlet', pressDate: '2011-01-26', endDate: '2010-10-07' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					expect(instance.addPropertyError.calledTwice).to.be.true;
					expect(instance.addPropertyError.getCall(0).calledWithExactly(
						'pressDate',
						'Press date must not be after end date'
					)).to.be.true;
					expect(instance.addPropertyError.getCall(1).calledWithExactly(
						'endDate',
						'End date must not be before press date'
					)).to.be.true;

				});

			});

			context('startDate, pressDate, and endDate with valid date format with startDate after pressDate and pressDate after endDate', () => {

				it('will call addPropertyError method', () => {

					const instance = createInstance({
						name: 'Hamlet',
						startDate: '2011-01-26',
						pressDate: '2010-10-07',
						endDate: '2010-09-30'
					});
					spy(instance, 'addPropertyError');
					instance.validateDates();
					expect(instance.addPropertyError.callCount).to.equal(6);
					expect(instance.addPropertyError.getCall(0).calledWithExactly(
						'startDate',
						'Start date must not be after end date'
					)).to.be.true;
					expect(instance.addPropertyError.getCall(1).calledWithExactly(
						'endDate',
						'End date must not be before start date'
					)).to.be.true;
					expect(instance.addPropertyError.getCall(2).calledWithExactly(
						'startDate',
						'Start date must not be after press date'
					)).to.be.true;
					expect(instance.addPropertyError.getCall(3).calledWithExactly(
						'pressDate',
						'Press date must not be before start date'
					)).to.be.true;
					expect(instance.addPropertyError.getCall(4).calledWithExactly(
						'pressDate',
						'Press date must not be after end date'
					)).to.be.true;
					expect(instance.addPropertyError.getCall(5).calledWithExactly(
						'endDate',
						'End date must not be before press date'
					)).to.be.true;

				});

			});

		});

	});

	describe('runDatabaseValidations method', () => {

		it('does nothing, i.e. it overrides the Base model runDatabaseValidations() method with an empty function', () => {

			const instance = createInstance({ name: 'Hamlet' });
			instance.runDatabaseValidations();
			expect(stubs.Base.neo4jQueryModule.neo4jQuery.notCalled).to.be.true;

		});

	});

});
