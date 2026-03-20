import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';
import { assert as sinonAssert, createStubInstance, restore, stub } from 'sinon';

import { Material } from '../../../src/models/index.js';

describe('Materials controller', () => {
	let stubs;
	let materialsController;

	const MaterialStub = function () {
		return createStubInstance(Material);
	};

	beforeEach(async () => {
		stubs = {
			callClassMethodsModule: {
				callInstanceMethod: stub().resolves('callInstanceMethod response'),
				callStaticListMethod: stub().resolves('callStaticListMethod response')
			},
			sendJsonResponse: stub().returns('sendJsonResponse response'),
			models: {
				Material: MaterialStub
			},
			request: stub(),
			response: stub(),
			next: stub()
		};

		materialsController = await esmock('../../../src/controllers/materials.js', {
			'../../../src/lib/call-class-methods.js': stubs.callClassMethodsModule,
			'../../../src/lib/send-json-response.js': stubs.sendJsonResponse,
			'../../../src/models/index.js': stubs.models
		});
	});

	afterEach(() => {
		restore();
	});

	const callFunction = async (functionName) => {
		return materialsController[functionName](stubs.request, stubs.response, stubs.next);
	};

	describe('newRoute function', () => {
		it('calls sendJsonResponse module', async () => {
			const result = await callFunction('newRoute');

			sinonAssert.calledOnceWithExactly(
				stubs.sendJsonResponse,
				stubs.response,
				stubs.models.Material() // eslint-disable-line new-cap
			);
			assert.strictEqual(result, 'sendJsonResponse response');
		});
	});

	describe('createRoute function', () => {
		it('calls callInstanceMethod module', async () => {
			const result = await callFunction('createRoute');

			sinonAssert.calledOnceWithExactly(
				stubs.callClassMethodsModule.callInstanceMethod,
				stubs.response,
				stubs.next,
				stubs.models.Material(), // eslint-disable-line new-cap
				'CREATE'
			);
			assert.strictEqual(result, 'callInstanceMethod response');
		});
	});

	describe('editRoute function', () => {
		it('calls callInstanceMethod module', async () => {
			const result = await callFunction('editRoute');

			sinonAssert.calledOnceWithExactly(
				stubs.callClassMethodsModule.callInstanceMethod,
				stubs.response,
				stubs.next,
				stubs.models.Material(), // eslint-disable-line new-cap
				'EDIT'
			);
			assert.strictEqual(result, 'callInstanceMethod response');
		});
	});

	describe('updateRoute function', () => {
		it('calls callInstanceMethod module', async () => {
			const result = await callFunction('updateRoute');

			sinonAssert.calledOnceWithExactly(
				stubs.callClassMethodsModule.callInstanceMethod,
				stubs.response,
				stubs.next,
				stubs.models.Material(), // eslint-disable-line new-cap
				'UPDATE'
			);
			assert.strictEqual(result, 'callInstanceMethod response');
		});
	});

	describe('deleteRoute function', () => {
		it('calls callInstanceMethod module', async () => {
			const result = await callFunction('deleteRoute');

			sinonAssert.calledOnceWithExactly(
				stubs.callClassMethodsModule.callInstanceMethod,
				stubs.response,
				stubs.next,
				stubs.models.Material(), // eslint-disable-line new-cap
				'DELETE'
			);
			assert.strictEqual(result, 'callInstanceMethod response');
		});
	});

	describe('showRoute function', () => {
		it('calls callInstanceMethod module', async () => {
			const result = await callFunction('showRoute');

			sinonAssert.calledOnceWithExactly(
				stubs.callClassMethodsModule.callInstanceMethod,
				stubs.response,
				stubs.next,
				stubs.models.Material(), // eslint-disable-line new-cap
				'SHOW'
			);
			assert.strictEqual(result, 'callInstanceMethod response');
		});
	});

	describe('listRoute function', () => {
		it('calls callStaticListMethod module', async () => {
			const result = await callFunction('listRoute');

			sinonAssert.calledOnceWithExactly(
				stubs.callClassMethodsModule.callStaticListMethod,
				stubs.response,
				stubs.next,
				stubs.models.Material,
				'MATERIAL'
			);
			assert.strictEqual(result, 'callStaticListMethod response');
		});
	});
});
