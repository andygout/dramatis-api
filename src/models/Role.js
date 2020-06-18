import { validateString } from '../lib/validate-string';
import Base from './Base';

export default class Role extends Base {

	constructor (props = {}) {

		super(props);

		this.model = 'role';
		this.characterName = props.characterName.trim();

	}

	validateCharacterName (opts) {

		const characterNameErrors = validateString(this.characterName, opts.requiresCharacterName);

		if (characterNameErrors.length) this.errors.characterName = characterNameErrors;

	}

}
