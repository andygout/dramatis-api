import Entity from './Entity';

export default class Person extends Entity {

	constructor (props = {}) {

		super(props);

		const { differentiator } = props;

		this.differentiator = differentiator?.trim() || '';

	}

	get model () {

		return 'person';

	}

}
