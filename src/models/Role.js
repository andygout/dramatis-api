import Base from './Base';

export default class Role extends Base {

	constructor (props = {}) {

		super(props);

		const { characterName, characterDifferentiator, qualifier } = props;

		this.model = 'role';
		this.characterName = characterName?.trim() || '';
		this.characterDifferentiator = characterDifferentiator?.trim() || '';
		this.qualifier = qualifier?.trim() || '';

	}

	validateCharacterName () {

		this.validateStringForProperty('characterName', { isRequired: false });

	}

	validateCharacterDifferentiator () {

		this.validateStringForProperty('characterDifferentiator', { isRequired: false });

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
