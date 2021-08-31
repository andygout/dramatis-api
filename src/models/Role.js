import Base from './Base';
import { MODELS } from '../utils/constants';

export default class Role extends Base {

	constructor (props = {}) {

		super(props);

		const { characterName, characterDifferentiator, qualifier, isAlternate } = props;

		this.characterName = characterName?.trim() || '';
		this.characterDifferentiator = characterDifferentiator?.trim() || '';
		this.qualifier = qualifier?.trim() || '';
		this.isAlternate = Boolean(isAlternate) || null;

	}

	get model () {

		return MODELS.ROLE;

	}

	validateCharacterName () {

		this.validateStringForProperty('characterName', { isRequired: false });

	}

	validateCharacterDifferentiator () {

		this.validateStringForProperty('characterDifferentiator', { isRequired: false });

	}

	validateRoleNameCharacterNameDisparity () {

		if (Boolean(this.characterName) && this.name === this.characterName) {

			this.addPropertyError('characterName', 'Character name is only required if different from role name');

		}

	}

}
