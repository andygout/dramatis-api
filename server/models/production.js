import { prepareAsParams } from '../lib/prepare-as-params';
import Base from './base';
import PersonCastMember from './person-cast-member';
import Theatre from './theatre';
import { neo4jQuery } from '../neo4j/query';

export default class Production extends Base {

	constructor (props = {}) {

		super(props);

		this.model = 'production';
		this.theatre = new Theatre(props.theatre);
		this.playtext = new Base({ model: 'playtext', ...props.playtext });
		this.cast = props.cast
			? props.cast.map(castMember => new PersonCastMember(castMember))
			: [];

	}

	runValidations () {

		this.validate({ requiresName: true });

		this.theatre.validate({ requiresName: true });

		this.playtext.validate();

		this.cast.forEach(castMember => {

			castMember.validate();

			castMember.roles.forEach(role => role.validate());

		});

	}

	async createUpdate (getCreateUpdateQuery) {

		this.runValidations();

		this.setErrorStatus();

		if (this.hasErrors) return this;

		const neo4jInstance = await neo4jQuery({ query: getCreateUpdateQuery(), params: prepareAsParams(this) });

		return new this.constructor(neo4jInstance);

	}

}
