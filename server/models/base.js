import {
	getCreateQueries,
	getEditQueries,
	getUpdateQueries,
	getDeleteQueries,
	getShowQueries
} from '../database/cypher-queries/model-query-maps';
import {
	getValidateQuery,
	getCreateQuery,
	getEditQuery,
	getUpdateQuery,
	getDeleteQuery,
	getListQuery
} from '../database/cypher-queries/shared';
import dbQuery from '../database/db-query';
import prepareAsParams from '../lib/prepare-as-params';
import trimStrings from '../lib/trim-strings';
import validateString from '../lib/validate-string';
import verifyErrorPresence from '../lib/verify-error-presence';

export default class Base {

	constructor (props = {}) {

		this.uuid = props.uuid;
		this.name = props.name || '';
		this.errors = {};

	}

	validate (opts = {}) {

		trimStrings(this);

		const nameErrors = validateString(this.name, opts);

		if (nameErrors.length) this.errors.name = nameErrors;

	}

	validateInDb () {

		return dbQuery({ query: getValidateQuery(this.model, this.uuid), params: this })
			.then(({ instanceCount }) => {

				if (instanceCount > 0) this.errors.name = ['Name already exists'];

			});

	}

	createUpdate (getCreateUpdateQuery) {

		this.validate({ required: true });

		this.hasError = verifyErrorPresence(this);

		if (this.hasError) return Promise.resolve(this);

		return this.validateInDb()
			.then(() => {

				this.hasError = verifyErrorPresence(this);

				if (this.hasError) return Promise.resolve(this);

				return dbQuery({ query: getCreateUpdateQuery(this.model), params: prepareAsParams(this) });

			});

	}

	create () {

		return this.createUpdate(getCreateQueries[this.model] || getCreateQuery);

	}

	edit () {

		return dbQuery({
			query: (getEditQueries[this.model] && getEditQueries[this.model]()) || getEditQuery(this.model),
			params: this
		});

	}

	update () {

		return this.createUpdate(getUpdateQueries[this.model] || getUpdateQuery);

	}

	delete () {

		return dbQuery({
			query: (getDeleteQueries[this.model] && getDeleteQueries[this.model]()) || getDeleteQuery(this.model),
			params: this
		});

	}

	show () {

		return dbQuery({ query: getShowQueries[this.model](), params: this });

	}

	static list (model) {

		return dbQuery({ query: getListQuery(model) }, { isReqdResult: false, returnArray: true });

	}

}
