import { expect } from 'chai';
import esmock from 'esmock';
import { assert, createStubInstance, restore, stub } from 'sinon';

import { Character } from '../../../src/models/index.js';

describe('Characters controller', () => {

	let stubs;
	let charactersController;

	const CharacterStub = function () {

		return createStubInstance(Character);

	};

	beforeEach(async () => {

		stubs = {
			callClassMethodsModule: {
				callInstanceMethod: stub().resolves('callInstanceMethod response'),
				callStaticListMethod: stub().resolves('callStaticListMethod response')
			},
			sendJsonResponse: stub().returns('sendJsonResponse response'),
			models: {
				Character: CharacterStub
			},
			request: stub(),
			response: stub(),
			next: stub()
		};

		charactersController = await esmock(
			'../../../src/controllers/characters.js',
			{
				'../../../src/lib/call-class-methods.js': stubs.callClassMethodsModule,
				'../../../src/lib/send-json-response.js': stubs.sendJsonResponse,
				'../../../src/models/index.js': stubs.models
			}
		);

	});

	afterEach(() => {

		restore();

	});

	const callFunction = async functionName => {

		return charactersController[functionName](stubs.request, stubs.response, stubs.next);

	};

	describe('newRoute function', () => {

		it('calls sendJsonResponse module', async () => {

			const result = await callFunction('newRoute');

			assert.calledOnceWithExactly(
				stubs.sendJsonResponse,
				stubs.response, stubs.models.Character() // eslint-disable-line new-cap
			);
			expect(result).to.equal('sendJsonResponse response');

		});

	});

	describe('createRoute function', () => {

		it('calls callInstanceMethod module', async () => {

			const result = await callFunction('createRoute');

			assert.calledOnceWithExactly(
				stubs.callClassMethodsModule.callInstanceMethod,
				stubs.response, stubs.next, stubs.models.Character(), 'CREATE' // eslint-disable-line new-cap
			);
			expect(result).to.equal('callInstanceMethod response');

		});

	});

	describe('editRoute function', () => {

		it('calls callInstanceMethod module', async () => {

			const result = await callFunction('editRoute');

			assert.calledOnceWithExactly(
				stubs.callClassMethodsModule.callInstanceMethod,
				stubs.response, stubs.next, stubs.models.Character(), 'EDIT' // eslint-disable-line new-cap
			);
			expect(result).to.equal('callInstanceMethod response');

		});

	});

	describe('updateRoute function', () => {

		it('calls callInstanceMethod module', async () => {

			const result = await callFunction('updateRoute');

			assert.calledOnceWithExactly(
				stubs.callClassMethodsModule.callInstanceMethod,
				stubs.response, stubs.next, stubs.models.Character(), 'UPDATE' // eslint-disable-line new-cap
			);
			expect(result).to.equal('callInstanceMethod response');

		});

	});

	describe('deleteRoute function', () => {

		it('calls callInstanceMethod module', async () => {

			const result = await callFunction('deleteRoute');

			assert.calledOnceWithExactly(
				stubs.callClassMethodsModule.callInstanceMethod,
				stubs.response, stubs.next, stubs.models.Character(), 'DELETE' // eslint-disable-line new-cap
			);
			expect(result).to.equal('callInstanceMethod response');

		});

	});

	describe('showRoute function', () => {

		it('calls callInstanceMethod module', async () => {

			const result = await callFunction('showRoute');

			assert.calledOnceWithExactly(
				stubs.callClassMethodsModule.callInstanceMethod,
				stubs.response, stubs.next, stubs.models.Character(), 'SHOW' // eslint-disable-line new-cap
			);
			expect(result).to.equal('callInstanceMethod response');

		});

	});

	describe('listRoute function', () => {

		it('calls callStaticListMethod module', async () => {

			const result = await callFunction('listRoute');

			assert.calledOnceWithExactly(
				stubs.callClassMethodsModule.callStaticListMethod,
				stubs.response, stubs.next, stubs.models.Character, 'CHARACTER'
			);
			expect(result).to.equal('callStaticListMethod response');

		});

	});

});
