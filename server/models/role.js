import trimStrings from '../lib/trim-strings';
import validateString from '../lib/validate-string';

export default class Role {

	constructor (props = {}) {

		Object.defineProperty(this, 'model', {
			get: function () { return 'role'; }
		});

		this.name = props.name;
		this.characterName = (props.characterName && props.characterName.length) ? props.characterName : null;
		this.hasError = false;
		this.errors = {};

	}

	validate (opts = {}) {

		trimStrings(this);

		const nameErrors = validateString(this.name, opts);

		if (nameErrors.length) this.errors.name = nameErrors;

		const characterNameErrors = validateString(this.characterName, opts);

		if (characterNameErrors.length) this.errors.characterName = characterNameErrors;

	}

}
