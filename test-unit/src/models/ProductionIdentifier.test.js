import { expect } from 'chai';
import { assert, spy } from 'sinon';

import { ProductionIdentifier } from '../../../src/models';

describe('ProductionIdentifier model', () => {

	describe('constructor method', () => {

		describe('uuid property', () => {

			it('assigns empty string if absent from props', () => {

				const instance = new ProductionIdentifier({});
				expect(instance.uuid).to.equal('');

			});

			it('assigns empty string if included in props but value is empty string', () => {

				const instance = new ProductionIdentifier({ uuid: '' });
				expect(instance.uuid).to.equal('');

			});

			it('assigns empty string if included in props but value is whitespace-only string', () => {

				const instance = new ProductionIdentifier({ uuid: ' ' });
				expect(instance.uuid).to.equal('');

			});

			it('assigns value if included in props and is string with length', () => {

				const instance = new ProductionIdentifier({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });
				expect(instance.uuid).to.equal('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

			});

			it('trims value before assigning', () => {

				const instance = new ProductionIdentifier({ uuid: ' xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx ' });
				expect(instance.uuid).to.equal('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

			});

		});

	});

	describe('validateUuid method', () => {

		it('will call validateStringForProperty method', () => {

			const instance = new ProductionIdentifier({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });
			spy(instance, 'validateStringForProperty');
			instance.validateUuid();
			assert.calledOnce(instance.validateStringForProperty);
			assert.calledWithExactly(instance.validateStringForProperty, 'uuid', { isRequired: false });

		});

	});

});
