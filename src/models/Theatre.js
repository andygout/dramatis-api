import Base from './Base';

export default class Theatre extends Base {

	constructor (props = {}) {

		super(props);

		const { uuid, differentiator } = props;

		this.model = 'theatre';
		this.uuid = uuid;
		this.differentiator = differentiator?.trim() || '';

	}

}
