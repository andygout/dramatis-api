import { expect } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

import Theatre from '../../../server/models/theatre';

describe('Theatres controller', () => {

	let stubs;

	const TheatreStub = function () {

		return sinon.createStubInstance(Theatre);

	};

	beforeEach(() => {

		stubs = {
			callClassMethodsModule: {
				callInstanceMethod: sinon.stub().resolves('callInstanceMethod response'),
				callStaticListMethod: sinon.stub().resolves('callStaticListMethod response')
			},
			renderJsonModule: {
				renderJson: sinon.stub().returns('renderJson response')
			},
			models: {
				Theatre: TheatreStub
			},
			req: sinon.stub(),
			res: sinon.stub(),
			next: sinon.stub()
		};

	});

	const createSubject = () =>
		proxyquire('../../../server/controllers/theatres', {
			'../lib/call-class-methods': stubs.callClassMethodsModule,
			'../lib/render-json': stubs.renderJsonModule,
			'../models': stubs.models
		});

	const callFunction = functionName => {

		const theatresController = createSubject();

		return theatresController[functionName](stubs.req, stubs.res, stubs.next);

	};

	describe('newRoute function', () => {

		it('calls renderJson module', () => {

			expect(callFunction('newRoute')).to.eq('renderJson response');
			expect(stubs.renderJsonModule.renderJson.calledOnce).to.be.true;
			expect(stubs.renderJsonModule.renderJson.calledWithExactly(stubs.res, stubs.models.Theatre())).to.be.true;

		});

	});

	describe('createRoute function', () => {

		it('calls callInstanceMethod module', async () => {

			const result = await callFunction('createRoute');
			expect(stubs.callClassMethodsModule.callInstanceMethod.calledOnce).to.be.true;
			expect(stubs.callClassMethodsModule.callInstanceMethod.calledWithExactly(
				stubs.res, stubs.next, stubs.models.Theatre(), 'create'
			)).to.be.true;
			expect(result).to.eq('callInstanceMethod response');

		});

	});

	describe('editRoute function', () => {

		it('calls callInstanceMethod module', async () => {

			const result = await callFunction('editRoute');
			expect(stubs.callClassMethodsModule.callInstanceMethod.calledOnce).to.be.true;
			expect(stubs.callClassMethodsModule.callInstanceMethod.calledWithExactly(
				stubs.res, stubs.next, stubs.models.Theatre(), 'edit'
			)).to.be.true;
			expect(result).to.eq('callInstanceMethod response');

		});

	});

	describe('updateRoute function', () => {

		it('calls callInstanceMethod module', async () => {

			const result = await callFunction('updateRoute');
			expect(stubs.callClassMethodsModule.callInstanceMethod.calledOnce).to.be.true;
			expect(stubs.callClassMethodsModule.callInstanceMethod.calledWithExactly(
				stubs.res, stubs.next, stubs.models.Theatre(), 'update'
			)).to.be.true;
			expect(result).to.eq('callInstanceMethod response');

		});

	});

	describe('deleteRoute function', () => {

		it('calls callInstanceMethod module', async () => {

			const result = await callFunction('deleteRoute');
			expect(stubs.callClassMethodsModule.callInstanceMethod.calledOnce).to.be.true;
			expect(stubs.callClassMethodsModule.callInstanceMethod.calledWithExactly(
				stubs.res, stubs.next, stubs.models.Theatre(), 'delete'
			)).to.be.true;
			expect(result).to.eq('callInstanceMethod response');

		});

	});

	describe('showRoute function', () => {

		it('calls callInstanceMethod module', async () => {

			const result = await callFunction('showRoute');
			expect(stubs.callClassMethodsModule.callInstanceMethod.calledOnce).to.be.true;
			expect(stubs.callClassMethodsModule.callInstanceMethod.calledWithExactly(
				stubs.res, stubs.next, stubs.models.Theatre(), 'show'
			)).to.be.true;
			expect(result).to.eq('callInstanceMethod response');

		});

	});

	describe('listRoute function', () => {

		it('calls callStaticListMethod module', async () => {

			const result = await callFunction('listRoute');
			expect(stubs.callClassMethodsModule.callStaticListMethod.calledOnce).to.be.true;
			expect(stubs.callClassMethodsModule.callStaticListMethod.calledWithExactly(
				stubs.res, stubs.next, stubs.models.Theatre, 'theatre'
			)).to.be.true;
			expect(result).to.eq('callStaticListMethod response');

		});

	});

});
