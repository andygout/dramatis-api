import Base from './Base';

export default class Character extends Base {

	constructor (props = {}) {

		super(props);

		const { uuid, differentiator, qualifier, isAssociation } = props;

		this.model = 'character';
		this.uuid = uuid;
		this.differentiator = differentiator?.trim() || '';

		if (isAssociation) this.qualifier = qualifier?.trim() || '';

	}

}
