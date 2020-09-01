import Base from './Base';

export default class Character extends Base {

	constructor (props = {}) {

		super(props);

		const { uuid, differentiator } = props;

		this.model = 'character';
		this.uuid = uuid;
		this.differentiator = differentiator?.trim() || '';

	}

}
