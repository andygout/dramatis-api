import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { assert, createStubInstance, stub } from 'sinon';

import { Material } from '../../../src/models';

describe('Materials controller', () => {

	let stubs;

	const MaterialStub = function () {

		return createStubInstance(Material);

	};

	beforeEach(() => {

		stubs = {
			callClassMethodsModule: {
				callInstanceMethod: stub().resolves('callInstanceMethod response'),
				callStaticListMethod: stub().resolves('callStaticListMethod response')
			},
			sendJsonResponseModule: {
				sendJsonResponse: stub().returns('sendJsonResponse response')
			},
			models: {
				Material: MaterialStub
			},
			request: stub(),
			response: stub(),
			next: stub()
		};

	});

	const createSubject = () =>
		proxyquire('../../../src/controllers/materials', {
			'../lib/call-class-methods': stubs.callClassMethodsModule,
			'../lib/send-json-response': stubs.sendJsonResponseModule,
			'../models': stubs.models
		});

	const callFunction = functionName => {

		const materialsController = createSubject();

		return materialsController[functionName](stubs.request, stubs.response, stubs.next);

	};

	describe('newRoute function', () => {

		it('calls sendJsonResponse module', () => {

			const result = callFunction('newRoute');
			assert.calledOnce(stubs.sendJsonResponseModule.sendJsonResponse);
			assert.calledWithExactly(
				stubs.sendJsonResponseModule.sendJsonResponse,
				stubs.response, stubs.models.Material() // eslint-disable-line new-cap
			);
			expect(result).to.equal('sendJsonResponse response');

		});

	});

	describe('createRoute function', () => {

		it('calls callInstanceMethod module', async () => {

			const result = await callFunction('createRoute');
			assert.calledOnce(stubs.callClassMethodsModule.callInstanceMethod);
			assert.calledWithExactly(
				stubs.callClassMethodsModule.callInstanceMethod,
				stubs.response, stubs.next, stubs.models.Material(), 'CREATE' // eslint-disable-line new-cap
			);
			expect(result).to.equal('callInstanceMethod response');

		});

	});

	describe('editRoute function', () => {

		it('calls callInstanceMethod module', async () => {

			const result = await callFunction('editRoute');
			assert.calledOnce(stubs.callClassMethodsModule.callInstanceMethod);
			assert.calledWithExactly(
				stubs.callClassMethodsModule.callInstanceMethod,
				stubs.response, stubs.next, stubs.models.Material(), 'EDIT' // eslint-disable-line new-cap
			);
			expect(result).to.equal('callInstanceMethod response');

		});

	});

	describe('updateRoute function', () => {

		it('calls callInstanceMethod module', async () => {

			const result = await callFunction('updateRoute');
			assert.calledOnce(stubs.callClassMethodsModule.callInstanceMethod);
			assert.calledWithExactly(
				stubs.callClassMethodsModule.callInstanceMethod,
				stubs.response, stubs.next, stubs.models.Material(), 'UPDATE' // eslint-disable-line new-cap
			);
			expect(result).to.equal('callInstanceMethod response');

		});

	});

	describe('deleteRoute function', () => {

		it('calls callInstanceMethod module', async () => {

			const result = await callFunction('deleteRoute');
			assert.calledOnce(stubs.callClassMethodsModule.callInstanceMethod);
			assert.calledWithExactly(
				stubs.callClassMethodsModule.callInstanceMethod,
				stubs.response, stubs.next, stubs.models.Material(), 'DELETE' // eslint-disable-line new-cap
			);
			expect(result).to.equal('callInstanceMethod response');

		});

	});

	describe('showRoute function', () => {

		it('calls callInstanceMethod module', async () => {

			const result = await callFunction('showRoute');
			assert.calledOnce(stubs.callClassMethodsModule.callInstanceMethod);
			assert.calledWithExactly(
				stubs.callClassMethodsModule.callInstanceMethod,
				stubs.response, stubs.next, stubs.models.Material(), 'SHOW' // eslint-disable-line new-cap
			);
			expect(result).to.equal('callInstanceMethod response');

		});

	});

	describe('listRoute function', () => {

		it('calls callStaticListMethod module', async () => {

			const result = await callFunction('listRoute');
			assert.calledOnce(stubs.callClassMethodsModule.callStaticListMethod);
			assert.calledWithExactly(
				stubs.callClassMethodsModule.callStaticListMethod,
				stubs.response, stubs.next, stubs.models.Material, 'MATERIAL'
			);
			expect(result).to.equal('callStaticListMethod response');

		});

	});

});
