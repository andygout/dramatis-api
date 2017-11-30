import dbQuery from '../database/db-query';
import prepareAsParams from '../lib/prepare-as-params';
import verifyErrorPresence from '../lib/verify-error-presence';
import Base from './base';
import Character from './character';

export default class Playtext extends Base {

	constructor (props = {}) {

		super(props);

		Object.defineProperty(this, 'model', {
			get: function () { return 'playtext'; }
		});

		this.characters = props.characters ?
			props.characters.filter(character => character.name.length).map(character => new Character(character)) :
			[];
		this.productions = [];

	}

	setErrorStatus () {

		this.validate({ required: true });

		this.characters.forEach(character => character.validate());

		return this.hasError = verifyErrorPresence(this);

	}

	createUpdate (getCreateUpdateQuery) {

		if (this.setErrorStatus()) return Promise.resolve({ instance: this });

		return this.validateInDb()
			.then(() => {

				this.hasError = verifyErrorPresence(this);

				if (this.hasError) return Promise.resolve({ instance: this });

				return dbQuery({ query: getCreateUpdateQuery(), params: prepareAsParams(this) });

			});

	}

}
