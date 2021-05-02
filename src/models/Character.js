import Entity from './Entity';

export default class Character extends Entity {

	constructor (props = {}) {

		super(props);

	}

	get model () {

		return 'character';

	}

}
