import Base from './Base';

export default class Company extends Base {

	constructor (props = {}) {

		super(props);

		const { uuid, differentiator } = props;

		this.model = 'company';
		this.uuid = uuid;
		this.differentiator = differentiator?.trim() || '';

	}

}
