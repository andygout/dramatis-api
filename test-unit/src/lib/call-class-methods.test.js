import { expect } from 'chai';
import httpMocks from 'node-mocks-http';
import { assert, createSandbox } from 'sinon';

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
				sandbox.stub(character, method).callsFake(() => { return Promise.resolve(instanceMethodResponse); });
				const result = await callClassMethods.callInstanceMethod(stubs.response, stubs.next, character, method);
				assert.calledOnce(stubs.sendJsonResponse);
				assert.calledWithExactly(stubs.sendJsonResponse, stubs.response, instanceMethodResponse);
				assert.notCalled(stubs.next);
				expect(result).to.equal('sendJsonResponse response');

			});

		});

		context('resolves with error', () => {

			it('calls next() with error', async () => {

				sandbox.stub(character, method).callsFake(() => { return Promise.reject(error); });
				await callClassMethods.callInstanceMethod(stubs.response, stubs.next, character, method);
				assert.calledOnce(stubs.next);
				assert.calledWithExactly(stubs.next, error);
				assert.notCalled(stubs.sendJsonResponse);

			});

		});

		context('resolves with \'Not Found\' error', () => {

			it('responds with 404 status and sends error message', async () => {

				sandbox.stub(character, method).callsFake(() => { return Promise.reject(notFoundError); });
				await callClassMethods.callInstanceMethod(stubs.response, stubs.next, character, method);
				expect(stubs.response.statusCode).to.equal(404);
				expect(stubs.response._getData()).to.equal('Not Found'); // eslint-disable-line no-underscore-dangle
				assert.notCalled(stubs.sendJsonResponse);
				assert.notCalled(stubs.next);

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
				sandbox.stub(Character, method).callsFake(() => { return Promise.resolve(staticListMethodResponse); });
				const result =
					await callClassMethods.callStaticListMethod(stubs.response, stubs.next, Character, 'character');
				assert.calledOnce(stubs.sendJsonResponse);
				assert.calledWithExactly(
					stubs.sendJsonResponse,
					stubs.response, staticListMethodResponse
				);
				assert.notCalled(stubs.next);
				expect(result).to.equal('sendJsonResponse response');

			});

		});

		context('resolves with error', () => {

			it('calls next() with error', async () => {

				sandbox.stub(Character, method).callsFake(() => { return Promise.reject(error); });
				await callClassMethods.callStaticListMethod(stubs.response, stubs.next, Character, 'character');
				assert.calledOnce(stubs.next);
				assert.calledWithExactly(stubs.next, error);
				assert.notCalled(stubs.sendJsonResponse);

			});

		});

	});

});
