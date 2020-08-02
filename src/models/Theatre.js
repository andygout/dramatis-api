import Base from './Base';

export default class Theatre extends Base {

	constructor (props = {}) {

		super(props);

		this.model = 'theatre';
		this.uuid = props.uuid;

	}

}
