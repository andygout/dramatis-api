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

	});

});
