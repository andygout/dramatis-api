const expect = require('chai').expect;
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const removeWhitespace = require('../../../spec-helpers').removeWhitespace;

const sandbox = sinon.sandbox.create();

let stubs;
let subject;

beforeEach(() => {

	stubs = {
		capitalise: sandbox.stub().returns('Theatre'),
		pluralise: sandbox.stub().returns('theatres')
	};

	subject = createSubject();

});

afterEach(() => {

	sandbox.restore();

});

const createSubject = (stubOverrides = {}) =>
	proxyquire('../../../../dist/database/cypher-queries/shared', {
		'../../lib/capitalise': stubOverrides.capitalise || stubs.capitalise,
		'../../lib/pluralise': stubOverrides.pluralise || stubs.pluralise
	});

describe('Cypher Queries Shared module', () => {

	context('Production model usage', () => {

		describe('getListQuery function', () => {

			it('will return requisite query', () => {

				const capitaliseStub = sinon.stub().returns('Production');
				const pluraliseStub = sinon.stub().returns('productions');
				subject = createSubject({ capitalise: capitaliseStub, pluralise: pluraliseStub });
				const result = subject.getListQuery('production');
				expect(capitaliseStub.calledOnce).to.be.true;
				expect(capitaliseStub.calledWithExactly('production')).to.be.true;
				expect(pluraliseStub.calledOnce).to.be.true;
				expect(pluraliseStub.calledWithExactly('production')).to.be.true;
				expect(removeWhitespace(result)).to.eq(removeWhitespace(`
					MATCH (n:Production)-[:PLAYS_AT]->(t:Theatre)

					RETURN COLLECT({
						model: 'production',
						uuid: n.uuid,
						name: n.name
						, theatre: { model: 'theatre', uuid: t.uuid, name: t.name }
					}) AS productions
				`));

			});

		});

	});

	context('Theatre (i.e. non-Production) model usage', () => {

		describe('getValidateUpdateQuery function', () => {

			it('will return requisite query', () => {

				const result = subject.getValidateUpdateQuery('theatre');
				expect(stubs.capitalise.calledOnce).to.be.true;
				expect(stubs.capitalise.calledWithExactly('theatre')).to.be.true;
				expect(removeWhitespace(result)).to.eq(removeWhitespace(`
					MATCH (n:Theatre { name: $name })
						WHERE n.uuid <> $uuid

					RETURN SIGN(COUNT(n)) AS instanceCount
				`));

			});

		});

		describe('getEditQuery function', () => {

			it('will return requisite query', () => {

				const result = subject.getEditQuery('theatre');
				expect(stubs.capitalise.calledOnce).to.be.true;
				expect(stubs.capitalise.calledWithExactly('theatre')).to.be.true;
				expect(removeWhitespace(result)).to.eq(removeWhitespace(`
					MATCH (n:Theatre { uuid: $uuid })

					RETURN {
						model: 'theatre',
						uuid: n.uuid,
						name: n.name
					} AS theatre
				`));

			});

		});

		describe('getUpdateQuery function', () => {

			it('will return requisite query', () => {

				const result = subject.getUpdateQuery('theatre');
				expect(stubs.capitalise.calledOnce).to.be.true;
				expect(stubs.capitalise.calledWithExactly('theatre')).to.be.true;
				expect(removeWhitespace(result)).to.eq(removeWhitespace(`
					MATCH (n:Theatre { uuid: $uuid })
						SET n.name = $name

					RETURN {
						model: 'theatre',
						uuid: n.uuid,
						name: n.name
					} AS theatre
				`));

			});

		});

		describe('getDeleteQuery function', () => {

			it('will return requisite query', () => {

				const result = subject.getDeleteQuery('theatre');
				expect(stubs.capitalise.calledOnce).to.be.true;
				expect(stubs.capitalise.calledWithExactly('theatre')).to.be.true;
				expect(removeWhitespace(result)).to.eq(removeWhitespace(`
					MATCH (n:Theatre { uuid: $uuid })

					WITH n, n.name AS name
						DETACH DELETE n

					RETURN {
						model: 'theatre',
						name: name
					} AS theatre
				`));

			});

		});

		describe('getListQuery function', () => {

			it('will return requisite query', () => {

				const result = subject.getListQuery('theatre');
				expect(stubs.capitalise.calledOnce).to.be.true;
				expect(stubs.capitalise.calledWithExactly('theatre')).to.be.true;
				expect(stubs.pluralise.calledOnce).to.be.true;
				expect(stubs.pluralise.calledWithExactly('theatre')).to.be.true;
				expect(removeWhitespace(result)).to.eq(removeWhitespace(`
					MATCH (n:Theatre)

					RETURN COLLECT({
						model: 'theatre',
						uuid: n.uuid,
						name: n.name
					}) AS theatres
				`));

			});

		});

	});

});
