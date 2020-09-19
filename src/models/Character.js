import Base from './Base';

export default class Character extends Base {

	constructor (props = {}) {

		super(props);

		const { uuid, differentiator, qualifier, group, isAssociation } = props;

		this.model = 'character';
		this.uuid = uuid;
		this.differentiator = differentiator?.trim() || '';

		if (isAssociation) {

			this.qualifier = qualifier?.trim() || '';
			this.group = group?.trim() || '';

		}

	}

	validateGroup () {

		this.validateStringForProperty('group', { isRequired: false });

	}

}
