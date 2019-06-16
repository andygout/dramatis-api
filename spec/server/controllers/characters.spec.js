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

		it('will call callInstanceMethod module', async () => {

			method = 'create';
			const result = await createInstance(method);
			expect(stubs.callClassMethods.callInstanceMethod.calledOnce).to.be.true;
			expect(stubs.callClassMethods.callInstanceMethod.calledWithExactly(
				stubs.res, stubs.next, stubs.Character(), method
			)).to.be.true;
			expect(result).to.eq('callInstanceMethod response');

		});

	});

	describe('edit method', () => {

		it('will call callInstanceMethod module', async () => {

			method = 'edit';
			const result = await createInstance(method);
			expect(stubs.callClassMethods.callInstanceMethod.calledOnce).to.be.true;
			expect(stubs.callClassMethods.callInstanceMethod.calledWithExactly(
				stubs.res, stubs.next, stubs.Character(), method
			)).to.be.true;
			expect(result).to.eq('callInstanceMethod response');

		});

	});

	describe('update method', () => {

		it('will call callInstanceMethod module', async () => {

			method = 'update';
			const result = await createInstance(method);
			expect(stubs.callClassMethods.callInstanceMethod.calledOnce).to.be.true;
			expect(stubs.callClassMethods.callInstanceMethod.calledWithExactly(
				stubs.res, stubs.next, stubs.Character(), method
			)).to.be.true;
			expect(result).to.eq('callInstanceMethod response');

		});

	});

	describe('delete method', () => {

		it('will call callInstanceMethod module', async () => {

			method = 'delete';
			const result = await createInstance(method);
			expect(stubs.callClassMethods.callInstanceMethod.calledOnce).to.be.true;
			expect(stubs.callClassMethods.callInstanceMethod.calledWithExactly(
				stubs.res, stubs.next, stubs.Character(), method
			)).to.be.true;
			expect(result).to.eq('callInstanceMethod response');

		});

	});

	describe('show method', () => {

		it('will call callInstanceMethod module', async () => {

			method = 'show';
			const result = await createInstance(method);
			expect(stubs.callClassMethods.callInstanceMethod.calledOnce).to.be.true;
			expect(stubs.callClassMethods.callInstanceMethod.calledWithExactly(
				stubs.res, stubs.next, stubs.Character(), method
			)).to.be.true;
			expect(result).to.eq('callInstanceMethod response');

		});

	});

	describe('list method', () => {

		it('will call callStaticListMethod module', async () => {

			method = 'list';
			const result = await createInstance(method);
			expect(stubs.callClassMethods.callStaticListMethod.calledOnce).to.be.true;
			expect(stubs.callClassMethods.callStaticListMethod.calledWithExactly(
				stubs.res, stubs.next, stubs.Character, 'character'
			)).to.be.true;
			expect(result).to.eq('callStaticListMethod response');

		});

	});

});
