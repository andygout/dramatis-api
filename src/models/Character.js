import Entity from './Entity';

export default class Character extends Entity {

	constructor (props = {}) {

		super(props);

		const { differentiator } = props;

		this.differentiator = differentiator?.trim() || '';

	}

	get model () {

		return 'character';

	}

}
