import { validateString } from '../lib/validate-string';
import Base from './Base';

export default class Role extends Base {

	constructor (props = {}) {

		super(props);

		this.model = 'role';
		this.characterName = props.characterName.trim();

	}

	validateCharacterName (opts) {

		const characterNameErrorText =
			validateString(this.characterName, { isRequiredString: opts.requiresCharacterName });

		if (characterNameErrorText) this.addPropertyError('characterName', characterNameErrorText);

	}

}
