import Base from './Base';

export default class Character extends Base {

	constructor (props = {}) {

		super(props);

		const { uuid, differentiator, underlyingName, qualifier, isAssociation } = props;

		this.model = 'character';
		this.uuid = uuid;

		// Property assignment order in contructor dictates order of fields in CMS form
		// where `underlyingName` is desired directly after `name`.
		if (isAssociation) this.underlyingName = underlyingName?.trim() || '';

		this.differentiator = differentiator?.trim() || '';

		if (isAssociation) this.qualifier = qualifier?.trim() || '';

	}

	validateUnderlyingName () {

		this.validateStringForProperty('underlyingName', { isRequired: false });

	}

	validateCharacterNameUnderlyingNameDisparity () {

		if (!!this.underlyingName && this.name === this.underlyingName) {

			this.addPropertyError('underlyingName', 'Underlying name is only required if different from character name');

		}

	}

}
