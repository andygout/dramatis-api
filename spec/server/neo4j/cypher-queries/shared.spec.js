import { expect } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

import { removeWhitespace } from '../../../spec-helpers';

let stubs;
let subject;

beforeEach(() => {

	stubs = {
		capitalise: sinon.stub().returns('Theatre')
	};

	subject = createSubject();

});

const createSubject = (stubOverrides = {}) =>
	proxyquire('../../../../server/neo4j/cypher-queries/shared', {
		'../../lib/capitalise': stubOverrides.capitalise || stubs.capitalise
	});

describe('Cypher Queries Shared module', () => {

	context('Production model usage', () => {

		describe('getListQuery function', () => {

			it('returns requisite query', () => {

				const capitaliseStub = sinon.stub().returns('Production');
				subject = createSubject({ capitalise: capitaliseStub });
				const result = subject.getListQuery('production');
				expect(capitaliseStub.calledOnce).to.be.true;
				expect(capitaliseStub.calledWithExactly('production')).to.be.true;
				expect(removeWhitespace(result)).to.eq(removeWhitespace(`
					MATCH (n:Production)-[:PLAYS_AT]->(t:Theatre)

					RETURN
						'production' AS model,
						n.uuid AS uuid,
						n.name AS name
						, { model: 'theatre', uuid: t.uuid, name: t.name } AS theatre
				`));

			});

		});

	});

	context('Theatre (i.e. non-Production) model usage', () => {

		describe('getValidateQuery function', () => {

			context('uuid agurment given is undefined (i.e. requested as part of create action)', () => {

				it('returns requisite query', () => {

					const result = subject.getValidateQuery('theatre', undefined);
					expect(stubs.capitalise.calledOnce).to.be.true;
					expect(stubs.capitalise.calledWithExactly('theatre')).to.be.true;
					expect(removeWhitespace(result)).to.eq(removeWhitespace(`
						MATCH (n:Theatre { name: $name })

						RETURN SIGN(COUNT(n)) AS instanceCount
					`));

				});

			});

			context('uuid argument given is valid string (i.e. requested as part of update action)', () => {

				it('returns requisite query', () => {

					const result = subject.getValidateQuery('theatre', 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
					expect(stubs.capitalise.calledOnce).to.be.true;
					expect(stubs.capitalise.calledWithExactly('theatre')).to.be.true;
					expect(removeWhitespace(result)).to.eq(removeWhitespace(`
						MATCH (n:Theatre { name: $name })
							WHERE n.uuid <> $uuid

						RETURN SIGN(COUNT(n)) AS instanceCount
					`));

				});

			});

		});

		describe('getCreateQuery function', () => {

			it('returns requisite query', () => {

				const result = subject.getCreateQuery('theatre');
				expect(stubs.capitalise.calledOnce).to.be.true;
				expect(stubs.capitalise.calledWithExactly('theatre')).to.be.true;
				expect(removeWhitespace(result)).to.eq(removeWhitespace(`
					CREATE (n:Theatre { uuid: $uuid, name: $name })

					RETURN
						'theatre' AS model,
						n.uuid AS uuid,
						n.name AS name
				`));

			});

		});

		describe('getEditQuery function', () => {

			it('returns requisite query', () => {

				const result = subject.getEditQuery('theatre');
				expect(stubs.capitalise.calledOnce).to.be.true;
				expect(stubs.capitalise.calledWithExactly('theatre')).to.be.true;
				expect(removeWhitespace(result)).to.eq(removeWhitespace(`
					MATCH (n:Theatre { uuid: $uuid })

					RETURN
						'theatre' AS model,
						n.uuid AS uuid,
						n.name AS name
				`));

			});

		});

		describe('getUpdateQuery function', () => {

			it('returns requisite query', () => {

				const result = subject.getUpdateQuery('theatre');
				expect(stubs.capitalise.calledOnce).to.be.true;
				expect(stubs.capitalise.calledWithExactly('theatre')).to.be.true;
				expect(removeWhitespace(result)).to.eq(removeWhitespace(`
					MATCH (n:Theatre { uuid: $uuid })
						SET n.name = $name

					RETURN
						'theatre' AS model,
						n.uuid AS uuid,
						n.name AS name
				`));

			});

		});

		describe('getDeleteQuery function', () => {

			it('returns requisite query', () => {

				const result = subject.getDeleteQuery('theatre');
				expect(stubs.capitalise.calledOnce).to.be.true;
				expect(stubs.capitalise.calledWithExactly('theatre')).to.be.true;
				expect(removeWhitespace(result)).to.eq(removeWhitespace(`
					MATCH (n:Theatre { uuid: $uuid })

					WITH n, n.name AS name
						DETACH DELETE n

					RETURN
						'theatre' AS model,
						name
				`));

			});

		});

		describe('getListQuery function', () => {

			it('returns requisite query', () => {

				const result = subject.getListQuery('theatre');
				expect(stubs.capitalise.calledOnce).to.be.true;
				expect(stubs.capitalise.calledWithExactly('theatre')).to.be.true;
				expect(removeWhitespace(result)).to.eq(removeWhitespace(`
					MATCH (n:Theatre)

					RETURN
						'theatre' AS model,
						n.uuid AS uuid,
						n.name AS name
				`));

			});

		});

	});

});
