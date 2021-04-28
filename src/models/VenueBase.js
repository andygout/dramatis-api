import Base from './Base';

export default class Venue extends Base {

	constructor (props = {}) {

		super(props);

		const { uuid, differentiator } = props;

		this.uuid = uuid;
		this.differentiator = differentiator?.trim() || '';

	}

	get model () {

		return 'venue';

	}

}
