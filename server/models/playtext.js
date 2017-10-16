import { getEditQuery, getUpdateQuery, getShowQuery } from '../database/cypher-queries/playtext';
import { getValidateUpdateQuery, getDeleteQuery, getListQuery } from '../database/cypher-queries/shared';
import dbQuery from '../database/db-query';
import prepareAsParams from '../lib/prepare-as-params';
import trimStrings from '../lib/trim-strings';
import validateString from '../lib/validate-string';
import verifyErrorPresence from '../lib/verify-error-presence';
import Character from './character';

export default class Playtext {

	constructor (props = {}) {

		Object.defineProperty(this, 'model', {
			get: function () { return 'playtext'; }
		});

		this.uuid = props.uuid;
		this.name = props.name;
		this.pageTitle = props.pageTitle;
		this.characters = props.characters ?
			props.characters.filter(character => character.name.length).map(character => new Character(character)) :
			[];
		this.productions = [];
		this.hasError = false;
		this.errors = {};

	};

	validate (opts = {}) {

		trimStrings(this);

		const nameErrors = validateString(this.name, opts);

		if (nameErrors.length) this.errors.name = nameErrors;

	};

	validateUpdateInDb () {

		return dbQuery({ query: getValidateUpdateQuery(this.model), params: this })
			.then(({ instanceCount }) => {

				if (instanceCount > 0) this.errors.name = ['Name already exists'];

			});

	};

	setErrorStatus () {

		this.validate({ required: true });

		this.characters.forEach(character => character.validate());

		return this.hasError = verifyErrorPresence(this);

	};

	edit () {

		return dbQuery({ query: getEditQuery(), params: this });

	};

	update () {

		if (this.setErrorStatus()) return Promise.resolve({ playtext: this });

		return this.validateUpdateInDb()
			.then(() => {

				this.hasError = verifyErrorPresence(this);

				if (this.hasError) return Promise.resolve({ playtext: this });

				return dbQuery({ query: getUpdateQuery(), params: prepareAsParams(this) });

			});

	};

	delete () {

		return dbQuery({ query: getDeleteQuery(this.model), params: this });

	};

	show () {

		return dbQuery({ query: getShowQuery(), params: this });

	};

	static list () {

		return dbQuery({ query: getListQuery('playtext') });

	};

};
