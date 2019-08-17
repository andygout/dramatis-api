import prepareAsParams from '../lib/prepare-as-params';
import verifyErrorPresence from '../lib/verify-error-presence';
import Base from './base';
import Character from './character';
import neo4jQuery from '../neo4j/query';

export default class Playtext extends Base {

	constructor (props = {}) {

		super(props);

		Object.defineProperty(this, 'model', {
			get: function () { return 'playtext'; }
		});

		this.characters = props.characters
			? props.characters
				.filter(character => character.name.trim().length)
				.map(character => new Character(character))
			: [];
		this.productions = [];

	}

	setErrorStatus () {

		this.validate({ required: true });

		this.characters.forEach(character => character.validate());

		return this.hasError = verifyErrorPresence(this);

	}

	async createUpdate (getCreateUpdateQuery) {

		if (this.setErrorStatus()) return this;

		await this.validateInDb();

		this.hasError = verifyErrorPresence(this);

		if (this.hasError) return this;

		return neo4jQuery({ query: getCreateUpdateQuery(), params: prepareAsParams(this) });

	}

}
