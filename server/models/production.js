import dbQuery from '../database/db-query';
import prepareAsParams from '../lib/prepare-as-params';
import verifyErrorPresence from '../lib/verify-error-presence';
import Base from './base';
import Person from './person';
import Playtext from './playtext';
import Theatre from './theatre';

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
				.filter(castMember => castMember.name.length)
				.map(castMember => new Person(castMember))
			: [];

	}

	setErrorStatus () {

		this.validate({ required: true });

		this.theatre.validate({ required: true });

		this.playtext.validate();

		this.cast.forEach(castMember => {

			castMember.validate();

			castMember.roles.forEach(role => role.validate());

		});

		return this.hasError = verifyErrorPresence(this);

	}

	createUpdate (getCreateUpdateQuery) {

		if (this.setErrorStatus()) return Promise.resolve(this);

		return dbQuery({ query: getCreateUpdateQuery(), params: prepareAsParams(this) });

	}

}
