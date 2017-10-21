const expect = require('chai').expect;
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const Character = require('../../../dist/models/character');

const err = new Error('errorText');

let stubs;
let method;
let character;

beforeEach(() => {

	stubs = {
		renderJson: sinon.stub().returns('renderJson response'),
		res: sinon.stub(),
		next: sinon.stub()
	};

});

const createSubject = () =>
	proxyquire('../../../dist/lib/call-class-methods', {
		'./render-json': stubs.renderJson
	});

describe('Call Class Methods module', () => {

	describe('callInstanceMethod function', () => {

		beforeEach(() => {

			method = 'edit';
			character = new Character;

		});

		context('resolves with data', () => {

			it('will call renderPage module', done => {

				const subject = createSubject();
				const instanceMethodResponse = { instance: { property: 'value' } };
				sinon.stub(character, method).callsFake(() => { return Promise.resolve(instanceMethodResponse) });
				subject.callInstanceMethod(stubs.res, stubs.next, character, method).then(result => {
					expect(stubs.renderJson.calledOnce).to.be.true;
					expect(stubs.renderJson.calledWithExactly(stubs.res, instanceMethodResponse.instance)).to.be.true;
					expect(stubs.next.notCalled).to.be.true;
					expect(result).to.eq('renderJson response');
					done();
				});

			});

		});

		context('resolves with error', () => {

			it('will call next() with error', done => {

				const subject = createSubject();
				sinon.stub(character, method).callsFake(() => { return Promise.reject(err) });
				subject.callInstanceMethod(stubs.res, stubs.next, character, method).then(() => {
					expect(stubs.next.calledOnce).to.be.true;
					expect(stubs.next.calledWithExactly(err)).to.be.true;
					expect(stubs.renderJson.notCalled).to.be.true;
					done();
				});

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

			it('will call renderPage module', done => {

				const subject = createSubject();
				const staticListMethodResponse = { instances: [{ property: 'value' }] };
				sinon.stub(Character, method).callsFake(() => { return Promise.resolve(staticListMethodResponse) });
				subject.callStaticListMethod(stubs.res, stubs.next, Character, 'character').then(result => {
					expect(stubs.renderJson.calledOnce).to.be.true;
					expect(stubs.renderJson.calledWithExactly(
						stubs.res, staticListMethodResponse.instances
					)).to.be.true;
					expect(stubs.next.notCalled).to.be.true;
					expect(result).to.eq('renderJson response');
					done();
				});

			});

		});

		context('resolves with error', () => {

			it('will call next() with error', done => {

				const subject = createSubject();
				sinon.stub(Character, method).callsFake(() => { return Promise.reject(err) });
				subject.callStaticListMethod(stubs.res, stubs.next, Character, 'character').then(() => {
					expect(stubs.next.calledOnce).to.be.true;
					expect(stubs.next.calledWithExactly(err)).to.be.true;
					expect(stubs.renderJson.notCalled).to.be.true;
					done();
				});

			});

		});

	});

});
