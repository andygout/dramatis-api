import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';
import { assert as sinonAssert, createStubInstance, restore, spy, stub } from 'sinon';

import {
	CastMember,
	CreativeCredit,
	CrewCredit,
	FestivalBase,
	MaterialBase,
	ProducerCredit,
	Review,
	Season,
	SubProductionIdentifier,
	VenueBase
} from '../../../src/models/index.js';

const context = describe;

describe('Production model', () => {
	let stubs;
	let Production;

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

	const ReviewStub = function () {
		return createStubInstance(Review);
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

	beforeEach(async () => {
		stubs = {
			getDuplicateIndicesModule: {
				getDuplicateBaseInstanceIndices: stub().returns([]),
				getDuplicateNameIndices: stub().returns([]),
				getDuplicateUuidIndices: stub().returns([]),
				getDuplicateUrlIndices: stub().returns([])
			},
			isValidDate: stub().returns(false),
			stringsModule: {
				getTrimmedOrEmptyString: stub().callsFake((arg) => arg?.trim() || '')
			},
			models: {
				CastMember: CastMemberStub,
				CreativeCredit: CreativeCreditStub,
				CrewCredit: CrewCreditStub,
				FestivalBase: FestivalBaseStub,
				MaterialBase: MaterialBaseStub,
				ProducerCredit: ProducerCreditStub,
				Review: ReviewStub,
				Season: SeasonStub,
				SubProductionIdentifier: SubProductionIdentifierStub,
				VenueBase: VenueBaseStub
			}
		};

		Production = await esmock(
			'../../../src/models/Production.js',
			{},
			// globalmocks: mock definitions imported everywhere.
			// Required for when functions are invoked by ancestor class methods.
			{
				'../../../src/lib/get-duplicate-indices.js': stubs.getDuplicateIndicesModule,
				'../../../src/lib/is-valid-date.js': stubs.isValidDate,
				'../../../src/lib/strings.js': stubs.stringsModule,
				'../../../src/models/index.js': stubs.models
			}
		);
	});

	afterEach(() => {
		restore();
	});

	describe('constructor method', () => {
		it('calls getTrimmedOrEmptyString to get values to assign to properties', async () => {
			new Production();

			assert.equal(stubs.stringsModule.getTrimmedOrEmptyString.callCount, 5);
		});

		describe('subtitle property', () => {
			it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {
				const instance = new Production({ subtitle: 'Prince of Denmark' });

				sinonAssert.calledWithExactly(
					stubs.stringsModule.getTrimmedOrEmptyString.secondCall,
					'Prince of Denmark'
				);
				assert.equal(instance.subtitle, 'Prince of Denmark');
			});
		});

		describe('startDate property', () => {
			it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {
				const instance = new Production({ startDate: '2010-09-30' });

				sinonAssert.calledWithExactly(stubs.stringsModule.getTrimmedOrEmptyString.thirdCall, '2010-09-30');
				assert.equal(instance.startDate, '2010-09-30');
			});
		});

		describe('pressDate property', () => {
			it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {
				const instance = new Production({ pressDate: '2010-10-07' });

				sinonAssert.calledWithExactly(stubs.stringsModule.getTrimmedOrEmptyString.getCall(3), '2010-10-07');
				assert.equal(instance.pressDate, '2010-10-07');
			});
		});

		describe('endDate property', () => {
			it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {
				const instance = new Production({ endDate: '2011-01-26' });

				sinonAssert.calledWithExactly(stubs.stringsModule.getTrimmedOrEmptyString.getCall(4), '2011-01-26');
				assert.equal(instance.endDate, '2011-01-26');
			});
		});

		describe('material property', () => {
			it('assigns instance if absent from props', async () => {
				const instance = new Production({ name: 'Hamlet' });

				assert.ok(instance.material instanceof MaterialBase);
			});

			it('assigns instance if included in props', async () => {
				const instance = new Production({
					name: 'Hamlet',
					material: {
						name: 'The Tragedy of Hamlet'
					}
				});

				assert.ok(instance.material instanceof MaterialBase);
			});
		});

		describe('venue property', () => {
			it('assigns instance if absent from props', async () => {
				const instance = new Production({ name: 'Hamlet' });

				assert.ok(instance.venue instanceof VenueBase);
			});

			it('assigns instance if included in props', async () => {
				const instance = new Production({
					name: 'Hamlet',
					venue: {
						name: 'Olivier Theatre'
					}
				});

				assert.ok(instance.venue instanceof VenueBase);
			});
		});

		describe('season property', () => {
			it('assigns instance if absent from props', async () => {
				const instance = new Production({ name: 'Hamlet' });

				assert.ok(instance.season instanceof Season);
			});

			it('assigns instance if included in props', async () => {
				const instance = new Production({
					name: 'Hamlet',
					season: {
						name: 'Shakesperean Tragedy Season'
					}
				});

				assert.ok(instance.season instanceof Season);
			});
		});

		describe('festival property', () => {
			it('assigns instance if absent from props', async () => {
				const instance = new Production({ name: 'Hamlet' });

				assert.ok(instance.festival instanceof FestivalBase);
			});

			it('assigns instance if included in props', async () => {
				const instance = new Production({
					name: 'Hamlet',
					festival: {
						name: 'The Complete Works'
					}
				});

				assert.ok(instance.festival instanceof FestivalBase);
			});
		});

		describe('subProductions property', () => {
			it('assigns empty array if absent from props', async () => {
				const instance = new Production({});

				assert.deepEqual(instance.subProductions, []);
			});

			it('assigns array of subProductions if included in props, retaining those with empty or whitespace-only string uuids', async () => {
				const instance = new Production({
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
				});

				assert.equal(instance.subProductions.length, 3);
				assert.ok(instance.subProductions[0] instanceof SubProductionIdentifier);
				assert.ok(instance.subProductions[1] instanceof SubProductionIdentifier);
				assert.ok(instance.subProductions[2] instanceof SubProductionIdentifier);
			});
		});

		describe('producerCredits property', () => {
			it('assigns empty array if absent from props', async () => {
				const instance = new Production({ name: 'Hamlet' });

				assert.deepEqual(instance.producerCredits, []);
			});

			it('assigns array of produucerCredits if included in props, retaining those with empty or whitespace-only string names', async () => {
				const instance = new Production({
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
				});

				assert.equal(instance.producerCredits.length, 3);
				assert.ok(instance.producerCredits[0] instanceof ProducerCredit);
				assert.ok(instance.producerCredits[1] instanceof ProducerCredit);
				assert.ok(instance.producerCredits[2] instanceof ProducerCredit);
			});
		});

		describe('cast property', () => {
			it('assigns empty array if absent from props', async () => {
				const instance = new Production({ name: 'Hamlet' });

				assert.deepEqual(instance.cast, []);
			});

			it('assigns array of cast if included in props, retaining those with empty or whitespace-only string names', async () => {
				const instance = new Production({
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
				});

				assert.equal(instance.cast.length, 3);
				assert.ok(instance.cast[0] instanceof CastMember);
				assert.ok(instance.cast[1] instanceof CastMember);
				assert.ok(instance.cast[2] instanceof CastMember);
			});
		});

		describe('creativeCredits property', () => {
			it('assigns empty array if absent from props', async () => {
				const instance = new Production({ name: 'Hamlet' });

				assert.deepEqual(instance.creativeCredits, []);
			});

			it('assigns array of creativeCredits if included in props, retaining those with empty or whitespace-only string names', async () => {
				const instance = new Production({
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
				});

				assert.equal(instance.creativeCredits.length, 3);
				assert.ok(instance.creativeCredits[0] instanceof CreativeCredit);
				assert.ok(instance.creativeCredits[1] instanceof CreativeCredit);
				assert.ok(instance.creativeCredits[2] instanceof CreativeCredit);
			});
		});

		describe('crewCredits property', () => {
			it('assigns empty array if absent from props', async () => {
				const instance = new Production({ name: 'Hamlet' });

				assert.deepEqual(instance.crewCredits, []);
			});

			it('assigns array of crewCredits if included in props, retaining those with empty or whitespace-only string names', async () => {
				const instance = new Production({
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
				});

				assert.equal(instance.crewCredits.length, 3);
				assert.ok(instance.crewCredits[0] instanceof CrewCredit);
				assert.ok(instance.crewCredits[1] instanceof CrewCredit);
				assert.ok(instance.crewCredits[2] instanceof CrewCredit);
			});
		});

		describe('reviews property', () => {
			it('assigns empty array if absent from props', async () => {
				const instance = new Production({ name: 'Hamlet' });

				assert.deepEqual(instance.reviews, []);
			});

			it('assigns array of reviews if included in props, retaining those with empty or whitespace-only string urls', async () => {
				const instance = new Production({
					name: 'Hamlet',
					reviews: [
						{
							url: 'https://www.foo.com'
						},
						{
							url: ''
						},
						{
							url: ' '
						}
					]
				});

				assert.equal(instance.reviews.length, 3);
				assert.ok(instance.reviews[0] instanceof Review);
				assert.ok(instance.reviews[1] instanceof Review);
				assert.ok(instance.reviews[2] instanceof Review);
			});
		});
	});

	describe('runInputValidations method', () => {
		it("calls instance's validate methods and associated models' validate methods", async () => {
			const instance = new Production({
				uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
				name: 'Hamlet',
				subtitle: 'Prince of Denmark',
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
				],
				reviews: [
					{
						url: 'https://www.foo.com',
						publication: {
							name: 'Financial Times'
						},
						critic: {
							name: 'Sarah Hemming'
						}
					}
				]
			});

			spy(instance, 'validateName');
			spy(instance, 'validateSubtitle');
			spy(instance, 'validateDates');

			instance.runInputValidations();

			sinonAssert.callOrder(
				instance.validateName,
				instance.validateSubtitle,
				instance.validateDates,
				instance.material.validateName,
				instance.material.validateDifferentiator,
				instance.venue.validateName,
				instance.venue.validateDifferentiator,
				instance.season.validateName,
				instance.season.validateDifferentiator,
				instance.festival.validateName,
				instance.festival.validateDifferentiator,
				stubs.getDuplicateIndicesModule.getDuplicateUuidIndices,
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
				instance.crewCredits[0].runInputValidations,
				stubs.getDuplicateIndicesModule.getDuplicateUrlIndices,
				instance.reviews[0].runInputValidations
			);
			sinonAssert.calledOnceWithExactly(instance.validateName, { isRequired: true });
			sinonAssert.calledOnceWithExactly(instance.validateSubtitle);
			sinonAssert.calledOnceWithExactly(instance.validateDates);
			sinonAssert.calledOnceWithExactly(instance.material.validateName, { isRequired: false });
			sinonAssert.calledOnceWithExactly(instance.material.validateDifferentiator);
			sinonAssert.calledOnceWithExactly(instance.venue.validateName, { isRequired: false });
			sinonAssert.calledOnceWithExactly(instance.venue.validateDifferentiator);
			sinonAssert.calledOnceWithExactly(instance.season.validateName, { isRequired: false });
			sinonAssert.calledOnceWithExactly(instance.season.validateDifferentiator);
			sinonAssert.calledOnceWithExactly(instance.festival.validateName, { isRequired: false });
			sinonAssert.calledOnceWithExactly(instance.festival.validateDifferentiator);
			sinonAssert.calledOnceWithExactly(
				stubs.getDuplicateIndicesModule.getDuplicateUuidIndices,
				instance.subProductions
			);
			sinonAssert.calledOnceWithExactly(instance.subProductions[0].validateUuid);
			sinonAssert.calledOnceWithExactly(instance.subProductions[0].validateNoAssociationWithSelf, {
				uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
			});
			sinonAssert.calledOnceWithExactly(instance.subProductions[0].validateUniquenessInGroup, {
				isDuplicate: false,
				properties: new Set(['uuid'])
			});
			sinonAssert.calledThrice(stubs.getDuplicateIndicesModule.getDuplicateNameIndices);
			sinonAssert.calledWithExactly(
				stubs.getDuplicateIndicesModule.getDuplicateNameIndices.firstCall,
				instance.producerCredits
			);
			sinonAssert.calledOnceWithExactly(instance.producerCredits[0].runInputValidations, { isDuplicate: false });
			sinonAssert.calledOnceWithExactly(
				stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices,
				instance.cast
			);
			sinonAssert.calledOnceWithExactly(instance.cast[0].runInputValidations, { isDuplicate: false });
			sinonAssert.calledWithExactly(
				stubs.getDuplicateIndicesModule.getDuplicateNameIndices.secondCall,
				instance.creativeCredits
			);
			sinonAssert.calledOnceWithExactly(instance.creativeCredits[0].runInputValidations, { isDuplicate: false });
			sinonAssert.calledWithExactly(
				stubs.getDuplicateIndicesModule.getDuplicateNameIndices.thirdCall,
				instance.crewCredits
			);
			sinonAssert.calledOnceWithExactly(instance.crewCredits[0].runInputValidations, { isDuplicate: false });
			sinonAssert.calledOnceWithExactly(stubs.getDuplicateIndicesModule.getDuplicateUrlIndices, instance.reviews);
			sinonAssert.calledOnceWithExactly(instance.reviews[0].runInputValidations, { isDuplicate: false });
		});
	});

	describe('validateDates method', () => {
		context('valid data', () => {
			context('startDate with empty string values', () => {
				it('will not call addPropertyError method', async () => {
					const instance = new Production({ name: 'Hamlet', startDate: '' });

					spy(instance, 'addPropertyError');

					instance.validateDates();

					assert.equal(stubs.isValidDate.callCount, 3);
					sinonAssert.calledWithExactly(stubs.isValidDate.firstCall, '');
					sinonAssert.calledWithExactly(stubs.isValidDate.secondCall, '');
					sinonAssert.calledWithExactly(stubs.isValidDate.thirdCall, '');
					sinonAssert.notCalled(instance.addPropertyError);
				});
			});

			context('startDate with valid date format', () => {
				it('will not call addPropertyError method', async () => {
					stubs.isValidDate.onFirstCall().returns(true);

					const instance = new Production({ name: 'Hamlet', startDate: '2010-09-30' });

					spy(instance, 'addPropertyError');

					instance.validateDates();

					assert.equal(stubs.isValidDate.callCount, 3);
					sinonAssert.calledWithExactly(stubs.isValidDate.firstCall, '2010-09-30');
					sinonAssert.calledWithExactly(stubs.isValidDate.secondCall, '');
					sinonAssert.calledWithExactly(stubs.isValidDate.thirdCall, '');
					sinonAssert.notCalled(instance.addPropertyError);
				});
			});

			context('pressDate with empty string values', () => {
				it('will not call addPropertyError method', async () => {
					const instance = new Production({ name: 'Hamlet', pressDate: '' });

					spy(instance, 'addPropertyError');

					instance.validateDates();

					assert.equal(stubs.isValidDate.callCount, 3);
					sinonAssert.calledWithExactly(stubs.isValidDate.firstCall, '');
					sinonAssert.calledWithExactly(stubs.isValidDate.secondCall, '');
					sinonAssert.calledWithExactly(stubs.isValidDate.thirdCall, '');
					sinonAssert.notCalled(instance.addPropertyError);
				});
			});

			context('pressDate with valid date format', () => {
				it('will not call addPropertyError method', async () => {
					stubs.isValidDate.onSecondCall().returns(true);

					const instance = new Production({ name: 'Hamlet', pressDate: '2010-10-07' });

					spy(instance, 'addPropertyError');

					instance.validateDates();

					assert.equal(stubs.isValidDate.callCount, 3);
					sinonAssert.calledWithExactly(stubs.isValidDate.firstCall, '');
					sinonAssert.calledWithExactly(stubs.isValidDate.secondCall, '2010-10-07');
					sinonAssert.calledWithExactly(stubs.isValidDate.thirdCall, '');
					sinonAssert.notCalled(instance.addPropertyError);
				});
			});

			context('endDate with empty string values', () => {
				it('will not call addPropertyError method', async () => {
					const instance = new Production({ name: 'Hamlet', endDate: '' });

					spy(instance, 'addPropertyError');

					instance.validateDates();

					assert.equal(stubs.isValidDate.callCount, 3);
					sinonAssert.calledWithExactly(stubs.isValidDate.firstCall, '');
					sinonAssert.calledWithExactly(stubs.isValidDate.secondCall, '');
					sinonAssert.calledWithExactly(stubs.isValidDate.thirdCall, '');
					sinonAssert.notCalled(instance.addPropertyError);
				});
			});

			context('endDate with valid date format', () => {
				it('will not call addPropertyError method', async () => {
					stubs.isValidDate.onThirdCall().returns(true);

					const instance = new Production({ name: 'Hamlet', endDate: '2011-01-26' });

					spy(instance, 'addPropertyError');

					instance.validateDates();

					assert.equal(stubs.isValidDate.callCount, 3);
					sinonAssert.calledWithExactly(stubs.isValidDate.firstCall, '');
					sinonAssert.calledWithExactly(stubs.isValidDate.secondCall, '');
					sinonAssert.calledWithExactly(stubs.isValidDate.thirdCall, '2011-01-26');
					sinonAssert.notCalled(instance.addPropertyError);
				});
			});

			context('startDate and endDate with valid date format with startDate before endDate', () => {
				it('will not call addPropertyError method', async () => {
					stubs.isValidDate.onFirstCall().returns(true).onThirdCall().returns(true);

					const instance = new Production({
						name: 'Hamlet',
						startDate: '2010-09-30',
						endDate: '2011-01-26'
					});

					spy(instance, 'addPropertyError');

					instance.validateDates();

					assert.equal(stubs.isValidDate.callCount, 3);
					sinonAssert.calledWithExactly(stubs.isValidDate.firstCall, '2010-09-30');
					sinonAssert.calledWithExactly(stubs.isValidDate.secondCall, '');
					sinonAssert.calledWithExactly(stubs.isValidDate.thirdCall, '2011-01-26');
					sinonAssert.notCalled(instance.addPropertyError);
				});
			});

			context('startDate and endDate with valid date format with startDate same as endDate', () => {
				it('will not call addPropertyError method', async () => {
					stubs.isValidDate.onFirstCall().returns(true).onThirdCall().returns(true);

					const instance = new Production({
						name: 'Hamlet',
						startDate: '2010-09-30',
						endDate: '2010-09-30'
					});

					spy(instance, 'addPropertyError');

					instance.validateDates();

					assert.equal(stubs.isValidDate.callCount, 3);
					sinonAssert.calledWithExactly(stubs.isValidDate.firstCall, '2010-09-30');
					sinonAssert.calledWithExactly(stubs.isValidDate.secondCall, '');
					sinonAssert.calledWithExactly(stubs.isValidDate.thirdCall, '2010-09-30');
					sinonAssert.notCalled(instance.addPropertyError);
				});
			});

			context('startDate and pressDate with valid date format with startDate before pressDate', () => {
				it('will not call addPropertyError method', async () => {
					stubs.isValidDate.onFirstCall().returns(true).onSecondCall().returns(true);

					const instance = new Production({
						name: 'Hamlet',
						startDate: '2010-09-30',
						pressDate: '2010-10-07'
					});

					spy(instance, 'addPropertyError');

					instance.validateDates();

					assert.equal(stubs.isValidDate.callCount, 3);
					sinonAssert.calledWithExactly(stubs.isValidDate.firstCall, '2010-09-30');
					sinonAssert.calledWithExactly(stubs.isValidDate.secondCall, '2010-10-07');
					sinonAssert.calledWithExactly(stubs.isValidDate.thirdCall, '');
					sinonAssert.notCalled(instance.addPropertyError);
				});
			});

			context('startDate and pressDate with valid date format with startDate same as pressDate', () => {
				it('will not call addPropertyError method', async () => {
					stubs.isValidDate.onFirstCall().returns(true).onSecondCall().returns(true);

					const instance = new Production({
						name: 'Hamlet',
						startDate: '2010-09-30',
						pressDate: '2010-09-30'
					});

					spy(instance, 'addPropertyError');

					instance.validateDates();

					assert.equal(stubs.isValidDate.callCount, 3);
					sinonAssert.calledWithExactly(stubs.isValidDate.firstCall, '2010-09-30');
					sinonAssert.calledWithExactly(stubs.isValidDate.secondCall, '2010-09-30');
					sinonAssert.calledWithExactly(stubs.isValidDate.thirdCall, '');
					sinonAssert.notCalled(instance.addPropertyError);
				});
			});

			context('pressDate and endDate with valid date format with pressDate before endDate', () => {
				it('will not call addPropertyError method', async () => {
					stubs.isValidDate.onSecondCall().returns(true).onThirdCall().returns(true);

					const instance = new Production({
						name: 'Hamlet',
						pressDate: '2010-10-07',
						endDate: '2011-01-26'
					});

					spy(instance, 'addPropertyError');

					instance.validateDates();

					assert.equal(stubs.isValidDate.callCount, 3);
					sinonAssert.calledWithExactly(stubs.isValidDate.firstCall, '');
					sinonAssert.calledWithExactly(stubs.isValidDate.secondCall, '2010-10-07');
					sinonAssert.calledWithExactly(stubs.isValidDate.thirdCall, '2011-01-26');
					sinonAssert.notCalled(instance.addPropertyError);
				});
			});

			context('pressDate and endDate with valid date format with pressDate same as endDate', () => {
				it('will not call addPropertyError method', async () => {
					stubs.isValidDate.onSecondCall().returns(true).onThirdCall().returns(true);

					const instance = new Production({
						name: 'Hamlet',
						pressDate: '2010-09-30',
						endDate: '2010-09-30'
					});

					spy(instance, 'addPropertyError');

					instance.validateDates();

					assert.equal(stubs.isValidDate.callCount, 3);
					sinonAssert.calledWithExactly(stubs.isValidDate.firstCall, '');
					sinonAssert.calledWithExactly(stubs.isValidDate.secondCall, '2010-09-30');
					sinonAssert.calledWithExactly(stubs.isValidDate.thirdCall, '2010-09-30');
					sinonAssert.notCalled(instance.addPropertyError);
				});
			});

			context('startDate, pressDate, and endDate with empty string values', () => {
				it('will not call addPropertyError method', async () => {
					const instance = new Production({
						name: 'Hamlet',
						startDate: '',
						pressDate: '',
						endDate: ''
					});

					spy(instance, 'addPropertyError');

					instance.validateDates();

					assert.equal(stubs.isValidDate.callCount, 3);
					sinonAssert.calledWithExactly(stubs.isValidDate.firstCall, '');
					sinonAssert.calledWithExactly(stubs.isValidDate.secondCall, '');
					sinonAssert.calledWithExactly(stubs.isValidDate.thirdCall, '');
					sinonAssert.notCalled(instance.addPropertyError);
				});
			});

			context(
				'startDate, pressDate, and endDate with valid date format with startDate before pressDate and pressDate before endDate',
				() => {
					it('will not call addPropertyError method', async () => {
						stubs.isValidDate
							.onFirstCall()
							.returns(true)
							.onSecondCall()
							.returns(true)
							.onThirdCall()
							.returns(true);

						const instance = new Production({
							name: 'Hamlet',
							startDate: '2010-09-30',
							pressDate: '2010-10-07',
							endDate: '2011-01-26'
						});

						spy(instance, 'addPropertyError');

						instance.validateDates();

						assert.equal(stubs.isValidDate.callCount, 3);
						sinonAssert.calledWithExactly(stubs.isValidDate.firstCall, '2010-09-30');
						sinonAssert.calledWithExactly(stubs.isValidDate.secondCall, '2010-10-07');
						sinonAssert.calledWithExactly(stubs.isValidDate.thirdCall, '2011-01-26');
						sinonAssert.notCalled(instance.addPropertyError);
					});
				}
			);

			context('startDate, pressDate, and endDate with valid date format all with same value', () => {
				it('will not call addPropertyError method', async () => {
					stubs.isValidDate
						.onFirstCall()
						.returns(true)
						.onSecondCall()
						.returns(true)
						.onThirdCall()
						.returns(true);

					const instance = new Production({
						name: 'Hamlet',
						startDate: '2010-09-30',
						pressDate: '2010-09-30',
						endDate: '2010-09-30'
					});

					spy(instance, 'addPropertyError');

					instance.validateDates();

					assert.equal(stubs.isValidDate.callCount, 3);
					sinonAssert.calledWithExactly(stubs.isValidDate.firstCall, '2010-09-30');
					sinonAssert.calledWithExactly(stubs.isValidDate.secondCall, '2010-09-30');
					sinonAssert.calledWithExactly(stubs.isValidDate.thirdCall, '2010-09-30');
					sinonAssert.notCalled(instance.addPropertyError);
				});
			});
		});

		context('invalid data', () => {
			context('startDate with invalid date format', () => {
				it('will call addPropertyError method', async () => {
					const instance = new Production({ name: 'Hamlet', startDate: 'foobar' });

					spy(instance, 'addPropertyError');

					instance.validateDates();

					assert.equal(stubs.isValidDate.callCount, 3);
					sinonAssert.calledWithExactly(stubs.isValidDate.firstCall, 'foobar');
					sinonAssert.calledWithExactly(stubs.isValidDate.secondCall, '');
					sinonAssert.calledWithExactly(stubs.isValidDate.thirdCall, '');
					sinonAssert.calledOnceWithExactly(
						instance.addPropertyError,
						'startDate',
						'Value must be in date format'
					);
				});
			});

			context('pressDate with invalid date format', () => {
				it('will call addPropertyError method', async () => {
					const instance = new Production({ name: 'Hamlet', pressDate: 'foobar' });

					spy(instance, 'addPropertyError');

					instance.validateDates();

					assert.equal(stubs.isValidDate.callCount, 3);
					sinonAssert.calledWithExactly(stubs.isValidDate.firstCall, '');
					sinonAssert.calledWithExactly(stubs.isValidDate.secondCall, 'foobar');
					sinonAssert.calledWithExactly(stubs.isValidDate.thirdCall, '');
					sinonAssert.calledOnceWithExactly(
						instance.addPropertyError,
						'pressDate',
						'Value must be in date format'
					);
				});
			});

			context('endDate with invalid date format', () => {
				it('will call addPropertyError method', async () => {
					const instance = new Production({ name: 'Hamlet', endDate: 'foobar' });

					spy(instance, 'addPropertyError');

					instance.validateDates();

					assert.equal(stubs.isValidDate.callCount, 3);
					sinonAssert.calledWithExactly(stubs.isValidDate.firstCall, '');
					sinonAssert.calledWithExactly(stubs.isValidDate.secondCall, '');
					sinonAssert.calledWithExactly(stubs.isValidDate.thirdCall, 'foobar');
					sinonAssert.calledOnceWithExactly(
						instance.addPropertyError,
						'endDate',
						'Value must be in date format'
					);
				});
			});

			context('startDate and endDate with valid date format with startDate after endDate', () => {
				it('will call addPropertyError method', async () => {
					stubs.isValidDate.onFirstCall().returns(true).onThirdCall().returns(true);

					const instance = new Production({
						name: 'Hamlet',
						startDate: '2011-01-26',
						endDate: '2010-09-30'
					});

					spy(instance, 'addPropertyError');

					instance.validateDates();

					assert.equal(stubs.isValidDate.callCount, 3);
					sinonAssert.calledWithExactly(stubs.isValidDate.firstCall, '2011-01-26');
					sinonAssert.calledWithExactly(stubs.isValidDate.secondCall, '');
					sinonAssert.calledWithExactly(stubs.isValidDate.thirdCall, '2010-09-30');
					sinonAssert.calledTwice(instance.addPropertyError);
					sinonAssert.calledWithExactly(
						instance.addPropertyError.firstCall,
						'startDate',
						'Start date must not be after end date'
					);
					sinonAssert.calledWithExactly(
						instance.addPropertyError.secondCall,
						'endDate',
						'End date must not be before start date'
					);
				});
			});

			context('startDate and pressDate with valid date format with startDate after pressDate', () => {
				it('will call addPropertyError method', async () => {
					stubs.isValidDate.onFirstCall().returns(true).onSecondCall().returns(true);

					const instance = new Production({
						name: 'Hamlet',
						startDate: '2010-10-07',
						pressDate: '2010-09-30'
					});

					spy(instance, 'addPropertyError');

					instance.validateDates();

					assert.equal(stubs.isValidDate.callCount, 3);
					sinonAssert.calledWithExactly(stubs.isValidDate.firstCall, '2010-10-07');
					sinonAssert.calledWithExactly(stubs.isValidDate.secondCall, '2010-09-30');
					sinonAssert.calledWithExactly(stubs.isValidDate.thirdCall, '');
					sinonAssert.calledTwice(instance.addPropertyError);
					sinonAssert.calledWithExactly(
						instance.addPropertyError.firstCall,
						'startDate',
						'Start date must not be after press date'
					);
					sinonAssert.calledWithExactly(
						instance.addPropertyError.secondCall,
						'pressDate',
						'Press date must not be before start date'
					);
				});
			});

			context('pressDate and endDate with valid date format with pressDate after endDate', () => {
				it('will call addPropertyError method', async () => {
					stubs.isValidDate.onSecondCall().returns(true).onThirdCall().returns(true);

					const instance = new Production({
						name: 'Hamlet',
						pressDate: '2011-01-26',
						endDate: '2010-10-07'
					});

					spy(instance, 'addPropertyError');

					instance.validateDates();

					assert.equal(stubs.isValidDate.callCount, 3);
					sinonAssert.calledWithExactly(stubs.isValidDate.firstCall, '');
					sinonAssert.calledWithExactly(stubs.isValidDate.secondCall, '2011-01-26');
					sinonAssert.calledWithExactly(stubs.isValidDate.thirdCall, '2010-10-07');
					sinonAssert.calledTwice(instance.addPropertyError);
					sinonAssert.calledWithExactly(
						instance.addPropertyError.firstCall,
						'pressDate',
						'Press date must not be after end date'
					);
					sinonAssert.calledWithExactly(
						instance.addPropertyError.secondCall,
						'endDate',
						'End date must not be before press date'
					);
				});
			});

			context(
				'startDate, pressDate, and endDate with valid date format with startDate after pressDate and pressDate after endDate',
				() => {
					it('will call addPropertyError method', async () => {
						stubs.isValidDate
							.onFirstCall()
							.returns(true)
							.onSecondCall()
							.returns(true)
							.onThirdCall()
							.returns(true);

						const instance = new Production({
							name: 'Hamlet',
							startDate: '2011-01-26',
							pressDate: '2010-10-07',
							endDate: '2010-09-30'
						});

						spy(instance, 'addPropertyError');

						instance.validateDates();

						assert.equal(stubs.isValidDate.callCount, 3);
						sinonAssert.calledWithExactly(stubs.isValidDate.firstCall, '2011-01-26');
						sinonAssert.calledWithExactly(stubs.isValidDate.secondCall, '2010-10-07');
						sinonAssert.calledWithExactly(stubs.isValidDate.thirdCall, '2010-09-30');
						assert.equal(instance.addPropertyError.callCount, 6);
						sinonAssert.calledWithExactly(
							instance.addPropertyError.firstCall,
							'startDate',
							'Start date must not be after end date'
						);
						sinonAssert.calledWithExactly(
							instance.addPropertyError.secondCall,
							'endDate',
							'End date must not be before start date'
						);
						sinonAssert.calledWithExactly(
							instance.addPropertyError.thirdCall,
							'startDate',
							'Start date must not be after press date'
						);
						sinonAssert.calledWithExactly(
							instance.addPropertyError.getCall(3),
							'pressDate',
							'Press date must not be before start date'
						);
						sinonAssert.calledWithExactly(
							instance.addPropertyError.getCall(4),
							'pressDate',
							'Press date must not be after end date'
						);
						sinonAssert.calledWithExactly(
							instance.addPropertyError.getCall(5),
							'endDate',
							'End date must not be before press date'
						);
					});
				}
			);
		});
	});

	describe('runDatabaseValidations method', () => {
		it("calls associated subProductions' runDatabaseValidations method", async () => {
			const instance = new Production({
				uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
				subProductions: [
					{
						uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
					}
				]
			});

			await instance.runDatabaseValidations();

			sinonAssert.calledOnceWithExactly(instance.subProductions[0].runDatabaseValidations, {
				subjectProductionUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
			});
		});
	});
});
