import { expect } from 'chai';

import Person from '../../../src/models/Person';

describe('Person model', () => {

	describe('constructor method', () => {

		describe('differentiator property', () => {

			it('assigns empty string if absent from props', () => {

				const instance = new Person({ name: 'Paul Higgins' });
				expect(instance.differentiator).to.equal('');

			});

			it('assigns empty string if included in props but value is empty string', () => {

				const instance = new Person({ name: 'Paul Higgins', differentiator: '' });
				expect(instance.differentiator).to.equal('');

			});

			it('assigns empty string if included in props but value is whitespace-only string', () => {

				const instance = new Person({ name: 'Paul Higgins', differentiator: ' ' });
				expect(instance.differentiator).to.equal('');

			});

			it('assigns value if included in props and value is string with length', () => {

				const instance = new Person({ name: 'Paul Higgins', differentiator: '1' });
				expect(instance.differentiator).to.equal('1');

			});

			it('trims value before assigning', () => {

				const instance = new Person({ name: 'Paul Higgins', differentiator: ' 1 ' });
				expect(instance.differentiator).to.equal('1');

			});

		});

	});

});
