import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { createStubInstance, stub } from 'sinon';

import { Character } from '../../../src/models';

describe('Characters controller', () => {

	let stubs;

	const CharacterStub = function () {

		return createStubInstance(Character);

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
				Character: CharacterStub
			},
			request: stub(),
			response: stub(),
			next: stub()
		};

	});

	const createSubject = () =>
		proxyquire('../../../src/controllers/characters', {
			'../lib/call-class-methods': stubs.callClassMethodsModule,
			'../lib/send-json-response': stubs.sendJsonResponseModule,
			'../models': stubs.models
		});

	const callFunction = functionName => {

		const charactersController = createSubject();

		return charactersController[functionName](stubs.request, stubs.response, stubs.next);

	};

	describe('newRoute function', () => {

		it('calls sendJsonResponse module', () => {

			expect(callFunction('newRoute')).to.equal('sendJsonResponse response');
			expect(stubs.sendJsonResponseModule.sendJsonResponse.calledOnce).to.be.true;
			expect(stubs.sendJsonResponseModule.sendJsonResponse.calledWithExactly(
				stubs.response,
				stubs.models.Character() // eslint-disable-line new-cap
			)).to.be.true;

		});

	});

	describe('createRoute function', () => {

		it('calls callInstanceMethod module', async () => {

			const result = await callFunction('createRoute');
			expect(stubs.callClassMethodsModule.callInstanceMethod.calledOnce).to.be.true;
			expect(stubs.callClassMethodsModule.callInstanceMethod.calledWithExactly(
				stubs.response, stubs.next, stubs.models.Character(), 'create' // eslint-disable-line new-cap
			)).to.be.true;
			expect(result).to.equal('callInstanceMethod response');

		});

	});

	describe('editRoute function', () => {

		it('calls callInstanceMethod module', async () => {

			const result = await callFunction('editRoute');
			expect(stubs.callClassMethodsModule.callInstanceMethod.calledOnce).to.be.true;
			expect(stubs.callClassMethodsModule.callInstanceMethod.calledWithExactly(
				stubs.response, stubs.next, stubs.models.Character(), 'edit' // eslint-disable-line new-cap
			)).to.be.true;
			expect(result).to.equal('callInstanceMethod response');

		});

	});

	describe('updateRoute function', () => {

		it('calls callInstanceMethod module', async () => {

			const result = await callFunction('updateRoute');
			expect(stubs.callClassMethodsModule.callInstanceMethod.calledOnce).to.be.true;
			expect(stubs.callClassMethodsModule.callInstanceMethod.calledWithExactly(
				stubs.response, stubs.next, stubs.models.Character(), 'update' // eslint-disable-line new-cap
			)).to.be.true;
			expect(result).to.equal('callInstanceMethod response');

		});

	});

	describe('deleteRoute function', () => {

		it('calls callInstanceMethod module', async () => {

			const result = await callFunction('deleteRoute');
			expect(stubs.callClassMethodsModule.callInstanceMethod.calledOnce).to.be.true;
			expect(stubs.callClassMethodsModule.callInstanceMethod.calledWithExactly(
				stubs.response, stubs.next, stubs.models.Character(), 'delete' // eslint-disable-line new-cap
			)).to.be.true;
			expect(result).to.equal('callInstanceMethod response');

		});

	});

	describe('showRoute function', () => {

		it('calls callInstanceMethod module', async () => {

			const result = await callFunction('showRoute');
			expect(stubs.callClassMethodsModule.callInstanceMethod.calledOnce).to.be.true;
			expect(stubs.callClassMethodsModule.callInstanceMethod.calledWithExactly(
				stubs.response, stubs.next, stubs.models.Character(), 'show' // eslint-disable-line new-cap
			)).to.be.true;
			expect(result).to.equal('callInstanceMethod response');

		});

	});

	describe('listRoute function', () => {

		it('calls callStaticListMethod module', async () => {

			const result = await callFunction('listRoute');
			expect(stubs.callClassMethodsModule.callStaticListMethod.calledOnce).to.be.true;
			expect(stubs.callClassMethodsModule.callStaticListMethod.calledWithExactly(
				stubs.response, stubs.next, stubs.models.Character, 'CHARACTER'
			)).to.be.true;
			expect(result).to.equal('callStaticListMethod response');

		});

	});

});
