import { expect } from 'chai';
import esmock from 'esmock';
import { assert, spy, stub } from 'sinon';

describe('ProductionIdentifier model', () => {

	let stubs;

	beforeEach(() => {

		stubs = {
			stringsModule: {
				getTrimmedOrEmptyString: stub().callsFake(arg => arg?.trim() || '')
			}
		};

	});

	const createSubject = () =>
		esmock(
			'../../../src/models/ProductionIdentifier.js',
			{
				'../../../src/lib/strings.js': stubs.stringsModule
			}
		);

	describe('constructor method', () => {

		it('calls getTrimmedOrEmptyString to get values to assign to properties', async () => {

			const ProductionIdentifier = await createSubject();
			new ProductionIdentifier();
			expect(stubs.stringsModule.getTrimmedOrEmptyString.callCount).to.equal(1);

		});

		describe('uuid property', () => {

			it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {

				const ProductionIdentifier = await createSubject();
				const instance = new ProductionIdentifier({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });
				assert.calledWithExactly(
					stubs.stringsModule.getTrimmedOrEmptyString,
					'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
				);
				expect(instance.uuid).to.equal('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

			});

		});

	});

	describe('validateUuid method', () => {

		it('will call validateStringForProperty method', async () => {

			const ProductionIdentifier = await createSubject();
			const instance = new ProductionIdentifier({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });
			spy(instance, 'validateStringForProperty');
			instance.validateUuid();
			assert.calledOnceWithExactly(instance.validateStringForProperty, 'uuid', { isRequired: false });

		});

	});

});
