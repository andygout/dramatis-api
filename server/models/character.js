import Base from './base';

export default class Character extends Base {

	constructor (props = {}) {

		super(props);

		Object.defineProperty(this, 'model', {
			get: function () { return 'character'; }
		});

		this.productions = [];

	}

}
