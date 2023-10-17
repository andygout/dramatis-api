import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { assert, createStubInstance, spy, stub } from 'sinon';

import {
	CastMember,
	CreativeCredit,
	CrewCredit,
	FestivalBase,
	MaterialBase,
	ProducerCredit,
	Season,
	SubProductionIdentifier,
	VenueBase
} from '../../../src/models';

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

	const FestivalBaseStub = function () {

		return createStubInstance(FestivalBase);

	};

	const MaterialBaseStub = function () {

		return createStubInstance(MaterialBase);

	};

	const ProducerCreditStub = function () {

		return createStubInstance(ProducerCredit);

	};

	const SeasonStub = function () {

		return createStubInstance(Season);

	};

	const SubProductionIdentifierStub = function () {

		return createStubInstance(SubProductionIdentifier);

	};

	const VenueBaseStub = function () {

		return createStubInstance(VenueBase);

	};

	beforeEach(() => {

		stubs = {
			getDuplicateIndicesModule: {
				getDuplicateBaseInstanceIndices: stub().returns([]),
				getDuplicateNameIndices: stub().returns([]),
				getDuplicateProductionIdentifierIndices: stub().returns([])
			},
			models: {
				CastMember: CastMemberStub,
				CreativeCredit: CreativeCreditStub,
				CrewCredit: CrewCreditStub,
				FestivalBase: FestivalBaseStub,
				MaterialBase: MaterialBaseStub,
				ProducerCredit: ProducerCreditStub,
				Season: SeasonStub,
				SubProductionIdentifier: SubProductionIdentifierStub,
				VenueBase: VenueBaseStub
			}
		};

	});

	const createSubject = () =>
		proxyquire('../../../src/models/Production', {
			'../lib/get-duplicate-indices': stubs.getDuplicateIndicesModule,
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

			it('assigns value if included in props and is string with length', () => {

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

			it('assigns value if included in props and is string with length', () => {

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

			it('assigns value if included in props and is string with length', () => {

				const instance = createInstance({ name: 'Hamlet', endDate: '2011-01-26' });
				expect(instance.endDate).to.equal('2011-01-26');

			});

			it('trims value before assigning', () => {

				const instance = createInstance({ name: 'Hamlet', endDate: ' 2011-01-26 ' });
				expect(instance.endDate).to.equal('2011-01-26');

			});

		});

		describe('material property', () => {

			it('assigns instance if absent from props', () => {

				const instance = createInstance({ name: 'Hamlet' });
				expect(instance.material instanceof MaterialBase).to.be.true;

			});

			it('assigns instance if included in props', () => {

				const instance = createInstance({
					name: 'Hamlet',
					material: {
						name: 'The Tragedy of Hamlet, Prince of Denmark'
					}
				});
				expect(instance.material instanceof MaterialBase).to.be.true;

			});

		});

		describe('venue property', () => {

			it('assigns instance if absent from props', () => {

				const instance = createInstance({ name: 'Hamlet' });
				expect(instance.venue instanceof VenueBase).to.be.true;

			});

			it('assigns instance if included in props', () => {

				const instance = createInstance({
					name: 'Hamlet',
					venue: {
						name: 'Olivier Theatre'
					}
				});
				expect(instance.venue instanceof VenueBase).to.be.true;

			});

		});

		describe('season property', () => {

			it('assigns instance if absent from props', () => {

				const instance = createInstance({ name: 'Hamlet' });
				expect(instance.season instanceof Season).to.be.true;

			});

			it('assigns instance if included in props', () => {

				const instance = createInstance({
					name: 'Hamlet',
					season: {
						name: 'Shakesperean Tragedy Season'
					}
				});
				expect(instance.season instanceof Season).to.be.true;

			});

		});

		describe('festival property', () => {

			it('assigns instance if absent from props', () => {

				const instance = createInstance({ name: 'Hamlet' });
				expect(instance.festival instanceof FestivalBase).to.be.true;

			});

			it('assigns instance if included in props', () => {

				const instance = createInstance({
					name: 'Hamlet',
					festival: {
						name: 'The Complete Works'
					}
				});
				expect(instance.festival instanceof FestivalBase).to.be.true;

			});

		});

		describe('sub-productions property', () => {

			it('assigns empty array if absent from props', () => {

				const instance = createInstance({});
				expect(instance.subProductions).to.deep.equal([]);

			});

			it('assigns array of sub-productions if included in props, retaining those with empty or whitespace-only string uuids', () => {

				const props = {
					subProductions: [
						{
							uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
						},
						{
							uuid: ''
						},
						{
							uuid: ' '
						}
					]
				};
				const instance = createInstance(props);
				expect(instance.subProductions.length).to.equal(3);
				expect(instance.subProductions[0] instanceof SubProductionIdentifier).to.be.true;
				expect(instance.subProductions[1] instanceof SubProductionIdentifier).to.be.true;
				expect(instance.subProductions[2] instanceof SubProductionIdentifier).to.be.true;

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

		it('calls instance\'s validate methods and associated models\' validate methods', () => {

			const props = {
				uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
				name: 'Hamlet',
				subProductions: [
					{
						uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
					}
				],
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
				instance.season.validateName,
				instance.season.validateDifferentiator,
				instance.festival.validateName,
				instance.festival.validateDifferentiator,
				stubs.getDuplicateIndicesModule.getDuplicateProductionIdentifierIndices,
				instance.subProductions[0].validateUuid,
				instance.subProductions[0].validateNoAssociationWithSelf,
				instance.subProductions[0].validateUniquenessInGroup,
				stubs.getDuplicateIndicesModule.getDuplicateNameIndices,
				instance.producerCredits[0].runInputValidations,
				stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices,
				instance.cast[0].runInputValidations,
				stubs.getDuplicateIndicesModule.getDuplicateNameIndices,
				instance.creativeCredits[0].runInputValidations,
				stubs.getDuplicateIndicesModule.getDuplicateNameIndices,
				instance.crewCredits[0].runInputValidations
			);
			assert.calledOnce(instance.validateName);
			assert.calledWithExactly(instance.validateName, { isRequired: true });
			assert.calledOnce(instance.validateDates);
			assert.calledWithExactly(instance.validateDates);
			assert.calledOnce(instance.material.validateName);
			assert.calledWithExactly(instance.material.validateName, { isRequired: false });
			assert.calledOnce(instance.material.validateDifferentiator);
			assert.calledWithExactly(instance.material.validateDifferentiator);
			assert.calledOnce(instance.venue.validateName);
			assert.calledWithExactly(instance.venue.validateName, { isRequired: false });
			assert.calledOnce(instance.venue.validateDifferentiator);
			assert.calledWithExactly(instance.venue.validateDifferentiator);
			assert.calledOnce(instance.season.validateName);
			assert.calledWithExactly(instance.season.validateName, { isRequired: false });
			assert.calledOnce(instance.season.validateDifferentiator);
			assert.calledWithExactly(instance.season.validateDifferentiator);
			assert.calledOnce(instance.festival.validateName);
			assert.calledWithExactly(instance.festival.validateName, { isRequired: false });
			assert.calledOnce(instance.festival.validateDifferentiator);
			assert.calledWithExactly(instance.festival.validateDifferentiator);
			assert.calledOnce(stubs.getDuplicateIndicesModule.getDuplicateProductionIdentifierIndices);
			assert.calledWithExactly(
				stubs.getDuplicateIndicesModule.getDuplicateProductionIdentifierIndices,
				instance.subProductions
			);
			assert.calledOnce(instance.subProductions[0].validateUuid);
			assert.calledWithExactly(instance.subProductions[0].validateUuid);
			assert.calledOnce(instance.subProductions[0].validateNoAssociationWithSelf);
			assert.calledWithExactly(
				instance.subProductions[0].validateNoAssociationWithSelf,
				{ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' }
			);
			assert.calledOnce(instance.subProductions[0].validateUniquenessInGroup);
			assert.calledWithExactly(
				instance.subProductions[0].validateUniquenessInGroup,
				{ isDuplicate: false, properties: new Set(['uuid']) }
			);
			assert.calledThrice(stubs.getDuplicateIndicesModule.getDuplicateNameIndices);
			assert.calledWithExactly(
				stubs.getDuplicateIndicesModule.getDuplicateNameIndices.getCall(0),
				instance.producerCredits
			);
			assert.calledOnce(instance.producerCredits[0].runInputValidations);
			assert.calledWithExactly(
				instance.producerCredits[0].runInputValidations,
				{ isDuplicate: false }
			);
			assert.calledOnce(stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices);
			assert.calledWithExactly(
				stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices.getCall(0),
				instance.cast
			);
			assert.calledOnce(instance.cast[0].runInputValidations);
			assert.calledWithExactly(
				instance.cast[0].runInputValidations,
				{ isDuplicate: false }
			);
			assert.calledWithExactly(
				stubs.getDuplicateIndicesModule.getDuplicateNameIndices.getCall(1),
				instance.creativeCredits
			);
			assert.calledOnce(instance.creativeCredits[0].runInputValidations);
			assert.calledWithExactly(
				instance.creativeCredits[0].runInputValidations,
				{ isDuplicate: false }
			);
			assert.calledWithExactly(
				stubs.getDuplicateIndicesModule.getDuplicateNameIndices.getCall(2),
				instance.crewCredits
			);
			assert.calledOnce(instance.crewCredits[0].runInputValidations);
			assert.calledWithExactly(
				instance.crewCredits[0].runInputValidations,
				{ isDuplicate: false }
			);

		});

	});

	describe('validateDates method', () => {

		context('valid data', () => {

			context('startDate with empty string values', () => {

				it('will not call addPropertyError method', () => {

					const instance = createInstance({ name: 'Hamlet', startDate: '' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					assert.notCalled(instance.addPropertyError);

				});

			});

			context('startDate with valid date format', () => {

				it('will not call addPropertyError method', () => {

					const instance = createInstance({ name: 'Hamlet', startDate: '2010-09-30' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					assert.notCalled(instance.addPropertyError);

				});

			});

			context('pressDate with empty string values', () => {

				it('will not call addPropertyError method', () => {

					const instance = createInstance({ name: 'Hamlet', pressDate: '' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					assert.notCalled(instance.addPropertyError);

				});

			});

			context('pressDate with valid date format', () => {

				it('will not call addPropertyError method', () => {

					const instance = createInstance({ name: 'Hamlet', pressDate: '2010-10-07' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					assert.notCalled(instance.addPropertyError);

				});

			});

			context('endDate with empty string values', () => {

				it('will not call addPropertyError method', () => {

					const instance = createInstance({ name: 'Hamlet', endDate: '' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					assert.notCalled(instance.addPropertyError);

				});

			});

			context('pressDate with valid date format', () => {

				it('will not call addPropertyError method', () => {

					const instance = createInstance({ name: 'Hamlet', endDate: '2011-01-26' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					assert.notCalled(instance.addPropertyError);

				});

			});

			context('startDate and endDate with valid date format with startDate before endDate', () => {

				it('will not call addPropertyError method', () => {

					const instance = createInstance({ name: 'Hamlet', startDate: '2010-09-30', endDate: '2011-01-26' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					assert.notCalled(instance.addPropertyError);

				});

			});

			context('startDate and endDate with valid date format with startDate same as endDate', () => {

				it('will not call addPropertyError method', () => {

					const instance = createInstance({ name: 'Hamlet', startDate: '2010-09-30', endDate: '2010-09-30' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					assert.notCalled(instance.addPropertyError);

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
					assert.notCalled(instance.addPropertyError);

				});

			});

			context('startDate and pressDate with valid date format with startDate same as pressDate', () => {

				it('will not call addPropertyError method', () => {

					const instance = createInstance({ name: 'Hamlet', startDate: '2010-09-30', pressDate: '2010-09-30' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					assert.notCalled(instance.addPropertyError);

				});

			});

			context('pressDate and endDate with valid date format with pressDate before endDate', () => {

				it('will not call addPropertyError method', () => {

					const instance = createInstance({ name: 'Hamlet', pressDate: '2010-10-07', endDate: '2011-01-26' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					assert.notCalled(instance.addPropertyError);

				});

			});

			context('pressDate and endDate with valid date format with pressDate same as endDate', () => {

				it('will not call addPropertyError method', () => {

					const instance = createInstance({ name: 'Hamlet', pressDate: '2010-09-30', endDate: '2010-09-30' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					assert.notCalled(instance.addPropertyError);

				});

			});

			context('startDate, pressDate, and endDate with empty string values', () => {

				it('will not call addPropertyError method', () => {

					const instance = createInstance({ name: 'Hamlet', startDate: '', pressDate: '', endDate: '' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					assert.notCalled(instance.addPropertyError);

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
					assert.notCalled(instance.addPropertyError);

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
					assert.notCalled(instance.addPropertyError);

				});

			});

		});

		context('invalid data', () => {

			context('startDate with invalid date format', () => {

				it('will call addPropertyError method', () => {

					const instance = createInstance({ name: 'Hamlet', startDate: 'foobar' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					assert.calledOnce(instance.addPropertyError);
					assert.calledWithExactly(
						instance.addPropertyError,
						'startDate', 'Value must be in date format'
					);

				});

			});

			context('pressDate with invalid date format', () => {

				it('will call addPropertyError method', () => {

					const instance = createInstance({ name: 'Hamlet', pressDate: 'foobar' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					assert.calledOnce(instance.addPropertyError);
					assert.calledWithExactly(
						instance.addPropertyError,
						'pressDate', 'Value must be in date format'
					);

				});

			});

			context('endDate with invalid date format', () => {

				it('will call addPropertyError method', () => {

					const instance = createInstance({ name: 'Hamlet', endDate: 'foobar' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					assert.calledOnce(instance.addPropertyError);
					assert.calledWithExactly(
						instance.addPropertyError,
						'endDate', 'Value must be in date format'
					);

				});

			});

			context('startDate and endDate with valid date format with startDate after endDate', () => {

				it('will call addPropertyError method', () => {

					const instance = createInstance({ name: 'Hamlet', startDate: '2011-01-26', endDate: '2010-09-30' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					assert.calledTwice(instance.addPropertyError);
					assert.calledWithExactly(
						instance.addPropertyError.getCall(0),
						'startDate', 'Start date must not be after end date'
					);
					assert.calledWithExactly(
						instance.addPropertyError.getCall(1),
						'endDate', 'End date must not be before start date'
					);

				});

			});

			context('startDate and pressDate with valid date format with startDate after pressDate', () => {

				it('will call addPropertyError method', () => {

					const instance = createInstance({ name: 'Hamlet', startDate: '2010-10-07', pressDate: '2010-09-30' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					assert.calledTwice(instance.addPropertyError);
					assert.calledWithExactly(
						instance.addPropertyError.getCall(0),
						'startDate', 'Start date must not be after press date'
					);
					assert.calledWithExactly(
						instance.addPropertyError.getCall(1),
						'pressDate', 'Press date must not be before start date'
					);

				});

			});

			context('pressDate and endDate with valid date format with pressDate after endDate', () => {

				it('will call addPropertyError method', () => {

					const instance = createInstance({ name: 'Hamlet', pressDate: '2011-01-26', endDate: '2010-10-07' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					assert.calledTwice(instance.addPropertyError);
					assert.calledWithExactly(
						instance.addPropertyError.getCall(0),
						'pressDate', 'Press date must not be after end date'
					);
					assert.calledWithExactly(
						instance.addPropertyError.getCall(1),
						'endDate', 'End date must not be before press date'
					);

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
					assert.calledWithExactly(
						instance.addPropertyError.getCall(0),
						'startDate', 'Start date must not be after end date'
					);
					assert.calledWithExactly(
						instance.addPropertyError.getCall(1),
						'endDate', 'End date must not be before start date'
					);
					assert.calledWithExactly(
						instance.addPropertyError.getCall(2),
						'startDate', 'Start date must not be after press date'
					);
					assert.calledWithExactly(
						instance.addPropertyError.getCall(3),
						'pressDate', 'Press date must not be before start date'
					);
					assert.calledWithExactly(
						instance.addPropertyError.getCall(4),
						'pressDate', 'Press date must not be after end date'
					);
					assert.calledWithExactly(
						instance.addPropertyError.getCall(5),
						'endDate', 'End date must not be before press date'
					);

				});

			});

		});

	});

	describe('runDatabaseValidations method', () => {

		it('calls associated sub-productions\' runDatabaseValidations method', async () => {

			const props = {
				uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
				subProductions: [
					{
						uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
					}
				]
			};
			const instance = createInstance(props);
			await instance.runDatabaseValidations();
			assert.calledOnce(instance.subProductions[0].runDatabaseValidations);
			assert.calledWithExactly(
				instance.subProductions[0].runDatabaseValidations,
				{ subjectProductionUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' }
			);

		});

	});

});
