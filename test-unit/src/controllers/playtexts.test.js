import { expect } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

import { Playtext } from '../../../src/models';

describe('Playtexts controller', () => {

	let stubs;

	const PlaytextStub = function () {

		return sinon.createStubInstance(Playtext);

	};

	beforeEach(() => {

		stubs = {
			callClassMethodsModule: {
				callInstanceMethod: sinon.stub().resolves('callInstanceMethod response'),
				callStaticListMethod: sinon.stub().resolves('callStaticListMethod response')
			},
			sendJsonResponseModule: {
				sendJsonResponse: sinon.stub().returns('sendJsonResponse response')
			},
			models: {
				Playtext: PlaytextStub
			},
			request: sinon.stub(),
			response: sinon.stub(),
			next: sinon.stub()
		};

	});

	const createSubject = () =>
		proxyquire('../../../src/controllers/playtexts', {
			'../lib/call-class-methods': stubs.callClassMethodsModule,
			'../lib/send-json-response': stubs.sendJsonResponseModule,
			'../models': stubs.models
		});

	const callFunction = functionName => {

		const playtextsController = createSubject();

		return playtextsController[functionName](stubs.request, stubs.response, stubs.next);

	};

	describe('newRoute function', () => {

		it('calls sendJsonResponse module', () => {

			expect(callFunction('newRoute')).to.eq('sendJsonResponse response');
			expect(stubs.sendJsonResponseModule.sendJsonResponse.calledOnce).to.be.true;
			expect(stubs.sendJsonResponseModule.sendJsonResponse.calledWithExactly(
				stubs.response, stubs.models.Playtext()
			)).to.be.true;

		});

	});

	describe('createRoute function', () => {

		it('calls callInstanceMethod module', async () => {

			const result = await callFunction('createRoute');
			expect(stubs.callClassMethodsModule.callInstanceMethod.calledOnce).to.be.true;
			expect(stubs.callClassMethodsModule.callInstanceMethod.calledWithExactly(
				stubs.response, stubs.next, stubs.models.Playtext(), 'create'
			)).to.be.true;
			expect(result).to.eq('callInstanceMethod response');

		});

	});

	describe('editRoute function', () => {

		it('calls callInstanceMethod module', async () => {

			const result = await callFunction('editRoute');
			expect(stubs.callClassMethodsModule.callInstanceMethod.calledOnce).to.be.true;
			expect(stubs.callClassMethodsModule.callInstanceMethod.calledWithExactly(
				stubs.response, stubs.next, stubs.models.Playtext(), 'edit'
			)).to.be.true;
			expect(result).to.eq('callInstanceMethod response');

		});

	});

	describe('updateRoute function', () => {

		it('calls callInstanceMethod module', async () => {

			const result = await callFunction('updateRoute');
			expect(stubs.callClassMethodsModule.callInstanceMethod.calledOnce).to.be.true;
			expect(stubs.callClassMethodsModule.callInstanceMethod.calledWithExactly(
				stubs.response, stubs.next, stubs.models.Playtext(), 'update'
			)).to.be.true;
			expect(result).to.eq('callInstanceMethod response');

		});

	});

	describe('deleteRoute function', () => {

		it('calls callInstanceMethod module', async () => {

			const result = await callFunction('deleteRoute');
			expect(stubs.callClassMethodsModule.callInstanceMethod.calledOnce).to.be.true;
			expect(stubs.callClassMethodsModule.callInstanceMethod.calledWithExactly(
				stubs.response, stubs.next, stubs.models.Playtext(), 'delete'
			)).to.be.true;
			expect(result).to.eq('callInstanceMethod response');

		});

	});

	describe('showRoute function', () => {

		it('calls callInstanceMethod module', async () => {

			const result = await callFunction('showRoute');
			expect(stubs.callClassMethodsModule.callInstanceMethod.calledOnce).to.be.true;
			expect(stubs.callClassMethodsModule.callInstanceMethod.calledWithExactly(
				stubs.response, stubs.next, stubs.models.Playtext(), 'show'
			)).to.be.true;
			expect(result).to.eq('callInstanceMethod response');

		});

	});

	describe('listRoute function', () => {

		it('calls callStaticListMethod module', async () => {

			const result = await callFunction('listRoute');
			expect(stubs.callClassMethodsModule.callStaticListMethod.calledOnce).to.be.true;
			expect(stubs.callClassMethodsModule.callStaticListMethod.calledWithExactly(
				stubs.response, stubs.next, stubs.models.Playtext, 'playtext'
			)).to.be.true;
			expect(result).to.eq('callStaticListMethod response');

		});

	});

});
