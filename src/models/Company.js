import Base from './Base';

export default class Company extends Base {

	constructor (props = {}) {

		super(props);

		const { uuid, differentiator } = props;

		this.uuid = uuid;
		this.differentiator = differentiator?.trim() || '';

	}

	get model () {

		return 'company';

	}

}
