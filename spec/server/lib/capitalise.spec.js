import { expect } from 'chai';

import subject from '../../../server/lib/capitalise';

describe('Capitalise module', () => {

	it('will return string with initial letter as capital', () => {

		expect(subject('string')).to.eq('String');

	});

});
