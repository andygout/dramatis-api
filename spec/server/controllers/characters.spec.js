import { expect } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

import Character from '../../../server/models/character';

describe('Characters controller', () => {

	let stubs;

	const CharacterStub = function () {

		return sinon.createStubInstance(Character);

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
			Character: CharacterStub,
			req: sinon.stub(),
			res: sinon.stub(),
			next: sinon.stub()
		};

	});

	const createSubject = () =>
		proxyquire('../../../server/controllers/characters', {
			'../lib/call-class-methods': stubs.callClassMethodsModule,
			'../lib/render-json': stubs.renderJsonModule,
			'../models/character': stubs.Character
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
			expect(stubs.renderJsonModule.renderJson.calledWithExactly(stubs.res, stubs.Character())).to.be.true;

		});

	});

	describe('create method', () => {

		const method = 'create';

		it('calls callInstanceMethod module', async () => {

			const result = await createInstance(method);
			expect(stubs.callClassMethodsModule.callInstanceMethod.calledOnce).to.be.true;
			expect(stubs.callClassMethodsModule.callInstanceMethod.calledWithExactly(
				stubs.res, stubs.next, stubs.Character(), method
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
				stubs.res, stubs.next, stubs.Character(), method
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
				stubs.res, stubs.next, stubs.Character(), method
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
				stubs.res, stubs.next, stubs.Character(), method
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
				stubs.res, stubs.next, stubs.Character(), method
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
				stubs.res, stubs.next, stubs.Character, 'character'
			)).to.be.true;
			expect(result).to.eq('callStaticListMethod response');

		});

	});

});
