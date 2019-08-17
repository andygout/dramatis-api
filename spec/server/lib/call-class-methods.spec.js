import { expect } from 'chai';
import httpMocks from 'node-mocks-http';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

import Character from '../../../server/models/character';

const err = new Error('errorText');
const notFoundErr = new Error('Not Found');

let stubs;
let method;
let character;

beforeEach(() => {

	stubs = {
		renderJson: sinon.stub().returns('renderJson response'),
		res: httpMocks.createResponse(),
		next: sinon.stub()
	};

});

const createSubject = () =>
	proxyquire('../../../server/lib/call-class-methods', {
		'./render-json': stubs.renderJson
	});

describe('Call Class Methods module', () => {

	describe('callInstanceMethod function', () => {

		beforeEach(() => {

			method = 'edit';
			character = new Character;

		});

		context('resolves with data', () => {

			it('calls renderPage module', async () => {

				const subject = createSubject();
				const instanceMethodResponse = { property: 'value' };
				sinon.stub(character, method).callsFake(() => { return Promise.resolve(instanceMethodResponse) });
				const result = await subject.callInstanceMethod(stubs.res, stubs.next, character, method);
				expect(stubs.renderJson.calledOnce).to.be.true;
				expect(stubs.renderJson.calledWithExactly(stubs.res, instanceMethodResponse)).to.be.true;
				expect(stubs.next.notCalled).to.be.true;
				expect(result).to.eq('renderJson response');

			});

		});

		context('resolves with error', () => {

			it('calls next() with error', async () => {

				const subject = createSubject();
				sinon.stub(character, method).callsFake(() => { return Promise.reject(err) });
				await subject.callInstanceMethod(stubs.res, stubs.next, character, method);
				expect(stubs.next.calledOnce).to.be.true;
				expect(stubs.next.calledWithExactly(err)).to.be.true;
				expect(stubs.renderJson.notCalled).to.be.true;

			});

		});

		context('resolves with \'Not Found\' error', () => {

			it('responds with 404 status and sends error message', async () => {

				const subject = createSubject();
				sinon.stub(character, method).callsFake(() => { return Promise.reject(notFoundErr) });
				await subject.callInstanceMethod(stubs.res, stubs.next, character, method);
				expect(stubs.res.statusCode).to.eq(404);
				expect(stubs.res._getData()).to.eq('Not Found');
				expect(stubs.renderJson.notCalled).to.be.true;
				expect(stubs.next.called).to.be.false;

			});

		});

	});

	describe('callStaticListMethod function', () => {

		beforeEach(() => {

			method = 'list';

		});

		afterEach(() => {

			Character[method].restore();

		});

		context('resolves with data', () => {

			it('calls renderPage module', async () => {

				const subject = createSubject();
				const staticListMethodResponse = [{ property: 'value' }];
				sinon.stub(Character, method).callsFake(() => { return Promise.resolve(staticListMethodResponse) });
				const result = await subject.callStaticListMethod(stubs.res, stubs.next, Character, 'character');
				expect(stubs.renderJson.calledOnce).to.be.true;
				expect(stubs.renderJson.calledWithExactly(
					stubs.res, staticListMethodResponse
				)).to.be.true;
				expect(stubs.next.notCalled).to.be.true;
				expect(result).to.eq('renderJson response');

			});

		});

		context('resolves with error', () => {

			it('calls next() with error', async () => {

				const subject = createSubject();
				sinon.stub(Character, method).callsFake(() => { return Promise.reject(err) });
				await subject.callStaticListMethod(stubs.res, stubs.next, Character, 'character');
				expect(stubs.next.calledOnce).to.be.true;
				expect(stubs.next.calledWithExactly(err)).to.be.true;
				expect(stubs.renderJson.notCalled).to.be.true;

			});

		});

	});

});
