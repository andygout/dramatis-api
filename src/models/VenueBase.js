import Entity from './Entity';

export default class Venue extends Entity {

	constructor (props = {}) {

		super(props);

	}

	get model () {

		return 'venue';

	}

}
