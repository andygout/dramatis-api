import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { assert, createStubInstance, spy, stub } from 'sinon';

import { CastMember, CreativeCredit, CrewCredit, Material, Theatre } from '../../../src/models';

describe('Production model', () => {

	let stubs;

	const CastMemberStub = function () {

		return createStubInstance(CastMember);

	};

	const CreativeCreditStub = function () {

		return createStubInstance(CreativeCredit);

	};

	const CrewCreditStub = function () {

		return createStubInstance(CrewCredit);

	};

	const MaterialStub = function () {

		return createStubInstance(Material);

	};

	const TheatreStub = function () {

		return createStubInstance(Theatre);

	};

	beforeEach(() => {

		stubs = {
			getDuplicateIndicesModule: {
				getDuplicateBaseInstanceIndices: stub().returns([]),
				getDuplicateNameIndices: stub().returns([])
			},
			Base: {
				neo4jQueryModule: {
					neo4jQuery: stub()
				}
			},
			models: {
				CastMember: CastMemberStub,
				CreativeCredit: CreativeCreditStub,
				CrewCredit: CrewCreditStub,
				Material: MaterialStub,
				Theatre: TheatreStub
			}
		};

	});

	const createSubject = () =>
		proxyquire('../../../src/models/Production', {
			'../lib/get-duplicate-indices': stubs.getDuplicateIndicesModule,
			'./Base': proxyquire('../../../src/models/Base', {
				'../neo4j/query': stubs.Base.neo4jQueryModule
			}),
			'.': stubs.models
		}).default;

	const createInstance = props => {

		const Production = createSubject();

		return new Production(props);

	};

	describe('constructor method', () => {

		describe('cast property', () => {

			it('assigns empty array if absent from props', () => {

				const instance = createInstance({ name: 'Hamlet' });
				expect(instance.cast).to.deep.equal([]);

			});

			it('assigns array of cast if included in props, retaining those with empty or whitespace-only string names', () => {

				const props = {
					name: 'Hamlet',
					cast: [
						{
							name: 'Patrick Stewart'
						},
						{
							name: ''
						},
						{
							name: ' '
						}
					]
				};
				const instance = createInstance(props);
				expect(instance.cast.length).to.equal(3);
				expect(instance.cast[0] instanceof CastMember).to.be.true;
				expect(instance.cast[1] instanceof CastMember).to.be.true;
				expect(instance.cast[2] instanceof CastMember).to.be.true;

			});

		});

		describe('creativeCredits property', () => {

			context('instance is subject', () => {

				it('assigns empty array if absent from props', () => {

					const instance = createInstance({ name: 'Hamlet' });
					expect(instance.creativeCredits).to.deep.equal([]);

				});

				it('assigns array of creativeCredits if included in props, retaining those with empty or whitespace-only string names', () => {

					const props = {
						name: 'Hamlet',
						creativeCredits: [
							{
								name: 'Sound Designer'
							},
							{
								name: ''
							},
							{
								name: ' '
							}
						]
					};
					const instance = createInstance(props);
					expect(instance.creativeCredits.length).to.equal(3);
					expect(instance.creativeCredits[0] instanceof CreativeCredit).to.be.true;
					expect(instance.creativeCredits[1] instanceof CreativeCredit).to.be.true;
					expect(instance.creativeCredits[2] instanceof CreativeCredit).to.be.true;

				});

			});

			context('instance is not subject, i.e. it is an association of another instance', () => {

				it('will not assign any value if absent from props', () => {

					const props = {
						name: 'The Tragedy of Hamlet, Prince of Denmark',
						isAssociation: true
					};
					const instance = createInstance(props);
					expect(instance).not.to.have.property('writingCredits');

				});

				it('will not assign any value if included in props', () => {

					const props = {
						name: 'The Tragedy of Hamlet, Prince of Denmark',
						writingCredits: [
							{
								name: 'version by'
							}
						],
						isAssociation: true
					};
					const instance = createInstance(props);
					expect(instance).not.to.have.property('writingCredits');

				});

			});

		});

	});

	describe('runInputValidations method', () => {

		it('calls instance validate method and associated models\' validate methods', () => {

			const props = {
				name: 'Hamlet',
				cast: [
					{
						name: 'Patrick Stewart'
					}
				],
				creativeCredits: [
					{
						name: 'Sound Designer'
					}
				],
				crewCredits: [
					{
						name: 'Stage Manager'
					}
				]
			};
			const instance = createInstance(props);
			spy(instance, 'validateName');
			instance.runInputValidations();
			assert.callOrder(
				instance.validateName,
				instance.theatre.validateName,
				instance.theatre.validateDifferentiator,
				instance.material.validateName,
				instance.material.validateDifferentiator,
				stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices,
				instance.cast[0].runInputValidations,
				stubs.getDuplicateIndicesModule.getDuplicateNameIndices,
				instance.creativeCredits[0].runInputValidations,
				stubs.getDuplicateIndicesModule.getDuplicateNameIndices,
				instance.crewCredits[0].runInputValidations
			);
			expect(instance.validateName.calledOnce).to.be.true;
			expect(instance.validateName.calledWithExactly({ isRequired: true })).to.be.true;
			expect(instance.theatre.validateName.calledOnce).to.be.true;
			expect(instance.theatre.validateName.calledWithExactly({ isRequired: false })).to.be.true;
			expect(instance.theatre.validateDifferentiator.calledOnce).to.be.true;
			expect(instance.theatre.validateDifferentiator.calledWithExactly()).to.be.true;
			expect(instance.material.validateName.calledOnce).to.be.true;
			expect(instance.material.validateName.calledWithExactly({ isRequired: false })).to.be.true;
			expect(instance.material.validateDifferentiator.calledOnce).to.be.true;
			expect(instance.material.validateDifferentiator.calledWithExactly()).to.be.true;
			expect(stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices.calledOnce).to.be.true;
			expect(stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices.getCall(0).calledWithExactly(
				instance.cast
			)).to.be.true;
			expect(instance.cast[0].runInputValidations.calledOnce).to.be.true;
			expect(instance.cast[0].runInputValidations.calledWithExactly({ isDuplicate: false })).to.be.true;
			expect(stubs.getDuplicateIndicesModule.getDuplicateNameIndices.calledTwice).to.be.true;
			expect(stubs.getDuplicateIndicesModule.getDuplicateNameIndices.getCall(0).calledWithExactly(
				instance.creativeCredits
			)).to.be.true;
			expect(instance.creativeCredits[0].runInputValidations.calledOnce).to.be.true;
			expect(instance.creativeCredits[0].runInputValidations.calledWithExactly(
				{ isDuplicate: false }
			)).to.be.true;
			expect(stubs.getDuplicateIndicesModule.getDuplicateNameIndices.getCall(1).calledWithExactly(
				instance.crewCredits
			)).to.be.true;
			expect(instance.crewCredits[0].runInputValidations.calledOnce).to.be.true;
			expect(instance.crewCredits[0].runInputValidations.calledWithExactly(
				{ isDuplicate: false }
			)).to.be.true;

		});

	});

	describe('runDatabaseValidations method', () => {

		it('does nothing, i.e. it overrides the Base model runDatabaseValidations() method with an empty function', () => {

			const instance = createInstance({ name: 'Hamlet' });
			instance.runDatabaseValidations();
			expect(stubs.Base.neo4jQueryModule.neo4jQuery.notCalled).to.be.true;

		});

	});

});
