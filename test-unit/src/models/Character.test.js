import { expect } from 'chai';
import { spy } from 'sinon';

import Character from '../../../src/models/Character';

describe('Character model', () => {

	describe('constructor method', () => {

		describe('differentiator property', () => {

			it('assigns empty string if absent from props', () => {

				const instance = new Character({ name: 'Demetrius' });
				expect(instance.differentiator).to.equal('');

			});

			it('assigns empty string if included in props but value is empty string', () => {

				const instance = new Character({ name: 'Demetrius', differentiator: '' });
				expect(instance.differentiator).to.equal('');

			});

			it('assigns empty string if included in props but value is whitespace-only string', () => {

				const instance = new Character({ name: 'Demetrius', differentiator: ' ' });
				expect(instance.differentiator).to.equal('');

			});

			it('assigns value if included in props and value is string with length', () => {

				const instance = new Character({ name: 'Demetrius', differentiator: '1' });
				expect(instance.differentiator).to.equal('1');

			});

			it('trims value before assigning', () => {

				const instance = new Character({ name: 'Demetrius', differentiator: ' 1 ' });
				expect(instance.differentiator).to.equal('1');

			});

		});

		describe('underlyingName property', () => {

			context('instance is subject', () => {

				it('will not assign any value if absent from props', () => {

					const instance = new Character({ name: 'Prince Hal' });
					expect(instance).not.to.have.property('underlyingName');

				});

				it('will not assign any value if included in props', () => {

					const instance = new Character({ name: 'Prince Hal', underlyingName: 'King Henry V' });
					expect(instance).not.to.have.property('underlyingName');

				});

			});

			context('instance is not subject, i.e. it is an association of another instance', () => {

				it('assigns empty string if absent from props', () => {

					const instance = new Character({ name: 'Prince Hal', isAssociation: true });
					expect(instance.underlyingName).to.equal('');

				});

				it('assigns empty string if included in props but value is empty string', () => {

					const instance = new Character({ name: 'Prince Hal', underlyingName: '', isAssociation: true });
					expect(instance.underlyingName).to.equal('');

				});

				it('assigns empty string if included in props but value is whitespace-only string', () => {

					const instance = new Character({ name: 'Prince Hal', underlyingName: ' ', isAssociation: true });
					expect(instance.underlyingName).to.equal('');

				});

				it('assigns value if included in props and value is string with length', () => {

					const instance = new Character({ name: 'Prince Hal', underlyingName: 'King Henry V', isAssociation: true });
					expect(instance.underlyingName).to.equal('King Henry V');

				});

				it('trims value before assigning', () => {

					const instance = new Character({ name: 'Prince Hal', underlyingName: ' King Henry V ', isAssociation: true });
					expect(instance.underlyingName).to.equal('King Henry V');

				});

			});

		});

		describe('qualifier property', () => {

			context('instance is subject', () => {

				it('will not assign any value if absent from props', () => {

					const instance = new Character({ name: 'Esme' });
					expect(instance).not.to.have.property('qualifier');

				});

				it('will not assign any value if included in props', () => {

					const instance = new Character({ name: 'Esme', qualifier: 'younger' });
					expect(instance).not.to.have.property('qualifier');

				});

			});

			context('instance is not subject, i.e. it is an association of another instance', () => {

				it('assigns empty string if absent from props', () => {

					const instance = new Character({ name: 'Esme', isAssociation: true });
					expect(instance.qualifier).to.equal('');

				});

				it('assigns empty string if included in props but value is empty string', () => {

					const instance = new Character({ name: 'Esme', qualifier: '', isAssociation: true });
					expect(instance.qualifier).to.equal('');

				});

				it('assigns empty string if included in props but value is whitespace-only string', () => {

					const instance = new Character({ name: 'Esme', qualifier: ' ', isAssociation: true });
					expect(instance.qualifier).to.equal('');

				});

				it('assigns value if included in props and value is string with length', () => {

					const instance = new Character({ name: 'Esme', qualifier: 'younger', isAssociation: true });
					expect(instance.qualifier).to.equal('younger');

				});

				it('trims value before assigning', () => {

					const instance = new Character({ name: 'Esme', qualifier: ' younger ', isAssociation: true });
					expect(instance.qualifier).to.equal('younger');

				});

			});

		});

		describe('group property', () => {

			context('instance is subject', () => {

				it('will not assign any value if absent from props', () => {

					const instance = new Character({ name: 'Tamora' });
					expect(instance).not.to.have.property('group');

				});

				it('will not assign any value if included in props', () => {

					const instance = new Character({ name: 'Tamora', group: 'Goths' });
					expect(instance).not.to.have.property('group');

				});

			});

			context('instance is not subject, i.e. it is an association of another instance', () => {

				it('assigns empty string if absent from props', () => {

					const instance = new Character({ name: 'Tamora', isAssociation: true });
					expect(instance.group).to.equal('');

				});

				it('assigns empty string if included in props but value is empty string', () => {

					const instance = new Character({ name: 'Tamora', group: '', isAssociation: true });
					expect(instance.group).to.equal('');

				});

				it('assigns empty string if included in props but value is whitespace-only string', () => {

					const instance = new Character({ name: 'Tamora', group: ' ', isAssociation: true });
					expect(instance.group).to.equal('');

				});

				it('assigns value if included in props and value is string with length', () => {

					const instance = new Character({ name: 'Tamora', group: 'Goths', isAssociation: true });
					expect(instance.group).to.equal('Goths');

				});

				it('trims value before assigning', () => {

					const instance = new Character({ name: 'Tamora', group: ' Goths ', isAssociation: true });
					expect(instance.group).to.equal('Goths');

				});

			});

		});

	});

	describe('validateUnderlyingName method', () => {

		it('will call validateStringForProperty method', () => {

			const instance = new Character({ name: 'Prince Hal', underlyingName: 'King Henry V', isAssociation: true });
			spy(instance, 'validateStringForProperty');
			instance.validateUnderlyingName();
			expect(instance.validateStringForProperty.calledOnce).to.be.true;
			expect(instance.validateStringForProperty.calledWithExactly(
				'underlyingName', { isRequired: false }
			)).to.be.true;

		});

	});

	describe('validateGroup method', () => {

		it('will call validateStringForProperty method', () => {

			const instance = new Character({ name: 'Bottom', group: 'The Mechanicals', isAssociation: true });
			spy(instance, 'validateStringForProperty');
			instance.validateGroup();
			expect(instance.validateStringForProperty.calledOnce).to.be.true;
			expect(instance.validateStringForProperty.calledWithExactly('group', { isRequired: false })).to.be.true;

		});

	});

	describe('validateCharacterNameUnderlyingNameDisparity method', () => {

		context('valid data', () => {

			context('role name without a character name', () => {

				it('will not add properties to errors property', () => {

					const instance = new Character({ name: 'Prince Hal', underlyingName: '', isAssociation: true });
					spy(instance, 'addPropertyError');
					instance.validateCharacterNameUnderlyingNameDisparity();
					expect(instance.addPropertyError.notCalled).to.be.true;

				});

			});

			context('role name and different character name', () => {

				it('will not add properties to errors property', () => {

					const instance = new Character({ name: 'Prince Hal', underlyingName: 'King Henry V', isAssociation: true });
					spy(instance, 'addPropertyError');
					instance.validateCharacterNameUnderlyingNameDisparity();
					expect(instance.addPropertyError.notCalled).to.be.true;

				});

			});

			context('no role name and no character name', () => {

				it('will not add properties to errors property', () => {

					const instance = new Character({ name: '', underlyingName: '', isAssociation: true });
					spy(instance, 'addPropertyError');
					instance.validateCharacterNameUnderlyingNameDisparity();
					expect(instance.addPropertyError.notCalled).to.be.true;

				});

			});

		});

		context('invalid data', () => {

			it('adds properties whose values are arrays to errors property', () => {

				const instance = new Character({ name: 'King Henry V', underlyingName: 'King Henry V', isAssociation: true });
				spy(instance, 'addPropertyError');
				instance.validateCharacterNameUnderlyingNameDisparity();
				expect(instance.addPropertyError.calledOnce).to.be.true;
				expect(instance.addPropertyError.calledWithExactly(
					'underlyingName',
					'Underlying name is only required if different from character name'
				)).to.be.true;

			});

		});

	});

});
