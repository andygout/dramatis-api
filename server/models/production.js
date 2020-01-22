import { getDuplicateNameIndices } from '../lib/get-duplicate-name-indices';
import { prepareAsParams } from '../lib/prepare-as-params';
import Base from './base';
import BasicModel from './basic-model';
import PersonCastMember from './person-cast-member';
import Theatre from './theatre';
import { neo4jQuery } from '../neo4j/query';

export default class Production extends Base {

	constructor (props = {}) {

		super(props);

		const { uuid, theatre, playtext, cast } = props;

		this.model = 'production';
		this.uuid = uuid;
		this.theatre = new Theatre(theatre);
		this.playtext = new BasicModel({ model: 'playtext', ...playtext });
		this.cast = cast
			? cast.map(castMember => new PersonCastMember(castMember))
			: [];

	}

	runValidations () {

		this.validate({ requiresName: true });

		this.theatre.validate({ requiresName: true });

		this.playtext.validate();

		const duplicateNameIndices = getDuplicateNameIndices(this.cast);

		this.cast.forEach((castMember, index) =>
			castMember.runValidations({ hasDuplicateName: duplicateNameIndices.includes(index) })
		);

	}

	async createUpdate (getCreateUpdateQuery) {

		this.runValidations();

		this.setErrorStatus();

		if (this.hasErrors) return this;

		const neo4jInstance = await neo4jQuery({ query: getCreateUpdateQuery(), params: prepareAsParams(this) });

		return new this.constructor(neo4jInstance);

	}

}
