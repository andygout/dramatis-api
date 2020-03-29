import Base from './Base';

export default class Character extends Base {

	constructor (props = {}) {

		super(props);

		this.model = 'character';
		this.uuid = props.uuid;

	}

}
