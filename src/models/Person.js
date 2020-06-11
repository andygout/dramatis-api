import Base from './Base';

export default class Person extends Base {

	constructor (props = {}) {

		super(props);

		this.model = 'person';
		this.uuid = props.uuid;

	}

}
