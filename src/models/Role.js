import Base from './Base';

export default class Role extends Base {

	constructor (props = {}) {

		super(props);

		this.model = 'role';
		this.characterName = props.characterName?.trim() || '';
		this.qualifier = props.qualifier?.trim() || '';

	}

	validateCharacterName () {

		this.validateStringForProperty('characterName', { isRequired: false });

	}

	validateCharacterNameHasRoleName () {

		if (!!this.characterName && !this.name) {

			this.addPropertyError('name', 'Role name is required when character name is present');

		}

	}

	validateRoleNameCharacterNameDisparity () {

		if (!!this.characterName && this.name === this.characterName) {

			this.addPropertyError('characterName', 'Character name is only required if different from role name');

		}

	}

}
