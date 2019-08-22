import { expect } from 'chai';

import { capitalise } from '../../../server/lib/strings';

describe('Capitalise module', () => {

	it('returns string with initial letter as capital', () => {

		expect(capitalise('string')).to.eq('String');

	});

});
