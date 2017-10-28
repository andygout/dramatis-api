const expect = require('chai').expect;
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const Playtext = require('../../../dist/models/playtext');

const sandbox = sinon.sandbox.create();

let stubs;
let method;

const PlaytextStub = function () {

	return sinon.createStubInstance(Playtext);

};

beforeEach(() => {

	stubs = {
		callClassMethods: {
			callInstanceMethod: sandbox.stub().resolves('callInstanceMethod response'),
			callStaticListMethod: sandbox.stub().resolves('callStaticListMethod response')
		},
		Playtext: PlaytextStub,
		req: sandbox.stub(),
		res: sandbox.stub(),
		next: sandbox.stub()
	};

});

afterEach(() => {

	sandbox.restore();

});

const createSubject = stubOverrides =>
	proxyquire('../../../dist/controllers/playtexts', {
		'../lib/call-class-methods': stubs.callClassMethods,
		'../models/playtext': stubs.Playtext
	});

const createInstance = (method, methodStub) => {

	const subject = createSubject();

	const controllerFunction = `${method}Route`;

	return subject[controllerFunction](stubs.req, stubs.res, stubs.next);

};

describe('Playtexts controller', () => {

	describe('edit method', () => {

		it('will call callInstanceMethod module', done => {

			method = 'edit';
			createInstance(method).then(result => {
				expect(stubs.callClassMethods.callInstanceMethod.calledOnce).to.be.true;
				expect(stubs.callClassMethods.callInstanceMethod.calledWithExactly(
					stubs.res, stubs.next, stubs.Playtext(), method
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
					stubs.res, stubs.next, stubs.Playtext(), method
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
					stubs.res, stubs.next, stubs.Playtext(), method
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
					stubs.res, stubs.next, stubs.Playtext(), method
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
					stubs.res, stubs.next, stubs.Playtext
				)).to.be.true;
				expect(result).to.eq('callStaticListMethod response');
				done();
			});

		});

	});

});
