import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { assert, createStubInstance, spy, stub } from 'sinon';

import { CastMember, Playtext, Theatre } from '../../../src/models';

describe('Production model', () => {

	let stubs;
	let instance;

	const CastMemberStub = function () {

		return createStubInstance(CastMember);

	};

	const PlaytextStub = function () {

		return createStubInstance(Playtext);

	};

	const TheatreStub = function () {

		return createStubInstance(Theatre);

	};

	beforeEach(() => {

		stubs = {
			getDuplicateIndicesModule: {
				getDuplicateIndices: stub().returns([])
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
				CastMember: CastMemberStub,
				Playtext: PlaytextStub,
				Theatre: TheatreStub
			}
		};

		instance = createInstance();

	});

	const createSubject = () =>
		proxyquire('../../../src/models/Production', {
			'../lib/get-duplicate-indices': stubs.getDuplicateIndicesModule,
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
				expect(instance.cast).to.deep.equal([]);

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
				expect(instance.cast[0] instanceof CastMember).to.be.true;
				expect(instance.cast[1] instanceof CastMember).to.be.true;
				expect(instance.cast[2] instanceof CastMember).to.be.true;

			});

		});

	});

	describe('runInputValidations method', () => {

		it('calls instance validate method and associated models\' validate methods', () => {

			spy(instance, 'validateName');
			instance.runInputValidations();
			assert.callOrder(
				instance.validateName,
				instance.theatre.validateName,
				instance.theatre.validateDifferentiator,
				instance.playtext.validateName,
				instance.playtext.validateDifferentiator,
				stubs.getDuplicateIndicesModule.getDuplicateIndices,
				instance.cast[0].runInputValidations
			);
			expect(instance.validateName.calledOnce).to.be.true;
			expect(instance.validateName.calledWithExactly({ isRequired: true })).to.be.true;
			expect(instance.theatre.validateName.calledOnce).to.be.true;
			expect(instance.theatre.validateName.calledWithExactly({ isRequired: false })).to.be.true;
			expect(instance.theatre.validateDifferentiator.calledOnce).to.be.true;
			expect(instance.theatre.validateDifferentiator.calledWithExactly()).to.be.true;
			expect(instance.playtext.validateName.calledOnce).to.be.true;
			expect(instance.playtext.validateName.calledWithExactly({ isRequired: false })).to.be.true;
			expect(instance.playtext.validateDifferentiator.calledOnce).to.be.true;
			expect(instance.playtext.validateDifferentiator.calledWithExactly()).to.be.true;
			expect(stubs.getDuplicateIndicesModule.getDuplicateIndices.calledOnce).to.be.true;
			expect(stubs.getDuplicateIndicesModule.getDuplicateIndices.calledWithExactly(instance.cast)).to.be.true;
			expect(instance.cast[0].runInputValidations.calledOnce).to.be.true;
			expect(instance.cast[0].runInputValidations.calledWithExactly({ isDuplicate: false })).to.be.true;

		});

	});

	describe('runDatabaseValidations method', () => {

		it('does nothing, i.e. it overrides the Base model runDatabaseValidations() method with an empty function', () => {

			instance.runDatabaseValidations();
			expect(stubs.Base.neo4jQueryModule.neo4jQuery.notCalled).to.be.true;

		});

	});

});
