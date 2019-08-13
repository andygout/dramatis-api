import validateString from '../lib/validate-string';

export default class Role {

	constructor (props = {}) {

		Object.defineProperty(this, 'model', {
			get: function () { return 'role'; }
		});

		this.name = props.name.trim();
		this.characterName = props.characterName && props.characterName.trim().length
			? props.characterName.trim()
			: null;
		this.errors = {};

	}

	validate (opts = {}) {

		const nameErrors = validateString(this.name, opts);

		if (nameErrors.length) this.errors.name = nameErrors;

		const characterNameErrors = validateString(this.characterName, opts);

		if (characterNameErrors.length) this.errors.characterName = characterNameErrors;

	}

}
