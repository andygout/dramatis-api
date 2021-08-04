import Entity from './Entity';

export default class Award extends Entity {

	constructor (props = {}) {

		super(props);

	}

	get model () {

		return 'award';

	}

}
