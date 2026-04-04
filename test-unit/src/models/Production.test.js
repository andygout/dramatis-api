import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';

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
		return new CastMember();
	};

	const CreativeCreditStub = function () {
		return new CreativeCredit();
	};

	const CrewCreditStub = function () {
		return new CrewCredit();
	};

	const FestivalBaseStub = function () {
		return new FestivalBase();
	};

	const MaterialBaseStub = function () {
		return new MaterialBase();
	};

	const ProducerCreditStub = function () {
		return new ProducerCredit();
	};

	const ReviewStub = function () {
		return new Review();
	};

	const SeasonStub = function () {
		return new Season();
	};

	const SubProductionIdentifierStub = function () {
		return new SubProductionIdentifier();
	};

	const VenueBaseStub = function () {
		return new VenueBase();
	};

	beforeEach(async (test) => {
		stubs = {
			getDuplicateIndicesModule: {
				getDuplicateBaseInstanceIndices: test.mock.fn(() => []),
				getDuplicateNameIndices: test.mock.fn(() => []),
				getDuplicateUuidIndices: test.mock.fn(() => []),
				getDuplicateUrlIndices: test.mock.fn(() => [])
			},
			isValidDate: test.mock.fn(() => false),
			stringsModule: {
				getTrimmedOrEmptyString: test.mock.fn((arg) => arg?.trim() || '')
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

	describe('constructor method', () => {
		it('calls getTrimmedOrEmptyString to get values to assign to properties', async () => {
			new Production();

			assert.equal(stubs.stringsModule.getTrimmedOrEmptyString.mock.calls.length, 5);
		});

		describe('subtitle property', () => {
			it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {
				const instance = new Production({ subtitle: 'Prince of Denmark' });

				assert.deepStrictEqual(
					stubs.stringsModule.getTrimmedOrEmptyString.mock.calls[1].arguments,
					['Prince of Denmark']
				);
				assert.equal(instance.subtitle, 'Prince of Denmark');
			});
		});

		describe('startDate property', () => {
			it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {
				const instance = new Production({ startDate: '2010-09-30' });

				assert.deepStrictEqual(stubs.stringsModule.getTrimmedOrEmptyString.mock.calls[2].arguments, ['2010-09-30']);
				assert.equal(instance.startDate, '2010-09-30');
			});
		});

		describe('pressDate property', () => {
			it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {
				const instance = new Production({ pressDate: '2010-10-07' });

				assert.deepStrictEqual(stubs.stringsModule.getTrimmedOrEmptyString.mock.calls[3].arguments, ['2010-10-07']);
				assert.equal(instance.pressDate, '2010-10-07');
			});
		});

		describe('endDate property', () => {
			it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {
				const instance = new Production({ endDate: '2011-01-26' });

				assert.deepStrictEqual(stubs.stringsModule.getTrimmedOrEmptyString.mock.calls[4].arguments, ['2011-01-26']);
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
		it("calls instance's validate methods and associated models' validate methods", async (test) => {
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
			const callOrder = [];

			const originalValidateName = instance.validateName;
			const originalValidateSubtitle = instance.validateSubtitle;
			const originalValidateDates = instance.validateDates;
			const originalMaterialValidateName = instance.material.validateName;
			const originalMaterialValidateDifferentiator = instance.material.validateDifferentiator;
			const originalVenueValidateName = instance.venue.validateName;
			const originalVenueValidateDifferentiator = instance.venue.validateDifferentiator;
			const originalSeasonValidateName = instance.season.validateName;
			const originalSeasonValidateDifferentiator = instance.season.validateDifferentiator;
			const originalFestivalValidateName = instance.festival.validateName;
			const originalFestivalValidateDifferentiator = instance.festival.validateDifferentiator;
			const originalSubProductionValidateUuid = instance.subProductions[0].validateUuid;
			const originalSubProductionValidateNoAssociationWithSelf = instance.subProductions[0].validateNoAssociationWithSelf;
			const originalSubProductionValidateUniquenessInGroup = instance.subProductions[0].validateUniquenessInGroup;
			const originalProducerCreditRunInputValidations = instance.producerCredits[0].runInputValidations;
			const originalCastRunInputValidations = instance.cast[0].runInputValidations;
			const originalCreativeCreditRunInputValidations = instance.creativeCredits[0].runInputValidations;
			const originalCrewCreditRunInputValidations = instance.crewCredits[0].runInputValidations;
			const originalReviewRunInputValidations = instance.reviews[0].runInputValidations;

			test.mock.method(instance, 'validateName', function (...args) {
				callOrder.push('instance.validateName');

				return originalValidateName.apply(this, args);
			});
			test.mock.method(instance, 'validateSubtitle', function (...args) {
				callOrder.push('instance.validateSubtitle');

				return originalValidateSubtitle.apply(this, args);
			});
			test.mock.method(instance, 'validateDates', function (...args) {
				callOrder.push('instance.validateDates');

				return originalValidateDates.apply(this, args);
			});
			test.mock.method(instance.material, 'validateName', function (...args) {
				callOrder.push('instance.material.validateName');

				return originalMaterialValidateName.apply(this, args);
			});
			test.mock.method(instance.material, 'validateDifferentiator', function (...args) {
				callOrder.push('instance.material.validateDifferentiator');

				return originalMaterialValidateDifferentiator.apply(this, args);
			});
			test.mock.method(instance.venue, 'validateName', function (...args) {
				callOrder.push('instance.venue.validateName');

				return originalVenueValidateName.apply(this, args);
			});
			test.mock.method(instance.venue, 'validateDifferentiator', function (...args) {
				callOrder.push('instance.venue.validateDifferentiator');

				return originalVenueValidateDifferentiator.apply(this, args);
			});
			test.mock.method(instance.season, 'validateName', function (...args) {
				callOrder.push('instance.season.validateName');

				return originalSeasonValidateName.apply(this, args);
			});
			test.mock.method(instance.season, 'validateDifferentiator', function (...args) {
				callOrder.push('instance.season.validateDifferentiator');

				return originalSeasonValidateDifferentiator.apply(this, args);
			});
			test.mock.method(instance.festival, 'validateName', function (...args) {
				callOrder.push('instance.festival.validateName');

				return originalFestivalValidateName.apply(this, args);
			});
			test.mock.method(instance.festival, 'validateDifferentiator', function (...args) {
				callOrder.push('instance.festival.validateDifferentiator');

				return originalFestivalValidateDifferentiator.apply(this, args);
			});
			test.mock.method(stubs.getDuplicateIndicesModule, 'getDuplicateUuidIndices', function (...args) {
				callOrder.push('stubs.getDuplicateIndicesModule.getDuplicateUuidIndices');

				return [];
			});
			test.mock.method(instance.subProductions[0], 'validateUuid', function (...args) {
				callOrder.push('instance.subProductions[0].validateUuid');

				return originalSubProductionValidateUuid.apply(this, args);
			});
			test.mock.method(instance.subProductions[0], 'validateNoAssociationWithSelf', function (...args) {
				callOrder.push('instance.subProductions[0].validateNoAssociationWithSelf');

				return originalSubProductionValidateNoAssociationWithSelf.apply(this, args);
			});
			test.mock.method(instance.subProductions[0], 'validateUniquenessInGroup', function (...args) {
				callOrder.push('instance.subProductions[0].validateUniquenessInGroup');

				return originalSubProductionValidateUniquenessInGroup.apply(this, args);
			});
			test.mock.method(stubs.getDuplicateIndicesModule, 'getDuplicateNameIndices', function (...args) {
				callOrder.push('stubs.getDuplicateIndicesModule.getDuplicateNameIndices');

				return [];
			});
			test.mock.method(instance.producerCredits[0], 'runInputValidations', function (...args) {
				callOrder.push('instance.producerCredits[0].runInputValidations');

				return originalProducerCreditRunInputValidations.apply(this, args);
			});
			test.mock.method(stubs.getDuplicateIndicesModule, 'getDuplicateBaseInstanceIndices', function (...args) {
				callOrder.push('stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices');

				return [];
			});
			test.mock.method(instance.cast[0], 'runInputValidations', function (...args) {
				callOrder.push('instance.cast[0].runInputValidations');

				return originalCastRunInputValidations.apply(this, args);
			});
			test.mock.method(instance.creativeCredits[0], 'runInputValidations', function (...args) {
				callOrder.push('instance.creativeCredits[0].runInputValidations');

				return originalCreativeCreditRunInputValidations.apply(this, args);
			});
			test.mock.method(instance.crewCredits[0], 'runInputValidations', function (...args) {
				callOrder.push('instance.crewCredits[0].runInputValidations');

				return originalCrewCreditRunInputValidations.apply(this, args);
			});
			test.mock.method(stubs.getDuplicateIndicesModule, 'getDuplicateUrlIndices', function (...args) {
				callOrder.push('stubs.getDuplicateIndicesModule.getDuplicateUrlIndices');

				return [];
			});
			test.mock.method(instance.reviews[0], 'runInputValidations', function (...args) {
				callOrder.push('instance.reviews[0].runInputValidations');

				return originalReviewRunInputValidations.apply(this, args);
			});

			instance.runInputValidations();

			assert.deepStrictEqual(callOrder, [
				'instance.validateName',
				'instance.validateSubtitle',
				'instance.validateDates',
				'instance.material.validateName',
				'instance.material.validateDifferentiator',
				'instance.venue.validateName',
				'instance.venue.validateDifferentiator',
				'instance.season.validateName',
				'instance.season.validateDifferentiator',
				'instance.festival.validateName',
				'instance.festival.validateDifferentiator',
				'stubs.getDuplicateIndicesModule.getDuplicateUuidIndices',
				'instance.subProductions[0].validateUuid',
				'instance.subProductions[0].validateNoAssociationWithSelf',
				'instance.subProductions[0].validateUniquenessInGroup',
				'stubs.getDuplicateIndicesModule.getDuplicateNameIndices',
				'instance.producerCredits[0].runInputValidations',
				'stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices',
				'instance.cast[0].runInputValidations',
				'stubs.getDuplicateIndicesModule.getDuplicateNameIndices',
				'instance.creativeCredits[0].runInputValidations',
				'stubs.getDuplicateIndicesModule.getDuplicateNameIndices',
				'instance.crewCredits[0].runInputValidations',
				'stubs.getDuplicateIndicesModule.getDuplicateUrlIndices',
				'instance.reviews[0].runInputValidations'
			]);
			assert.strictEqual(instance.validateName.mock.calls.length, 1);
			assert.deepStrictEqual(instance.validateName.mock.calls[0].arguments, [{ isRequired: true }]);
			assert.strictEqual(instance.validateSubtitle.mock.calls.length, 1);
			assert.deepStrictEqual(instance.validateSubtitle.mock.calls[0].arguments, []);
			assert.strictEqual(instance.validateDates.mock.calls.length, 1);
			assert.deepStrictEqual(instance.validateDates.mock.calls[0].arguments, []);
			assert.strictEqual(instance.material.validateName.mock.calls.length, 1);
			assert.deepStrictEqual(instance.material.validateName.mock.calls[0].arguments, [{ isRequired: false }]);
			assert.strictEqual(instance.material.validateDifferentiator.mock.calls.length, 1);
			assert.deepStrictEqual(instance.material.validateDifferentiator.mock.calls[0].arguments, []);
			assert.strictEqual(instance.venue.validateName.mock.calls.length, 1);
			assert.deepStrictEqual(instance.venue.validateName.mock.calls[0].arguments, [{ isRequired: false }]);
			assert.strictEqual(instance.venue.validateDifferentiator.mock.calls.length, 1);
			assert.deepStrictEqual(instance.venue.validateDifferentiator.mock.calls[0].arguments, []);
			assert.strictEqual(instance.season.validateName.mock.calls.length, 1);
			assert.deepStrictEqual(instance.season.validateName.mock.calls[0].arguments, [{ isRequired: false }]);
			assert.strictEqual(instance.season.validateDifferentiator.mock.calls.length, 1);
			assert.deepStrictEqual(instance.season.validateDifferentiator.mock.calls[0].arguments, []);
			assert.strictEqual(instance.festival.validateName.mock.calls.length, 1);
			assert.deepStrictEqual(instance.festival.validateName.mock.calls[0].arguments, [{ isRequired: false }]);
			assert.strictEqual(instance.festival.validateDifferentiator.mock.calls.length, 1);
			assert.deepStrictEqual(instance.festival.validateDifferentiator.mock.calls[0].arguments, []);
			assert.strictEqual(stubs.getDuplicateIndicesModule.getDuplicateUuidIndices.mock.calls.length, 1);
			assert.deepStrictEqual(stubs.getDuplicateIndicesModule.getDuplicateUuidIndices.mock.calls[0].arguments, [
				instance.subProductions
			]);
			assert.strictEqual(instance.subProductions[0].validateUuid.mock.calls.length, 1);
			assert.deepStrictEqual(instance.subProductions[0].validateUuid.mock.calls[0].arguments, []);
			assert.strictEqual(instance.subProductions[0].validateNoAssociationWithSelf.mock.calls.length, 1);
			assert.deepStrictEqual(instance.subProductions[0].validateNoAssociationWithSelf.mock.calls[0].arguments, [
				{
					uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
				}
			]);
			assert.strictEqual(instance.subProductions[0].validateUniquenessInGroup.mock.calls.length, 1);
			assert.deepStrictEqual(instance.subProductions[0].validateUniquenessInGroup.mock.calls[0].arguments, [
				{
					isDuplicate: false,
					properties: new Set(['uuid'])
				}
			]);
			assert.strictEqual(stubs.getDuplicateIndicesModule.getDuplicateNameIndices.mock.calls.length, 3);
			assert.deepStrictEqual(stubs.getDuplicateIndicesModule.getDuplicateNameIndices.mock.calls[0].arguments, [
				instance.producerCredits
			]);
			assert.strictEqual(instance.producerCredits[0].runInputValidations.mock.calls.length, 1);
			assert.deepStrictEqual(instance.producerCredits[0].runInputValidations.mock.calls[0].arguments, [
				{ isDuplicate: false }
			]);
			assert.strictEqual(stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices.mock.calls.length, 1);
			assert.deepStrictEqual(stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices.mock.calls[0].arguments, [
				instance.cast
			]);
			assert.strictEqual(instance.cast[0].runInputValidations.mock.calls.length, 1);
			assert.deepStrictEqual(instance.cast[0].runInputValidations.mock.calls[0].arguments, [
				{ isDuplicate: false }
			]);
			assert.deepStrictEqual(stubs.getDuplicateIndicesModule.getDuplicateNameIndices.mock.calls[1].arguments, [
				instance.creativeCredits
			]);
			assert.strictEqual(instance.creativeCredits[0].runInputValidations.mock.calls.length, 1);
			assert.deepStrictEqual(instance.creativeCredits[0].runInputValidations.mock.calls[0].arguments, [
				{ isDuplicate: false }
			]);
			assert.deepStrictEqual(stubs.getDuplicateIndicesModule.getDuplicateNameIndices.mock.calls[2].arguments, [
				instance.crewCredits
			]);
			assert.strictEqual(instance.crewCredits[0].runInputValidations.mock.calls.length, 1);
			assert.deepStrictEqual(instance.crewCredits[0].runInputValidations.mock.calls[0].arguments, [
				{ isDuplicate: false }
			]);
			assert.strictEqual(stubs.getDuplicateIndicesModule.getDuplicateUrlIndices.mock.calls.length, 1);
			assert.deepStrictEqual(stubs.getDuplicateIndicesModule.getDuplicateUrlIndices.mock.calls[0].arguments, [
				instance.reviews
			]);
			assert.strictEqual(instance.reviews[0].runInputValidations.mock.calls.length, 1);
			assert.deepStrictEqual(instance.reviews[0].runInputValidations.mock.calls[0].arguments, [
				{ isDuplicate: false }
			]);
		});
	});

	describe('validateDates method', () => {
		context('valid data', () => {
			context('startDate with empty string values', () => {
				it('will not call addPropertyError method', async (test) => {
					const instance = new Production({ name: 'Hamlet', startDate: '' });

					test.mock.method(instance, 'addPropertyError', () => undefined);

					instance.validateDates();

					assert.equal(stubs.isValidDate.mock.calls.length, 3);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[0].arguments, ['']);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[1].arguments, ['']);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[2].arguments, ['']);
					assert.strictEqual(instance.addPropertyError.mock.calls.length, 0);
				});
			});

			context('startDate with valid date format', () => {
				it('will not call addPropertyError method', async (test) => {
					stubs.isValidDate = test.mock.fn();
					stubs.isValidDate.mock.mockImplementationOnce(() => true).mock.mockImplementation(() => false);

					const instance = new Production({ name: 'Hamlet', startDate: '2010-09-30' });

					test.mock.method(instance, 'addPropertyError', () => undefined);

					instance.validateDates();

					assert.equal(stubs.isValidDate.mock.calls.length, 3);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[0].arguments, ['2010-09-30']);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[1].arguments, ['']);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[2].arguments, ['']);
					assert.strictEqual(instance.addPropertyError.mock.calls.length, 0);
				});
			});

			context('pressDate with empty string values', () => {
				it('will not call addPropertyError method', async (test) => {
					const instance = new Production({ name: 'Hamlet', pressDate: '' });

					test.mock.method(instance, 'addPropertyError', () => undefined);

					instance.validateDates();

					assert.equal(stubs.isValidDate.mock.calls.length, 3);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[0].arguments, ['']);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[1].arguments, ['']);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[2].arguments, ['']);
					assert.strictEqual(instance.addPropertyError.mock.calls.length, 0);
				});
			});

			context('pressDate with valid date format', () => {
				it('will not call addPropertyError method', async (test) => {
					stubs.isValidDate = test.mock.fn();
					stubs.isValidDate.mock.mockImplementationOnce(() => false).mock.mockImplementationOnce(() => true).mock.mockImplementation(() => false);

					const instance = new Production({ name: 'Hamlet', pressDate: '2010-10-07' });

					test.mock.method(instance, 'addPropertyError', () => undefined);

					instance.validateDates();

					assert.equal(stubs.isValidDate.mock.calls.length, 3);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[0].arguments, ['']);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[1].arguments, ['2010-10-07']);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[2].arguments, ['']);
					assert.strictEqual(instance.addPropertyError.mock.calls.length, 0);
				});
			});

			context('endDate with empty string values', () => {
				it('will not call addPropertyError method', async (test) => {
					const instance = new Production({ name: 'Hamlet', endDate: '' });

					test.mock.method(instance, 'addPropertyError', () => undefined);

					instance.validateDates();

					assert.equal(stubs.isValidDate.mock.calls.length, 3);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[0].arguments, ['']);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[1].arguments, ['']);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[2].arguments, ['']);
					assert.strictEqual(instance.addPropertyError.mock.calls.length, 0);
				});
			});

			context('endDate with valid date format', () => {
				it('will not call addPropertyError method', async (test) => {
					stubs.isValidDate = test.mock.fn();
					stubs.isValidDate.mock.mockImplementationOnce(() => false).mock.mockImplementationOnce(() => false).mock.mockImplementationOnce(() => true).mock.mockImplementation(() => false);

					const instance = new Production({ name: 'Hamlet', endDate: '2011-01-26' });

					test.mock.method(instance, 'addPropertyError', () => undefined);

					instance.validateDates();

					assert.equal(stubs.isValidDate.mock.calls.length, 3);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[0].arguments, ['']);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[1].arguments, ['']);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[2].arguments, ['2011-01-26']);
					assert.strictEqual(instance.addPropertyError.mock.calls.length, 0);
				});
			});

			context('startDate and endDate with valid date format with startDate before endDate', () => {
				it('will not call addPropertyError method', async (test) => {
					stubs.isValidDate = test.mock.fn();
					stubs.isValidDate.mock.mockImplementationOnce(() => true).mock.mockImplementationOnce(() => false).mock.mockImplementationOnce(() => true).mock.mockImplementation(() => false);

					const instance = new Production({
						name: 'Hamlet',
						startDate: '2010-09-30',
						endDate: '2011-01-26'
					});

					test.mock.method(instance, 'addPropertyError', () => undefined);

					instance.validateDates();

					assert.equal(stubs.isValidDate.mock.calls.length, 3);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[0].arguments, ['2010-09-30']);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[1].arguments, ['']);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[2].arguments, ['2011-01-26']);
					assert.strictEqual(instance.addPropertyError.mock.calls.length, 0);
				});
			});

			context('startDate and endDate with valid date format with startDate same as endDate', () => {
				it('will not call addPropertyError method', async (test) => {
					stubs.isValidDate = test.mock.fn();
					stubs.isValidDate.mock.mockImplementationOnce(() => true).mock.mockImplementationOnce(() => false).mock.mockImplementationOnce(() => true).mock.mockImplementation(() => false);

					const instance = new Production({
						name: 'Hamlet',
						startDate: '2010-09-30',
						endDate: '2010-09-30'
					});

					test.mock.method(instance, 'addPropertyError', () => undefined);

					instance.validateDates();

					assert.equal(stubs.isValidDate.mock.calls.length, 3);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[0].arguments, ['2010-09-30']);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[1].arguments, ['']);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[2].arguments, ['2010-09-30']);
					assert.strictEqual(instance.addPropertyError.mock.calls.length, 0);
				});
			});

			context('startDate and pressDate with valid date format with startDate before pressDate', () => {
				it('will not call addPropertyError method', async (test) => {
					stubs.isValidDate = test.mock.fn();
					stubs.isValidDate.mock.mockImplementationOnce(() => true).mock.mockImplementationOnce(() => true).mock.mockImplementation(() => false);

					const instance = new Production({
						name: 'Hamlet',
						startDate: '2010-09-30',
						pressDate: '2010-10-07'
					});

					test.mock.method(instance, 'addPropertyError', () => undefined);

					instance.validateDates();

					assert.equal(stubs.isValidDate.mock.calls.length, 3);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[0].arguments, ['2010-09-30']);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[1].arguments, ['2010-10-07']);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[2].arguments, ['']);
					assert.strictEqual(instance.addPropertyError.mock.calls.length, 0);
				});
			});

			context('startDate and pressDate with valid date format with startDate same as pressDate', () => {
				it('will not call addPropertyError method', async (test) => {
					stubs.isValidDate = test.mock.fn();
					stubs.isValidDate.mock.mockImplementationOnce(() => true).mock.mockImplementationOnce(() => true).mock.mockImplementation(() => false);

					const instance = new Production({
						name: 'Hamlet',
						startDate: '2010-09-30',
						pressDate: '2010-09-30'
					});

					test.mock.method(instance, 'addPropertyError', () => undefined);

					instance.validateDates();

					assert.equal(stubs.isValidDate.mock.calls.length, 3);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[0].arguments, ['2010-09-30']);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[1].arguments, ['2010-09-30']);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[2].arguments, ['']);
					assert.strictEqual(instance.addPropertyError.mock.calls.length, 0);
				});
			});

			context('pressDate and endDate with valid date format with pressDate before endDate', () => {
				it('will not call addPropertyError method', async (test) => {
					stubs.isValidDate = test.mock.fn();
					stubs.isValidDate.mock.mockImplementationOnce(() => false).mock.mockImplementationOnce(() => true).mock.mockImplementationOnce(() => true).mock.mockImplementation(() => false);

					const instance = new Production({
						name: 'Hamlet',
						pressDate: '2010-10-07',
						endDate: '2011-01-26'
					});

					test.mock.method(instance, 'addPropertyError', () => undefined);

					instance.validateDates();

					assert.equal(stubs.isValidDate.mock.calls.length, 3);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[0].arguments, ['']);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[1].arguments, ['2010-10-07']);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[2].arguments, ['2011-01-26']);
					assert.strictEqual(instance.addPropertyError.mock.calls.length, 0);
				});
			});

			context('pressDate and endDate with valid date format with pressDate same as endDate', () => {
				it('will not call addPropertyError method', async (test) => {
					stubs.isValidDate = test.mock.fn();
					stubs.isValidDate.mock.mockImplementationOnce(() => false).mock.mockImplementationOnce(() => true).mock.mockImplementationOnce(() => true).mock.mockImplementation(() => false);

					const instance = new Production({
						name: 'Hamlet',
						pressDate: '2010-09-30',
						endDate: '2010-09-30'
					});

					test.mock.method(instance, 'addPropertyError', () => undefined);

					instance.validateDates();

					assert.equal(stubs.isValidDate.mock.calls.length, 3);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[0].arguments, ['']);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[1].arguments, ['2010-09-30']);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[2].arguments, ['2010-09-30']);
					assert.strictEqual(instance.addPropertyError.mock.calls.length, 0);
				});
			});

			context('startDate, pressDate, and endDate with empty string values', () => {
				it('will not call addPropertyError method', async (test) => {
					const instance = new Production({
						name: 'Hamlet',
						startDate: '',
						pressDate: '',
						endDate: ''
					});

					test.mock.method(instance, 'addPropertyError', () => undefined);

					instance.validateDates();

					assert.equal(stubs.isValidDate.mock.calls.length, 3);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[0].arguments, ['']);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[1].arguments, ['']);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[2].arguments, ['']);
					assert.strictEqual(instance.addPropertyError.mock.calls.length, 0);
				});
			});

			context(
				'startDate, pressDate, and endDate with valid date format with startDate before pressDate and pressDate before endDate',
				() => {
					it('will not call addPropertyError method', async (test) => {
						stubs.isValidDate = test.mock.fn();
						stubs.isValidDate.mock
							.mockImplementationOnce(() => true)
							.mockImplementationOnce(() => true)
							.mockImplementationOnce(() => true)
							.mock.mockImplementation(() => false);

						const instance = new Production({
							name: 'Hamlet',
							startDate: '2010-09-30',
							pressDate: '2010-10-07',
							endDate: '2011-01-26'
						});

						test.mock.method(instance, 'addPropertyError', () => undefined);

						instance.validateDates();

						assert.equal(stubs.isValidDate.mock.calls.length, 3);
						assert.deepStrictEqual(stubs.isValidDate.mock.calls[0].arguments, ['2010-09-30']);
						assert.deepStrictEqual(stubs.isValidDate.mock.calls[1].arguments, ['2010-10-07']);
						assert.deepStrictEqual(stubs.isValidDate.mock.calls[2].arguments, ['2011-01-26']);
						assert.strictEqual(instance.addPropertyError.mock.calls.length, 0);
					});
				}
			);

			context('startDate, pressDate, and endDate with valid date format all with same value', () => {
				it('will not call addPropertyError method', async (test) => {
					stubs.isValidDate = test.mock.fn();
					stubs.isValidDate.mock
						.mockImplementationOnce(() => true)
						.mockImplementationOnce(() => true)
						.mockImplementationOnce(() => true)
						.mock.mockImplementation(() => false);

					const instance = new Production({
						name: 'Hamlet',
						startDate: '2010-09-30',
						pressDate: '2010-09-30',
						endDate: '2010-09-30'
					});

					test.mock.method(instance, 'addPropertyError', () => undefined);

					instance.validateDates();

					assert.equal(stubs.isValidDate.mock.calls.length, 3);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[0].arguments, ['2010-09-30']);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[1].arguments, ['2010-09-30']);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[2].arguments, ['2010-09-30']);
					assert.strictEqual(instance.addPropertyError.mock.calls.length, 0);
				});
			});
		});

		context('invalid data', () => {
			context('startDate with invalid date format', () => {
				it('will call addPropertyError method', async (test) => {
					const instance = new Production({ name: 'Hamlet', startDate: 'foobar' });

					test.mock.method(instance, 'addPropertyError', () => undefined);

					instance.validateDates();

					assert.equal(stubs.isValidDate.mock.calls.length, 3);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[0].arguments, ['foobar']);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[1].arguments, ['']);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[2].arguments, ['']);
					assert.strictEqual(instance.addPropertyError.mock.calls.length, 1);
					assert.deepStrictEqual(instance.addPropertyError.mock.calls[0].arguments, [
						'startDate',
						'Value must be in date format'
					]);
				});
			});

			context('pressDate with invalid date format', () => {
				it('will call addPropertyError method', async (test) => {
					const instance = new Production({ name: 'Hamlet', pressDate: 'foobar' });

					test.mock.method(instance, 'addPropertyError', () => undefined);

					instance.validateDates();

					assert.equal(stubs.isValidDate.mock.calls.length, 3);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[0].arguments, ['']);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[1].arguments, ['foobar']);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[2].arguments, ['']);
					assert.strictEqual(instance.addPropertyError.mock.calls.length, 1);
					assert.deepStrictEqual(instance.addPropertyError.mock.calls[0].arguments, [
						'pressDate',
						'Value must be in date format'
					]);
				});
			});

			context('endDate with invalid date format', () => {
				it('will call addPropertyError method', async (test) => {
					const instance = new Production({ name: 'Hamlet', endDate: 'foobar' });

					test.mock.method(instance, 'addPropertyError', () => undefined);

					instance.validateDates();

					assert.equal(stubs.isValidDate.mock.calls.length, 3);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[0].arguments, ['']);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[1].arguments, ['']);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[2].arguments, ['foobar']);
					assert.strictEqual(instance.addPropertyError.mock.calls.length, 1);
					assert.deepStrictEqual(instance.addPropertyError.mock.calls[0].arguments, [
						'endDate',
						'Value must be in date format'
					]);
				});
			});

			context('startDate and endDate with valid date format with startDate after endDate', () => {
				it('will call addPropertyError method', async (test) => {
					stubs.isValidDate = test.mock.fn();
					stubs.isValidDate.mock.mockImplementationOnce(() => true).mock.mockImplementationOnce(() => false).mock.mockImplementationOnce(() => true).mock.mockImplementation(() => false);

					const instance = new Production({
						name: 'Hamlet',
						startDate: '2011-01-26',
						endDate: '2010-09-30'
					});

					test.mock.method(instance, 'addPropertyError', () => undefined);

					instance.validateDates();

					assert.equal(stubs.isValidDate.mock.calls.length, 3);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[0].arguments, ['2011-01-26']);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[1].arguments, ['']);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[2].arguments, ['2010-09-30']);
					assert.strictEqual(instance.addPropertyError.mock.calls.length, 2);
					assert.deepStrictEqual(instance.addPropertyError.mock.calls[0].arguments, [
						'startDate',
						'Start date must not be after end date'
					]);
					assert.deepStrictEqual(instance.addPropertyError.mock.calls[1].arguments, [
						'endDate',
						'End date must not be before start date'
					]);
				});
			});

			context('startDate and pressDate with valid date format with startDate after pressDate', () => {
				it('will call addPropertyError method', async (test) => {
					stubs.isValidDate = test.mock.fn();
					stubs.isValidDate.mock.mockImplementationOnce(() => true).mock.mockImplementationOnce(() => true).mock.mockImplementation(() => false);

					const instance = new Production({
						name: 'Hamlet',
						startDate: '2010-10-07',
						pressDate: '2010-09-30'
					});

					test.mock.method(instance, 'addPropertyError', () => undefined);

					instance.validateDates();

					assert.equal(stubs.isValidDate.mock.calls.length, 3);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[0].arguments, ['2010-10-07']);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[1].arguments, ['2010-09-30']);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[2].arguments, ['']);
					assert.strictEqual(instance.addPropertyError.mock.calls.length, 2);
					assert.deepStrictEqual(instance.addPropertyError.mock.calls[0].arguments, [
						'startDate',
						'Start date must not be after press date'
					]);
					assert.deepStrictEqual(instance.addPropertyError.mock.calls[1].arguments, [
						'pressDate',
						'Press date must not be before start date'
					]);
				});
			});

			context('pressDate and endDate with valid date format with pressDate after endDate', () => {
				it('will call addPropertyError method', async (test) => {
					stubs.isValidDate = test.mock.fn();
					stubs.isValidDate.mock.mockImplementationOnce(() => false).mock.mockImplementationOnce(() => true).mock.mockImplementationOnce(() => true).mock.mockImplementation(() => false);

					const instance = new Production({
						name: 'Hamlet',
						pressDate: '2011-01-26',
						endDate: '2010-10-07'
					});

					test.mock.method(instance, 'addPropertyError', () => undefined);

					instance.validateDates();

					assert.equal(stubs.isValidDate.mock.calls.length, 3);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[0].arguments, ['']);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[1].arguments, ['2011-01-26']);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[2].arguments, ['2010-10-07']);
					assert.strictEqual(instance.addPropertyError.mock.calls.length, 2);
					assert.deepStrictEqual(instance.addPropertyError.mock.calls[0].arguments, [
						'pressDate',
						'Press date must not be after end date'
					]);
					assert.deepStrictEqual(instance.addPropertyError.mock.calls[1].arguments, [
						'endDate',
						'End date must not be before press date'
					]);
				});
			});

			context(
				'startDate, pressDate, and endDate with valid date format with startDate after pressDate and pressDate after endDate',
				() => {
					it('will call addPropertyError method', async (test) => {
						stubs.isValidDate = test.mock.fn();
						stubs.isValidDate.mock
							.mockImplementationOnce(() => true)
							.mockImplementationOnce(() => true)
							.mockImplementationOnce(() => true)
							.mock.mockImplementation(() => false);

						const instance = new Production({
							name: 'Hamlet',
							startDate: '2011-01-26',
							pressDate: '2010-10-07',
							endDate: '2010-09-30'
						});

						test.mock.method(instance, 'addPropertyError', () => undefined);

						instance.validateDates();

						assert.equal(stubs.isValidDate.mock.calls.length, 3);
						assert.deepStrictEqual(stubs.isValidDate.mock.calls[0].arguments, ['2011-01-26']);
						assert.deepStrictEqual(stubs.isValidDate.mock.calls[1].arguments, ['2010-10-07']);
						assert.deepStrictEqual(stubs.isValidDate.mock.calls[2].arguments, ['2010-09-30']);
						assert.equal(instance.addPropertyError.mock.calls.length, 6);
						assert.deepStrictEqual(instance.addPropertyError.mock.calls[0].arguments, [
							'startDate',
							'Start date must not be after end date'
						]);
						assert.deepStrictEqual(instance.addPropertyError.mock.calls[1].arguments, [
							'endDate',
							'End date must not be before start date'
						]);
						assert.deepStrictEqual(instance.addPropertyError.mock.calls[2].arguments, [
							'startDate',
							'Start date must not be after press date'
						]);
						assert.deepStrictEqual(instance.addPropertyError.mock.calls[3].arguments, [
							'pressDate',
							'Press date must not be before start date'
						]);
						assert.deepStrictEqual(instance.addPropertyError.mock.calls[4].arguments, [
							'pressDate',
							'Press date must not be after end date'
						]);
						assert.deepStrictEqual(instance.addPropertyError.mock.calls[5].arguments, [
							'endDate',
							'End date must not be before press date'
						]);
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

			assert.strictEqual(instance.subProductions[0].runDatabaseValidations.mock.calls.length, 1);
			assert.deepStrictEqual(instance.subProductions[0].runDatabaseValidations.mock.calls[0].arguments, [
				{
					subjectProductionUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
				}
			]);
		});
	});
});
