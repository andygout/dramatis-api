import { expect } from 'chai';
import { spy } from 'sinon';

import Role from '../../../src/models/Role';

describe('Role model', () => {

	describe('constructor method', () => {

		describe('characterName property', () => {

			it('assigns empty string if absent from props', () => {

				const instance = new Role({ name: 'Hamlet, Prince of Denmark' });
				expect(instance.characterName).to.equal('');

			});

			it('assigns empty string if included in props but value is empty string', () => {

				const instance = new Role({ name: 'Hamlet, Prince of Denmark', characterName: '' });
				expect(instance.characterName).to.equal('');

			});

			it('assigns empty string if included in props but value is whitespace-only string', () => {

				const instance = new Role({ name: 'Hamlet, Prince of Denmark', characterName: ' ' });
				expect(instance.characterName).to.equal('');

			});

			it('assigns value if included in props and is string with length', () => {

				const instance = new Role({ name: 'Hamlet, Prince of Denmark', characterName: 'Hamlet' });
				expect(instance.characterName).to.equal('Hamlet');

			});

			it('trims value before assigning', () => {

				const instance = new Role({ name: 'Hamlet, Prince of Denmark', characterName: ' Hamlet ' });
				expect(instance.characterName).to.equal('Hamlet');

			});

		});

		describe('characterDifferentiator property', () => {

			it('assigns empty string if absent from props', () => {

				const instance = new Role({ name: 'Cinna' });
				expect(instance.characterDifferentiator).to.equal('');

			});

			it('assigns empty string if included in props but value is empty string', () => {

				const instance = new Role({ name: 'Cinna', characterDifferentiator: '' });
				expect(instance.characterDifferentiator).to.equal('');

			});

			it('assigns empty string if included in props but value is whitespace-only string', () => {

				const instance = new Role({ name: 'Cinna', characterDifferentiator: ' ' });
				expect(instance.characterDifferentiator).to.equal('');

			});

			it('assigns value if included in props and is string with length', () => {

				const instance = new Role({ name: 'Cinna', characterDifferentiator: '1' });
				expect(instance.characterDifferentiator).to.equal('1');

			});

			it('trims value before assigning', () => {

				const instance = new Role({ name: 'Cinna', characterDifferentiator: ' 1 ' });
				expect(instance.characterDifferentiator).to.equal('1');

			});

		});

		describe('qualifier property', () => {

			it('assigns empty string if absent from props', () => {

				const instance = new Role({ name: 'Esme' });
				expect(instance.qualifier).to.equal('');

			});

			it('assigns empty string if included in props but value is empty string', () => {

				const instance = new Role({ name: 'Esme', qualifier: '' });
				expect(instance.qualifier).to.equal('');

			});

			it('assigns empty string if included in props but value is whitespace-only string', () => {

				const instance = new Role({ name: 'Esme', qualifier: ' ' });
				expect(instance.qualifier).to.equal('');

			});

			it('assigns value if included in props and is string with length', () => {

				const instance = new Role({ name: 'Esme', qualifier: 'younger' });
				expect(instance.qualifier).to.equal('younger');

			});

			it('trims value before assigning', () => {

				const instance = new Role({ name: 'Esme', qualifier: ' younger ' });
				expect(instance.qualifier).to.equal('younger');

			});

		});

		describe('isAlternate property', () => {

			it('assigns false if absent from props', () => {

				const instance = new Role({ name: 'Young Lucius' });
				expect(instance.isAlternate).to.equal(false);

			});

			it('assigns false if included in props but value evaluates to false', () => {

				const instance = new Role({ name: 'Young Lucius', isAlternate: null });
				expect(instance.isAlternate).to.equal(false);

			});

			it('assigns false if included in props but value is false', () => {

				const instance = new Role({ name: 'Young Lucius', isAlternate: false });
				expect(instance.isAlternate).to.equal(false);

			});

			it('assigns true if included in props and value evaluates to true', () => {

				const instance = new Role({ name: 'Young Lucius', isAlternate: 'foobar' });
				expect(instance.isAlternate).to.equal(true);

			});

			it('assigns true if included in props and value is true', () => {

				const instance = new Role({ name: 'Young Lucius', isAlternate: true });
				expect(instance.isAlternate).to.equal(true);

			});

		});

	});

	describe('validateCharacterName method', () => {

		it('will call validateStringForProperty method', () => {

			const instance = new Role({ name: 'Hamlet, Prince of Denmark', characterName: 'Hamlet' });
			spy(instance, 'validateStringForProperty');
			instance.validateCharacterName();
			expect(instance.validateStringForProperty.calledOnce).to.be.true;
			expect(instance.validateStringForProperty.calledWithExactly(
				'characterName', { isRequired: false })
			).to.be.true;

		});

	});

	describe('validateCharacterDifferentiator method', () => {

		it('will call validateStringForProperty method', () => {

			const instance = new Role({ name: 'Cinna', characterDifferentiator: '1' });
			spy(instance, 'validateStringForProperty');
			instance.validateCharacterDifferentiator();
			expect(instance.validateStringForProperty.calledOnce).to.be.true;
			expect(instance.validateStringForProperty.calledWithExactly(
				'characterDifferentiator', { isRequired: false })
			).to.be.true;

		});

	});

	describe('validateRoleNameCharacterNameDisparity method', () => {

		context('valid data', () => {

			context('role name without a character name', () => {

				it('will not add properties to errors property', () => {

					const instance = new Role({ name: 'Hamlet', characterName: '' });
					spy(instance, 'addPropertyError');
					instance.validateRoleNameCharacterNameDisparity();
					expect(instance.addPropertyError.notCalled).to.be.true;

				});

			});

			context('role name and different character name', () => {

				it('will not add properties to errors property', () => {

					const instance = new Role({ name: 'Hamlet, Prince of Denmark', characterName: 'Hamlet' });
					spy(instance, 'addPropertyError');
					instance.validateRoleNameCharacterNameDisparity();
					expect(instance.addPropertyError.notCalled).to.be.true;

				});

			});

			context('no role name and no character name', () => {

				it('will not add properties to errors property', () => {

					const instance = new Role({ name: '', characterName: '' });
					spy(instance, 'addPropertyError');
					instance.validateRoleNameCharacterNameDisparity();
					expect(instance.addPropertyError.notCalled).to.be.true;

				});

			});

		});

		context('invalid data', () => {

			it('adds properties whose values are arrays to errors property', () => {

				const instance = new Role({ name: 'Hamlet', characterName: 'Hamlet' });
				spy(instance, 'addPropertyError');
				instance.validateRoleNameCharacterNameDisparity();
				expect(instance.addPropertyError.calledOnce).to.be.true;
				expect(instance.addPropertyError.calledWithExactly(
					'characterName',
					'Character name is only required if different from role name'
				)).to.be.true;

			});

		});

	});

});
