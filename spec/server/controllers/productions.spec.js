import { expect } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

import Production from '../../../server/models/production';

const sandbox = sinon.sandbox.create();

let stubs;
let method;

const ProductionStub = function () {

	return sinon.createStubInstance(Production);

};

beforeEach(() => {

	stubs = {
		callClassMethods: {
			callInstanceMethod: sandbox.stub().resolves('callInstanceMethod response'),
			callStaticListMethod: sandbox.stub().resolves('callStaticListMethod response')
		},
		renderJson: sandbox.stub().returns('renderJson response'),
		Production: ProductionStub,
		req: sandbox.stub(),
		res: sandbox.stub(),
		next: sandbox.stub()
	};

});

afterEach(() => {

	sandbox.restore();

});

const createSubject = stubOverrides =>
	proxyquire('../../../server/controllers/productions', {
		'../lib/call-class-methods': stubs.callClassMethods,
		'../lib/render-json': stubs.renderJson,
		'../models/production': stubs.Production
	});

const createInstance = (method, methodStub) => {

	const subject = createSubject();

	const controllerFunction = `${method}Route`;

	return subject[controllerFunction](stubs.req, stubs.res, stubs.next);

};

describe('Productions controller', () => {

	describe('new method', () => {

		it('will call renderJson module', () => {

			method = 'new';
			expect(createInstance(method)).to.eq('renderJson response');
			expect(stubs.renderJson.calledOnce).to.be.true;
			expect(stubs.renderJson.calledWithExactly(stubs.res, stubs.Production())).to.be.true;

		});

	});

	describe('create method', () => {

		it('will call callInstanceMethod module', done => {

			method = 'create';
			createInstance(method).then(result => {
				expect(stubs.callClassMethods.callInstanceMethod.calledOnce).to.be.true;
				expect(stubs.callClassMethods.callInstanceMethod.calledWithExactly(
					stubs.res, stubs.next, stubs.Production(), method
				)).to.be.true;
				expect(result).to.eq('callInstanceMethod response');
				done();
			});

		});

	});

	describe('edit method', () => {

		it('will call callInstanceMethod module', done => {

			method = 'edit';
			createInstance(method).then(result => {
				expect(stubs.callClassMethods.callInstanceMethod.calledOnce).to.be.true;
				expect(stubs.callClassMethods.callInstanceMethod.calledWithExactly(
					stubs.res, stubs.next, stubs.Production(), method
				)).to.be.true;
				expect(result).to.eq('callInstanceMethod response');
				done();
			});

		});

	});

	describe('update method', () => {

		it('will call callInstanceMethod module', done => {

			method = 'update';
			createInstance(method).then(result => {
				expect(stubs.callClassMethods.callInstanceMethod.calledOnce).to.be.true;
				expect(stubs.callClassMethods.callInstanceMethod.calledWithExactly(
					stubs.res, stubs.next, stubs.Production(), method
				)).to.be.true;
				expect(result).to.eq('callInstanceMethod response');
				done();
			});

		});

	});

	describe('delete method', () => {

		it('will call callInstanceMethod module', done => {

			method = 'delete';
			createInstance(method).then(result => {
				expect(stubs.callClassMethods.callInstanceMethod.calledOnce).to.be.true;
				expect(stubs.callClassMethods.callInstanceMethod.calledWithExactly(
					stubs.res, stubs.next, stubs.Production(), method
				)).to.be.true;
				expect(result).to.eq('callInstanceMethod response');
				done();
			});

		});

	});

	describe('show method', () => {

		it('will call callInstanceMethod module', done => {

			method = 'show';
			createInstance(method).then(result => {
				expect(stubs.callClassMethods.callInstanceMethod.calledOnce).to.be.true;
				expect(stubs.callClassMethods.callInstanceMethod.calledWithExactly(
					stubs.res, stubs.next, stubs.Production(), method
				)).to.be.true;
				expect(result).to.eq('callInstanceMethod response');
				done();
			});

		});

	});

	describe('list method', () => {

		it('will call callStaticListMethod module', done => {

			method = 'list';
			createInstance(method).then(result => {
				expect(stubs.callClassMethods.callStaticListMethod.calledOnce).to.be.true;
				expect(stubs.callClassMethods.callStaticListMethod.calledWithExactly(
					stubs.res, stubs.next, stubs.Production
				)).to.be.true;
				expect(result).to.eq('callStaticListMethod response');
				done();
			});

		});

	});

});
