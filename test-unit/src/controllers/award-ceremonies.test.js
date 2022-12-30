import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { assert, createStubInstance, stub } from 'sinon';

import { AwardCeremony } from '../../../src/models';

describe('Award ceremonies controller', () => {

	let stubs;

	const AwardCeremonyStub = function () {

		return createStubInstance(AwardCeremony);

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
				AwardCeremony: AwardCeremonyStub
			},
			request: stub(),
			response: stub(),
			next: stub()
		};

	});

	const createSubject = () =>
		proxyquire('../../../src/controllers/award-ceremonies', {
			'../lib/call-class-methods': stubs.callClassMethodsModule,
			'../lib/send-json-response': stubs.sendJsonResponseModule,
			'../models': stubs.models
		});

	const callFunction = functionName => {

		const awardCeremoniesController = createSubject();

		return awardCeremoniesController[functionName](stubs.request, stubs.response, stubs.next);

	};

	describe('newRoute function', () => {

		it('calls sendJsonResponse module', () => {

			const result = callFunction('newRoute');
			assert.calledOnce(stubs.sendJsonResponseModule.sendJsonResponse);
			assert.calledWithExactly(
				stubs.sendJsonResponseModule.sendJsonResponse,
				stubs.response, stubs.models.AwardCeremony() // eslint-disable-line new-cap
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
				stubs.response, stubs.next, stubs.models.AwardCeremony(), 'CREATE' // eslint-disable-line new-cap
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
				stubs.response, stubs.next, stubs.models.AwardCeremony(), 'EDIT' // eslint-disable-line new-cap
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
				stubs.response, stubs.next, stubs.models.AwardCeremony(), 'UPDATE' // eslint-disable-line new-cap
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
				stubs.response, stubs.next, stubs.models.AwardCeremony(), 'DELETE' // eslint-disable-line new-cap
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
				stubs.response, stubs.next, stubs.models.AwardCeremony(), 'SHOW' // eslint-disable-line new-cap
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
				stubs.response, stubs.next, stubs.models.AwardCeremony, 'AWARD_CEREMONY'
			);
			expect(result).to.equal('callStaticListMethod response');

		});

	});

});
