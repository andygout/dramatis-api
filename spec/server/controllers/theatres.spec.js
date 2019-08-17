import { expect } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

import Theatre from '../../../server/models/theatre';

let stubs;
let method;

const TheatreStub = function () {

	return sinon.createStubInstance(Theatre);

};

beforeEach(() => {

	stubs = {
		callClassMethods: {
			callInstanceMethod: sinon.stub().resolves('callInstanceMethod response'),
			callStaticListMethod: sinon.stub().resolves('callStaticListMethod response')
		},
		renderJson: sinon.stub().returns('renderJson response'),
		Theatre: TheatreStub,
		req: sinon.stub(),
		res: sinon.stub(),
		next: sinon.stub()
	};

});

const createSubject = () =>
	proxyquire('../../../server/controllers/theatres', {
		'../lib/call-class-methods': stubs.callClassMethods,
		'../lib/render-json': stubs.renderJson,
		'../models/theatre': stubs.Theatre
	});

const createInstance = method => {

	const subject = createSubject();

	const controllerFunction = `${method}Route`;

	return subject[controllerFunction](stubs.req, stubs.res, stubs.next);

};

describe('Theatres controller', () => {

	describe('new method', () => {

		it('calls renderJson module', () => {

			method = 'new';
			expect(createInstance(method)).to.eq('renderJson response');
			expect(stubs.renderJson.calledOnce).to.be.true;
			expect(stubs.renderJson.calledWithExactly(stubs.res, stubs.Theatre())).to.be.true;

		});

	});

	describe('create method', () => {

		it('calls callInstanceMethod module', async () => {

			method = 'create';
			const result = await createInstance(method);
			expect(stubs.callClassMethods.callInstanceMethod.calledOnce).to.be.true;
			expect(stubs.callClassMethods.callInstanceMethod.calledWithExactly(
				stubs.res, stubs.next, stubs.Theatre(), method
			)).to.be.true;
			expect(result).to.eq('callInstanceMethod response');

		});

	});

	describe('edit method', () => {

		it('calls callInstanceMethod module', async () => {

			method = 'edit';
			const result = await createInstance(method);
			expect(stubs.callClassMethods.callInstanceMethod.calledOnce).to.be.true;
			expect(stubs.callClassMethods.callInstanceMethod.calledWithExactly(
				stubs.res, stubs.next, stubs.Theatre(), method
			)).to.be.true;
			expect(result).to.eq('callInstanceMethod response');

		});

	});

	describe('update method', () => {

		it('calls callInstanceMethod module', async () => {

			method = 'update';
			const result = await createInstance(method);
			expect(stubs.callClassMethods.callInstanceMethod.calledOnce).to.be.true;
			expect(stubs.callClassMethods.callInstanceMethod.calledWithExactly(
				stubs.res, stubs.next, stubs.Theatre(), method
			)).to.be.true;
			expect(result).to.eq('callInstanceMethod response');

		});

	});

	describe('delete method', () => {

		it('calls callInstanceMethod module', async () => {

			method = 'delete';
			const result = await createInstance(method);
			expect(stubs.callClassMethods.callInstanceMethod.calledOnce).to.be.true;
			expect(stubs.callClassMethods.callInstanceMethod.calledWithExactly(
				stubs.res, stubs.next, stubs.Theatre(), method
			)).to.be.true;
			expect(result).to.eq('callInstanceMethod response');

		});

	});

	describe('show method', () => {

		it('calls callInstanceMethod module', async () => {

			method = 'show';
			const result = await createInstance(method);
			expect(stubs.callClassMethods.callInstanceMethod.calledOnce).to.be.true;
			expect(stubs.callClassMethods.callInstanceMethod.calledWithExactly(
				stubs.res, stubs.next, stubs.Theatre(), method
			)).to.be.true;
			expect(result).to.eq('callInstanceMethod response');

		});

	});

	describe('list method', () => {

		it('calls callStaticListMethod module', async () => {

			method = 'list';
			const result = await createInstance(method);
			expect(stubs.callClassMethods.callStaticListMethod.calledOnce).to.be.true;
			expect(stubs.callClassMethods.callStaticListMethod.calledWithExactly(
				stubs.res, stubs.next, stubs.Theatre, 'theatre'
			)).to.be.true;
			expect(result).to.eq('callStaticListMethod response');

		});

	});

});
