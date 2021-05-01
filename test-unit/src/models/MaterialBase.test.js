import { expect } from 'chai';

import MaterialBase from '../../../src/models/MaterialBase';

describe('MaterialBase model', () => {

	describe('constructor method', () => {

		describe('differentiator property', () => {

			it('assigns empty string if absent from props', () => {

				const instance = new MaterialBase({ name: 'The Seagull' });
				expect(instance.differentiator).to.equal('');

			});

			it('assigns empty string if included in props but value is empty string', () => {

				const instance = new MaterialBase({ name: 'The Seagull', differentiator: '' });
				expect(instance.differentiator).to.equal('');

			});

			it('assigns empty string if included in props but value is whitespace-only string', () => {

				const instance = new MaterialBase({ name: 'The Seagull', differentiator: ' ' });
				expect(instance.differentiator).to.equal('');

			});

			it('assigns value if included in props and value is string with length', () => {

				const instance = new MaterialBase({ name: 'The Seagull', differentiator: '1' });
				expect(instance.differentiator).to.equal('1');

			});

			it('trims value before assigning', () => {

				const instance = new MaterialBase({ name: 'The Seagull', differentiator: ' 1 ' });
				expect(instance.differentiator).to.equal('1');

			});

		});

	});

});
