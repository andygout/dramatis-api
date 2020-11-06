import { expect } from 'chai';
import { spy } from 'sinon';

import Writer from '../../../src/models/Writer';

describe('Writer model', () => {

	describe('constructor method', () => {

		describe('group property', () => {

			it('assigns empty string if absent from props', () => {

				const instance = new Writer({ name: 'David Eldridge' });
				expect(instance.group).to.equal('');

			});

			it('assigns empty string if included in props but value is empty string', () => {

				const instance = new Writer({ name: 'David Eldridge', group: '' });
				expect(instance.group).to.equal('');

			});

			it('assigns empty string if included in props but value is whitespace-only string', () => {

				const instance = new Writer({ name: 'David Eldridge', group: ' ' });
				expect(instance.group).to.equal('');

			});

			it('assigns value if included in props and value is string with length', () => {

				const instance = new Writer({ name: 'David Eldridge', group: 'version by' });
				expect(instance.group).to.equal('version by');

			});

			it('trims value before assigning', () => {

				const instance = new Writer({ name: 'David Eldridge', group: ' version by ' });
				expect(instance.group).to.equal('version by');

			});

		});

	});

	describe('validateGroup method', () => {

		it('will call validateStringForProperty method', () => {

			const instance = new Writer({ name: 'David Eldridge', group: 'version by' });
			spy(instance, 'validateStringForProperty');
			instance.validateGroup();
			expect(instance.validateStringForProperty.calledOnce).to.be.true;
			expect(instance.validateStringForProperty.calledWithExactly('group', { isRequired: false })).to.be.true;

		});

	});

});
