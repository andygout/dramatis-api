import Entity from './Entity';

export default class Company extends Entity {

	constructor (props = {}) {

		super(props);

	}

	get model () {

		return 'company';

	}

}
