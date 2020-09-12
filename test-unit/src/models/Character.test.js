import { expect } from 'chai';

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

	});

});
