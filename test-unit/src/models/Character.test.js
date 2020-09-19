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

		describe('qualifier property', () => {

			context('instance is subject', () => {

				it('will not assign any value if absent from props', () => {

					const instance = new Character({ name: 'Esme' });
					expect(instance).not.to.have.property('characters');

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
					expect(instance).not.to.have.property('characters');

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

	describe('validateGroup method', () => {

		it('will call validateStringForProperty method', () => {

			const instance = new Character({ name: 'Bottom', group: 'The Mechanicals', isAssociation: true });
			spy(instance, 'validateStringForProperty');
			instance.validateGroup();
			expect(instance.validateStringForProperty.calledOnce).to.be.true;
			expect(instance.validateStringForProperty.calledWithExactly('group', { isRequired: false })).to.be.true;

		});

	});

});
