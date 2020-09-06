import { expect } from 'chai';
import { spy } from 'sinon';

import Role from '../../../src/models/Role';

describe('Role model', () => {

	describe('constructor method', () => {

		describe('name property', () => {

			it('assigns given value', () => {

				const instance = new Role({ name: 'Hamlet, Prince of Denmark', characterName: '' });
				expect(instance.name).to.equal('Hamlet, Prince of Denmark');

			});

			it('trims given value before assigning', () => {

				const instance = new Role({ name: ' Hamlet, Prince of Denmark ', characterName: '' });
				expect(instance.name).to.equal('Hamlet, Prince of Denmark');

			});

		});

		describe('characterName property', () => {

			it('assigns empty string if absent from props', () => {

				const instance = new Role({ name: 'Hamlet, Prince of Denmark', characterName: '' });
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

			it('assigns value if included in props and value is string with length', () => {

				const instance = new Role({ name: 'Hamlet, Prince of Denmark', characterName: 'Hamlet' });
				expect(instance.characterName).to.equal('Hamlet');

			});

			it('trims value before assigning', () => {

				const instance = new Role({ name: 'Hamlet, Prince of Denmark', characterName: ' Hamlet ' });
				expect(instance.characterName).to.equal('Hamlet');

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

			it('assigns value if included in props and value is string with length', () => {

				const instance = new Role({ name: 'Esme', qualifier: 'younger' });
				expect(instance.qualifier).to.equal('younger');

			});

			it('trims value before assigning', () => {

				const instance = new Role({ name: 'Esme', qualifier: ' younger ' });
				expect(instance.qualifier).to.equal('younger');

			});

		});

	});

	describe('validateCharacterName method', () => {

		it('will call validateStringForProperty method', () => {

			const instance = new Role({ name: 'Hamlet, Prince of Denmark', characterName: '' });
			spy(instance, 'validateStringForProperty');
			instance.validateCharacterName();
			expect(instance.validateStringForProperty.calledOnce).to.be.true;
			expect(instance.validateStringForProperty.calledWithExactly(
				'characterName', { isRequired: false })
			).to.be.true;

		});

	});

	describe('validateCharacterNameHasRoleName method', () => {

		context('valid data', () => {

			it('will not add properties to errors property', () => {

				const instance = new Role({ name: 'Hamlet, Prince of Denmark', characterName: 'Hamlet' });
				spy(instance, 'addPropertyError');
				instance.validateCharacterNameHasRoleName();
				expect(instance.addPropertyError.notCalled).to.be.true;

			});

		});

		context('invalid data', () => {

			it('adds properties whose values are arrays to errors property', () => {

				const instance = new Role({ name: '', characterName: 'Hamlet' });
				spy(instance, 'addPropertyError');
				instance.validateCharacterNameHasRoleName();
				expect(instance.addPropertyError.calledOnce).to.be.true;
				expect(instance.addPropertyError.calledWithExactly(
					'name',
					'Role name is required when character name is present'
				)).to.be.true;

			});

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

			context('role name a different character name', () => {

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
