import Entity from './Entity';

export default class Person extends Entity {

	constructor (props = {}) {

		super(props);

	}

	get model () {

		return 'person';

	}

}
