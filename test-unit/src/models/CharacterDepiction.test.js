import { expect } from 'chai';
import { assert, createSandbox, spy } from 'sinon';

import * as stringsModule from '../../../src/lib/strings';
import CharacterDepiction from '../../../src/models/CharacterDepiction';

describe('CharacterDepiction model', () => {

	let stubs;

	const sandbox = createSandbox();

	beforeEach(() => {

		stubs = {
			getTrimmedOrEmptyString:
				sandbox.stub(stringsModule, 'getTrimmedOrEmptyString').callsFake(arg => arg?.trim() || '')
		};

	});

	afterEach(() => {

		sandbox.restore();

	});

	describe('constructor method', () => {

		it('calls getTrimmedOrEmptyString to get values to assign to properties', () => {

			new CharacterDepiction();
			expect(stubs.getTrimmedOrEmptyString.callCount).to.equal(4);

		});

		describe('underlyingName property', () => {

			it('assigns return value from getTrimmedOrEmptyString called with props value', () => {

				const instance = new CharacterDepiction({ underlyingName: 'King Henry V' });
				assert.calledWithExactly(stubs.getTrimmedOrEmptyString.thirdCall, 'King Henry V');
				expect(instance.underlyingName).to.equal('King Henry V');

			});

		});

		describe('qualifier property', () => {

			it('assigns return value from getTrimmedOrEmptyString called with props value', () => {

				const instance = new CharacterDepiction({ qualifier: 'older' });
				assert.calledWithExactly(stubs.getTrimmedOrEmptyString.getCall(3), 'older');
				expect(instance.qualifier).to.equal('older');

			});

		});

	});

	describe('validateUnderlyingName method', () => {

		it('will call validateStringForProperty method', () => {

			const instance = new CharacterDepiction({ name: 'Prince Hal', underlyingName: 'King Henry V' });
			spy(instance, 'validateStringForProperty');
			instance.validateUnderlyingName();
			assert.calledOnceWithExactly(
				instance.validateStringForProperty,
				'underlyingName', { isRequired: false }
			);

		});

	});

	describe('validateCharacterNameUnderlyingNameDisparity method', () => {

		context('valid data', () => {

			context('role name without a character name', () => {

				it('will not add properties to errors property', () => {

					const instance = new CharacterDepiction({ name: 'Prince Hal', underlyingName: '' });
					spy(instance, 'addPropertyError');
					instance.validateCharacterNameUnderlyingNameDisparity();
					assert.notCalled(instance.addPropertyError);

				});

			});

			context('role name and different character name', () => {

				it('will not add properties to errors property', () => {

					const instance = new CharacterDepiction({ name: 'Prince Hal', underlyingName: 'King Henry V' });
					spy(instance, 'addPropertyError');
					instance.validateCharacterNameUnderlyingNameDisparity();
					assert.notCalled(instance.addPropertyError);

				});

			});

			context('no role name and no character name', () => {

				it('will not add properties to errors property', () => {

					const instance = new CharacterDepiction({ name: '', underlyingName: '' });
					spy(instance, 'addPropertyError');
					instance.validateCharacterNameUnderlyingNameDisparity();
					assert.notCalled(instance.addPropertyError);

				});

			});

		});

		context('invalid data', () => {

			it('adds properties whose values are arrays to errors property', () => {

				const instance = new CharacterDepiction({ name: 'King Henry V', underlyingName: 'King Henry V' });
				spy(instance, 'addPropertyError');
				instance.validateCharacterNameUnderlyingNameDisparity();
				assert.calledOnceWithExactly(
					instance.addPropertyError,
					'underlyingName', 'Underlying name is only required if different from character name'
				);

			});

		});

	});

});
