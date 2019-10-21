import { hasErrors } from '../lib/has-errors';
import { prepareAsParams } from '../lib/prepare-as-params';
import Base from './base';
import Person from './person';
import Playtext from './playtext';
import Theatre from './theatre';
import { neo4jQuery } from '../neo4j/query';

export default class Production extends Base {

	constructor (props = {}) {

		super(props);

		Object.defineProperty(this, 'model', {
			get: function () { return 'production'; }
		});

		this.theatre = new Theatre(props.theatre);
		this.playtext = new Playtext(props.playtext);
		this.cast = props.cast
			? props.cast
				.filter(castMember => castMember.name.trim().length)
				.map(castMember => new Person(castMember))
			: [];

	}

	setErrorStatus () {

		this.validate({ requiresName: true });

		this.theatre.validate({ requiresName: true });

		this.playtext.validate();

		this.cast.forEach(castMember => {

			castMember.validate();

			castMember.roles.forEach(role => role.validate());

		});

		return this.hasErrors = hasErrors(this);

	}

	createUpdate (getCreateUpdateQuery) {

		if (this.setErrorStatus()) return this;

		return neo4jQuery({ query: getCreateUpdateQuery(), params: prepareAsParams(this) });

	}

}
