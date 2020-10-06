import Base from './Base';

export default class Character extends Base {

	constructor (props = {}) {

		super(props);

		const { uuid, differentiator, underlyingName, qualifier, group, isAssociation } = props;

		this.model = 'character';
		this.uuid = uuid;
		this.differentiator = differentiator?.trim() || '';

		if (isAssociation) {

			this.underlyingName = underlyingName?.trim() || '';
			this.qualifier = qualifier?.trim() || '';
			this.group = group?.trim() || '';

		}

	}

	validateUnderlyingName () {

		this.validateStringForProperty('underlyingName', { isRequired: false });

	}

	validateGroup () {

		this.validateStringForProperty('group', { isRequired: false });

	}

}
