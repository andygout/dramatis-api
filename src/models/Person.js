import Base from './Base';

export default class Person extends Base {

	constructor (props = {}) {

		super(props);

		const { uuid, differentiator } = props;

		this.model = 'person';
		this.uuid = uuid;
		this.differentiator = differentiator?.trim() || '';

	}

}
