import { expect } from 'chai';
import httpMocks from 'node-mocks-http';
import { createSandbox } from 'sinon';

import * as callClassMethods from '../../../src/lib/call-class-methods';
import * as sendJsonResponseModule from '../../../src/lib/send-json-response';
import { Character } from '../../../src/models';

describe('Call Class Methods module', () => {

	let stubs;

	const error = new Error('errorText');
	const notFoundError = new Error('Not Found');

	const sandbox = createSandbox();

	beforeEach(() => {

		stubs = {
			sendJsonResponse:
				sandbox.stub(sendJsonResponseModule, 'sendJsonResponse').returns('sendJsonResponse response'),
			response: httpMocks.createResponse(),
			next: sandbox.stub()
		};

	});

	afterEach(() => {

		sandbox.restore();

	});

	describe('callInstanceMethod function', () => {

		let character;
		const method = 'edit';

		beforeEach(() => {

			character = new Character;

		});

		context('resolves with data', () => {

			it('calls renderPage module', async () => {

				const instanceMethodResponse = { property: 'value' };
				sandbox.stub(character, method).callsFake(() => { return Promise.resolve(instanceMethodResponse) });
				const result = await callClassMethods.callInstanceMethod(stubs.response, stubs.next, character, method);
				expect(stubs.sendJsonResponse.calledOnce).to.be.true;
				expect(stubs.sendJsonResponse.calledWithExactly(stubs.response, instanceMethodResponse)).to.be.true;
				expect(stubs.next.notCalled).to.be.true;
				expect(result).to.equal('sendJsonResponse response');

			});

		});

		context('resolves with error', () => {

			it('calls next() with error', async () => {

				sandbox.stub(character, method).callsFake(() => { return Promise.reject(error) });
				await callClassMethods.callInstanceMethod(stubs.response, stubs.next, character, method);
				expect(stubs.next.calledOnce).to.be.true;
				expect(stubs.next.calledWithExactly(error)).to.be.true;
				expect(stubs.sendJsonResponse.notCalled).to.be.true;

			});

		});

		context('resolves with \'Not Found\' error', () => {

			it('responds with 404 status and sends error message', async () => {

				sandbox.stub(character, method).callsFake(() => { return Promise.reject(notFoundError) });
				await callClassMethods.callInstanceMethod(stubs.response, stubs.next, character, method);
				expect(stubs.response.statusCode).to.equal(404);
				expect(stubs.response._getData()).to.equal('Not Found');
				expect(stubs.sendJsonResponse.notCalled).to.be.true;
				expect(stubs.next.called).to.be.false;

			});

		});

	});

	describe('callStaticListMethod function', () => {

		const method = 'list';

		afterEach(() => {

			Character[method].restore();

		});

		context('resolves with data', () => {

			it('calls renderPage module', async () => {

				const staticListMethodResponse = [{ property: 'value' }];
				sandbox.stub(Character, method).callsFake(() => { return Promise.resolve(staticListMethodResponse) });
				const result =
					await callClassMethods.callStaticListMethod(stubs.response, stubs.next, Character, 'character');
				expect(stubs.sendJsonResponse.calledOnce).to.be.true;
				expect(stubs.sendJsonResponse.calledWithExactly(
					stubs.response, staticListMethodResponse
				)).to.be.true;
				expect(stubs.next.notCalled).to.be.true;
				expect(result).to.equal('sendJsonResponse response');

			});

		});

		context('resolves with error', () => {

			it('calls next() with error', async () => {

				sandbox.stub(Character, method).callsFake(() => { return Promise.reject(error) });
				await callClassMethods.callStaticListMethod(stubs.response, stubs.next, Character, 'character');
				expect(stubs.next.calledOnce).to.be.true;
				expect(stubs.next.calledWithExactly(error)).to.be.true;
				expect(stubs.sendJsonResponse.notCalled).to.be.true;

			});

		});

	});

});
