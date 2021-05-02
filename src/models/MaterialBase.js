import Entity from './Entity';

export default class MaterialBase extends Entity {

	constructor (props = {}) {

		super(props);

		const { differentiator } = props;

		this.differentiator = differentiator?.trim() || '';

	}

	get model () {

		return 'material';

	}

}
