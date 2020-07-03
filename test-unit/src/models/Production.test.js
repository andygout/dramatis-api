import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { assert, createStubInstance, spy, stub } from 'sinon';

import { BasicModel, PersonCastMember, Theatre } from '../../../src/models';

describe('Production model', () => {

	let stubs;
	let instance;

	const BasicModelStub = function () {

		return createStubInstance(BasicModel);

	};

	const PersonCastMemberStub = function () {

		return createStubInstance(PersonCastMember);

	};

	const TheatreStub = function () {

		return createStubInstance(Theatre);

	};

	beforeEach(() => {

		stubs = {
			getDuplicateNameIndicesModule: {
				getDuplicateNameIndices: stub().returns([])
			},
			Base: {
				validateStringModule: {
					validateString: stub()
				},
				neo4jQueryModule: {
					neo4jQuery: stub()
				}
			},
			models: {
				BasicModel: BasicModelStub,
				PersonCastMember: PersonCastMemberStub,
				Theatre: TheatreStub
			}
		};

		instance = createInstance();

	});

	const createSubject = () =>
		proxyquire('../../../src/models/Production', {
			'../lib/get-duplicate-name-indices': stubs.getDuplicateNameIndicesModule,
			'./Base': proxyquire('../../../src/models/Base', {
				'../lib/validate-string': stubs.Base.validateStringModule,
				'../neo4j/query': stubs.Base.neo4jQueryModule
			}),
			'.': stubs.models
		}).default;

	const createInstance = (props = { name: 'Hamlet', cast: [{ name: 'Patrick Stewart' }] }) => {

		const Production = createSubject();

		return new Production(props);

	};

	describe('constructor method', () => {

		describe('cast property', () => {

			it('assigns empty array if absent from props', () => {

				const props = { name: 'Hamlet' };
				const instance = createInstance(props);
				expect(instance.cast).to.deep.eq([]);

			});

			it('assigns array of cast if included in props, retaining those with empty or whitespace-only string names', () => {

				const props = {
					name: 'Hamlet',
					cast: [
						{ name: 'Patrick Stewart' },
						{ name: '' },
						{ name: ' ' }
					]
				};
				const instance = createInstance(props);
				expect(instance.cast.length).to.equal(3);
				expect(instance.cast[0] instanceof PersonCastMember).to.be.true;
				expect(instance.cast[1] instanceof PersonCastMember).to.be.true;
				expect(instance.cast[2] instanceof PersonCastMember).to.be.true;

			});

		});

	});

	describe('runInputValidations method', () => {

		it('calls instance validate method and associated models\' validate methods', () => {

			spy(instance, 'validateName');
			instance.runInputValidations();
			assert.callOrder(
				instance.validateName.withArgs({ requiresName: true }),
				instance.theatre.validateName.withArgs({ requiresName: true }),
				instance.playtext.validateName.withArgs({ requiresName: false }),
				stubs.getDuplicateNameIndicesModule.getDuplicateNameIndices.withArgs(instance.cast),
				instance.cast[0].runInputValidations.withArgs({ hasDuplicateName: false })
			);
			expect(instance.validateName.calledOnce).to.be.true;
			expect(instance.theatre.validateName.calledOnce).to.be.true;
			expect(instance.playtext.validateName.calledOnce).to.be.true;
			expect(stubs.getDuplicateNameIndicesModule.getDuplicateNameIndices.calledOnce).to.be.true;
			expect(instance.cast[0].runInputValidations.calledOnce).to.be.true;

		});

	});

	describe('runDatabaseValidations method', () => {

		it('does nothing, i.e. it overrides the Base model runDatabaseValidations() method with an empty function', () => {

			instance.runDatabaseValidations();
			expect(stubs.Base.neo4jQueryModule.neo4jQuery.notCalled).to.be.true;

		});

	});

});
