import Base from './Base';

export default class Character extends Base {

	constructor (props = {}) {

		super(props);

		const { uuid, differentiator, underlyingName, qualifier, group, isAssociation } = props;

		this.model = 'character';
		this.uuid = uuid;

		// Property assignment order in contructor dictates order of fields in CMS form
		// where `underlyingName` is desired directly after `name`.
		if (isAssociation) this.underlyingName = underlyingName?.trim() || '';

		this.differentiator = differentiator?.trim() || '';

		if (isAssociation) {

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
