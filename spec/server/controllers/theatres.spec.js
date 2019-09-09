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
			Theatre: TheatreStub,
			req: sinon.stub(),
			res: sinon.stub(),
			next: sinon.stub()
		};

	});

	const createSubject = () =>
		proxyquire('../../../server/controllers/theatres', {
			'../lib/call-class-methods': stubs.callClassMethodsModule,
			'../lib/render-json': stubs.renderJsonModule,
			'../models/theatre': stubs.Theatre
		});

	const createInstance = method => {

		const subject = createSubject();

		const controllerFunction = `${method}Route`;

		return subject[controllerFunction](stubs.req, stubs.res, stubs.next);

	};

	describe('new method', () => {

		const method = 'new';

		it('calls renderJson module', () => {

			expect(createInstance(method)).to.eq('renderJson response');
			expect(stubs.renderJsonModule.renderJson.calledOnce).to.be.true;
			expect(stubs.renderJsonModule.renderJson.calledWithExactly(stubs.res, stubs.Theatre())).to.be.true;

		});

	});

	describe('create method', () => {

		const method = 'create';

		it('calls callInstanceMethod module', async () => {

			const result = await createInstance(method);
			expect(stubs.callClassMethodsModule.callInstanceMethod.calledOnce).to.be.true;
			expect(stubs.callClassMethodsModule.callInstanceMethod.calledWithExactly(
				stubs.res, stubs.next, stubs.Theatre(), method
			)).to.be.true;
			expect(result).to.eq('callInstanceMethod response');

		});

	});

	describe('edit method', () => {

		const method = 'edit';

		it('calls callInstanceMethod module', async () => {

			const result = await createInstance(method);
			expect(stubs.callClassMethodsModule.callInstanceMethod.calledOnce).to.be.true;
			expect(stubs.callClassMethodsModule.callInstanceMethod.calledWithExactly(
				stubs.res, stubs.next, stubs.Theatre(), method
			)).to.be.true;
			expect(result).to.eq('callInstanceMethod response');

		});

	});

	describe('update method', () => {

		const method = 'update';

		it('calls callInstanceMethod module', async () => {

			const result = await createInstance(method);
			expect(stubs.callClassMethodsModule.callInstanceMethod.calledOnce).to.be.true;
			expect(stubs.callClassMethodsModule.callInstanceMethod.calledWithExactly(
				stubs.res, stubs.next, stubs.Theatre(), method
			)).to.be.true;
			expect(result).to.eq('callInstanceMethod response');

		});

	});

	describe('delete method', () => {

		const method = 'delete';

		it('calls callInstanceMethod module', async () => {

			const result = await createInstance(method);
			expect(stubs.callClassMethodsModule.callInstanceMethod.calledOnce).to.be.true;
			expect(stubs.callClassMethodsModule.callInstanceMethod.calledWithExactly(
				stubs.res, stubs.next, stubs.Theatre(), method
			)).to.be.true;
			expect(result).to.eq('callInstanceMethod response');

		});

	});

	describe('show method', () => {

		const method = 'show';

		it('calls callInstanceMethod module', async () => {

			const result = await createInstance(method);
			expect(stubs.callClassMethodsModule.callInstanceMethod.calledOnce).to.be.true;
			expect(stubs.callClassMethodsModule.callInstanceMethod.calledWithExactly(
				stubs.res, stubs.next, stubs.Theatre(), method
			)).to.be.true;
			expect(result).to.eq('callInstanceMethod response');

		});

	});

	describe('list method', () => {

		const method = 'list';

		it('calls callStaticListMethod module', async () => {

			const result = await createInstance(method);
			expect(stubs.callClassMethodsModule.callStaticListMethod.calledOnce).to.be.true;
			expect(stubs.callClassMethodsModule.callStaticListMethod.calledWithExactly(
				stubs.res, stubs.next, stubs.Theatre, 'theatre'
			)).to.be.true;
			expect(result).to.eq('callStaticListMethod response');

		});

	});

});
