import Base from './base';

export default class BasicModel extends Base {

	constructor (props = {}) {

		super(props);

		const { model, uuid } = props;

		this.model = model;
		this.uuid = uuid;

	}

}
