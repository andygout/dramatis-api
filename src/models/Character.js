import Base from './Base';

export default class Character extends Base {

	constructor (props = {}) {

		super(props);

		const { uuid, differentiator, underlyingName, qualifier, isAssociation } = props;

		this.uuid = uuid;
		this.differentiator = differentiator?.trim() || '';

		if (isAssociation) {

			this.underlyingName = underlyingName?.trim() || '';
			this.qualifier = qualifier?.trim() || '';

		}

	}

	get model () {

		return 'character';

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
