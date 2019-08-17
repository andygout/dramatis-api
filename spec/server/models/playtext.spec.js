import { expect } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

import Character from '../../../server/models/character';

import neo4jQueryFixture from '../../fixtures/neo4j-query';

let stubs;
let instance;

const CharacterStub = function () {

	this.validate = sinon.stub();

};

beforeEach(() => {

	stubs = {
		neo4jQuery: sinon.stub().resolves(neo4jQueryFixture),
		prepareAsParams: sinon.stub().returns('prepareAsParams response'),
		verifyErrorPresence: sinon.stub().returns(false),
		Base: {
			cypherQueriesShared: {
				getValidateQuery: sinon.stub().returns('getValidateQuery response')
			},
			neo4jQuery: sinon.stub().resolves(neo4jQueryFixture),
			trimStrings: sinon.stub(),
			validateString: sinon.stub().returns([])
		},
		Character: CharacterStub
	};

	instance = createInstance();

});

const createSubject = (stubOverrides = {}) =>
	proxyquire('../../../server/models/playtext', {
		'../lib/prepare-as-params': stubs.prepareAsParams,
		'../lib/verify-error-presence': stubOverrides.verifyErrorPresence || stubs.verifyErrorPresence,
		'../neo4j/query': stubs.neo4jQuery,
		'./base': proxyquire('../../../server/models/base', {
			'../lib/trim-strings': stubs.Base.trimStrings,
			'../lib/validate-string': stubs.Base.validateString,
			'../neo4j/cypher-queries/shared': stubs.Base.cypherQueriesShared,
			'../neo4j/query': stubs.Base.neo4jQuery
		}),
		'./character': stubOverrides.Character || stubs.Character
	});

const createInstance = (stubOverrides = {}, props = { name: 'Hamlet', characters: [{ name: 'Hamlet' }] }) => {

	const subject = createSubject(stubOverrides);

	return new subject(props);

};

describe('Playtext model', () => {

	describe('constructor method', () => {

		describe('characters property', () => {

			it('assigns empty array if not included in props', () => {

				const props = { name: 'Hamlet' };
				instance = createInstance({}, props);
				expect(instance.characters).to.deep.eq([]);

			});

			it('assigns array of characters if included in props, filtering out those with empty or whitespace-only string names', () => {

				const CharacterStubOverride = function () { return sinon.createStubInstance(Character); };
				const props = {
					name: 'Hamlet',
					characters: [
						{ name: 'Hamlet' },
						{ name: '' },
						{ name: ' ' }
					]
				};
				instance = createInstance({ Character: CharacterStubOverride }, props);
				expect(instance.characters.length).to.eq(1);
				expect(instance.characters[0].constructor.name).to.eq('Character');

			});

		});

	});

	describe('setErrorStatus method', () => {

		it('calls instance validate method and associated models\' validate methods then verifyErrorPresence', () => {

			sinon.spy(instance, 'validate');
			instance.setErrorStatus();
			sinon.assert.callOrder(
				instance.validate.withArgs({ required: true }),
				instance.characters[0].validate.withArgs(),
				stubs.verifyErrorPresence.withArgs(instance)
			);
			expect(instance.validate.calledOnce).to.be.true;
			expect(instance.characters[0].validate.calledOnce).to.be.true;
			expect(stubs.verifyErrorPresence.calledOnce).to.be.true;

		});

		context('valid data', () => {

			it('sets instance hasError property to false and returns same value', () => {

				expect(instance.setErrorStatus()).to.be.false;
				expect(instance.hasError).to.be.false;

			});

		});

		context('invalid data', () => {

			it('sets instance hasError property to true and returns same value', () => {

				instance = createInstance({ verifyErrorPresence: sinon.stub().returns(true) });
				expect(instance.setErrorStatus()).to.be.true;
				expect(instance.hasError).to.be.true;

			});

		});

	});

	describe('createUpdate method', () => {

		context('valid data', () => {

			it('creates using provided function to get appropriate query', async () => {

				const getCreateQueryStub = sinon.stub().returns('getCreateQuery response');
				sinon.spy(instance, 'setErrorStatus');
				sinon.spy(instance, 'validateInDb');
				const result = await instance.createUpdate(getCreateQueryStub);
				sinon.assert.callOrder(
					instance.setErrorStatus.withArgs(),
					instance.validateInDb.withArgs(),
					stubs.verifyErrorPresence.withArgs(instance),
					getCreateQueryStub.withArgs(),
					stubs.prepareAsParams.withArgs(instance),
					stubs.neo4jQuery.withArgs({ query: 'getCreateQuery response', params: 'prepareAsParams response' })
				);
				expect(instance.setErrorStatus.calledOnce).to.be.true;
				expect(instance.validateInDb.calledOnce).to.be.true;
				expect(stubs.verifyErrorPresence.calledTwice).to.be.true;
				expect(getCreateQueryStub.calledOnce).to.be.true;
				expect(stubs.prepareAsParams.calledOnce).to.be.true;
				expect(stubs.neo4jQuery.calledOnce).to.be.true;
				expect(result).to.deep.eq(neo4jQueryFixture);

			});

			it('updates using provided function to get appropriate query', async () => {

				const getUpdateQueryStub = sinon.stub().returns('getUpdateQuery response');
				sinon.spy(instance, 'setErrorStatus');
				sinon.spy(instance, 'validateInDb');
				const result = await instance.createUpdate(getUpdateQueryStub);
				sinon.assert.callOrder(
					instance.setErrorStatus.withArgs(),
					instance.validateInDb.withArgs(),
					stubs.verifyErrorPresence.withArgs(instance),
					getUpdateQueryStub.withArgs(),
					stubs.prepareAsParams.withArgs(instance),
					stubs.neo4jQuery.withArgs({ query: 'getUpdateQuery response', params: 'prepareAsParams response' })
				);
				expect(instance.setErrorStatus.calledOnce).to.be.true;
				expect(instance.validateInDb.calledOnce).to.be.true;
				expect(stubs.verifyErrorPresence.calledTwice).to.be.true;
				expect(getUpdateQueryStub.calledOnce).to.be.true;
				expect(stubs.prepareAsParams.calledOnce).to.be.true;
				expect(stubs.neo4jQuery.calledOnce).to.be.true;
				expect(result).to.deep.eq(neo4jQueryFixture);

			});

		});

		context('invalid data', () => {

			context('initial validation errors caused by submitted values', () => {

				it('returns instance without creating', async () => {

					const verifyErrorPresenceStub = sinon.stub().returns(true);
					const getCreateUpdateQueryStub = sinon.stub();
					instance = createInstance({ verifyErrorPresence: verifyErrorPresenceStub });
					sinon.spy(instance, 'setErrorStatus');
					sinon.spy(instance, 'validateInDb');
					const result = await instance.createUpdate(getCreateUpdateQueryStub);
					expect(instance.setErrorStatus.calledOnce).to.be.true;
					expect(verifyErrorPresenceStub.calledOnce).to.be.true;
					expect(instance.validateInDb.notCalled).to.be.true;
					expect(getCreateUpdateQueryStub.notCalled).to.be.true;
					expect(stubs.prepareAsParams.notCalled).to.be.true;
					expect(stubs.neo4jQuery.notCalled).to.be.true;
					expect(result).to.deep.eq(instance);

				});

			});

			context('secondary validation errors caused by database checks', () => {

				it('returns instance without creating', async () => {

					const verifyErrorPresenceStub = sinon.stub();
					verifyErrorPresenceStub.onFirstCall().returns(false).onSecondCall().returns(true);
					const getCreateUpdateQueryStub = sinon.stub();
					instance = createInstance({ verifyErrorPresence: verifyErrorPresenceStub });
					sinon.spy(instance, 'setErrorStatus');
					sinon.spy(instance, 'validateInDb');
					const result = await instance.createUpdate(getCreateUpdateQueryStub);
					sinon.assert.callOrder(
						instance.setErrorStatus.withArgs(),
						instance.validateInDb.withArgs(),
						verifyErrorPresenceStub.withArgs(instance)
					);
					expect(instance.setErrorStatus.calledOnce).to.be.true;
					expect(instance.validateInDb.calledOnce).to.be.true;
					expect(verifyErrorPresenceStub.calledTwice).to.be.true;
					expect(getCreateUpdateQueryStub.notCalled).to.be.true;
					expect(stubs.prepareAsParams.notCalled).to.be.true;
					expect(stubs.neo4jQuery.notCalled).to.be.true;
					expect(result).to.deep.eq(instance);

				});

			});

		});

	});

});
