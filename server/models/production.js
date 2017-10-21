import {
	getCreateQuery,
	getEditQuery,
	getUpdateQuery,
	getDeleteQuery,
	getShowQuery
} from '../database/cypher-queries/production';
import { getListQuery } from '../database/cypher-queries/shared';
import dbQuery from '../database/db-query';
import prepareAsParams from '../lib/prepare-as-params';
import trimStrings from '../lib/trim-strings';
import validateString from '../lib/validate-string';
import verifyErrorPresence from '../lib/verify-error-presence';
import Person from './person';
import Playtext from './playtext';
import Theatre from './theatre';

export default class Production {

	constructor (props = {}) {

		Object.defineProperty(this, 'model', {
			get: function () { return 'production'; }
		});

		this.uuid = props.uuid;
		this.name = props.name;
		this.pageTitle = props.pageTitle;
		this.documentTitle = props.documentTitle;
		this.theatre = new Theatre(props.theatre);
		this.playtext = new Playtext(props.playtext);
		this.cast = props.cast ?
			props.cast.filter(castMember => castMember.name.length).map(castMember => new Person(castMember)) :
			[];
		this.hasError = false;
		this.errors = {};

	};

	validate (opts = {}) {

		trimStrings(this);

		const nameErrors = validateString(this.name, opts);

		if (nameErrors.length) this.errors.name = nameErrors;

	};

	setErrorStatus () {

		this.validate({ required: true });

		this.theatre.validate({ required: true });

		this.playtext.validate();

		this.cast.forEach(castMember => {

			castMember.validate();

			castMember.roles.forEach(role => role.validate());

		});

		return this.hasError = verifyErrorPresence(this);

	};

	create () {

		if (this.setErrorStatus()) return Promise.resolve({ production: this });

		return dbQuery({ query: getCreateQuery(), params: prepareAsParams(this) });

	};

	edit () {

		return dbQuery({ query: getEditQuery(), params: this });

	};

	update () {

		if (this.setErrorStatus()) return Promise.resolve({ production: this });

		return dbQuery({ query: getUpdateQuery(), params: prepareAsParams(this) });

	};

	delete () {

		return dbQuery({ query: getDeleteQuery(), params: this });

	};

	show () {

		return dbQuery({ query: getShowQuery(), params: this });

	};

	static list () {

		return dbQuery({ query: getListQuery('production') });

	};

};
