import { expect } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

import Character from '../../../server/models/character';

let stubs;
let method;

const CharacterStub = function () {

	return sinon.createStubInstance(Character);

};

beforeEach(() => {

	stubs = {
		callClassMethods: {
			callInstanceMethod: sinon.stub().resolves('callInstanceMethod response'),
			callStaticListMethod: sinon.stub().resolves('callStaticListMethod response')
		},
		renderJson: sinon.stub().returns('renderJson response'),
		Character: CharacterStub,
		req: sinon.stub(),
		res: sinon.stub(),
		next: sinon.stub()
	};

});

const createSubject = () =>
	proxyquire('../../../server/controllers/characters', {
		'../lib/call-class-methods': stubs.callClassMethods,
		'../lib/render-json': stubs.renderJson,
		'../models/character': stubs.Character
	});

const createInstance = method => {

	const subject = createSubject();

	const controllerFunction = `${method}Route`;

	return subject[controllerFunction](stubs.req, stubs.res, stubs.next);

};

describe('Characters controller', () => {

	describe('new method', () => {

		it('will call renderJson module', () => {

			method = 'new';
			expect(createInstance(method)).to.eq('renderJson response');
			expect(stubs.renderJson.calledOnce).to.be.true;
			expect(stubs.renderJson.calledWithExactly(stubs.res, stubs.Character())).to.be.true;

		});

	});

	describe('create method', () => {

		it('will call callInstanceMethod module', done => {

			method = 'create';
			createInstance(method).then(result => {
				expect(stubs.callClassMethods.callInstanceMethod.calledOnce).to.be.true;
				expect(stubs.callClassMethods.callInstanceMethod.calledWithExactly(
					stubs.res, stubs.next, stubs.Character(), method
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
					stubs.res, stubs.next, stubs.Character(), method
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
					stubs.res, stubs.next, stubs.Character(), method
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
					stubs.res, stubs.next, stubs.Character(), method
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
					stubs.res, stubs.next, stubs.Character(), method
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
					stubs.res, stubs.next, stubs.Character, 'character'
				)).to.be.true;
				expect(result).to.eq('callStaticListMethod response');
				done();
			});

		});

	});

});
