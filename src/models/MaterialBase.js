import Entity from './Entity';

export default class MaterialBase extends Entity {

	constructor (props = {}) {

		super(props);

	}

	get model () {

		return 'material';

	}

}
