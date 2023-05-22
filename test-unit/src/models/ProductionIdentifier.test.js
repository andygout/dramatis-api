import { assert, spy } from 'sinon';

import { ProductionIdentifier } from '../../../src/models';

describe('ProductionIdentifier model', () => {

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
