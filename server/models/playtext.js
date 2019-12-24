import { prepareAsParams } from '../lib/prepare-as-params';
import Base from './base';
import Character from './character';
import { neo4jQuery } from '../neo4j/query';

export default class Playtext extends Base {

	constructor (props = {}) {

		super(props);

		this.model = 'playtext';
		this.characters = props.characters
			? props.characters.map(character => new Character(character))
			: [];

	}

	runValidations () {

		this.validate({ requiresName: true });

		this.characters.forEach(character => character.validate());

	}

	async createUpdate (getCreateUpdateQuery) {

		this.runValidations();

		this.setErrorStatus();

		if (this.hasErrors) return this;

		await this.validateInDb();

		this.setErrorStatus();

		if (this.hasErrors) return this;

		const neo4jInstance = await neo4jQuery({ query: getCreateUpdateQuery(), params: prepareAsParams(this) });

		return new this.constructor(neo4jInstance);

	}

}
