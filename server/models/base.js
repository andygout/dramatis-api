import {
	getValidateQuery,
	getCreateQuery,
	getEditQuery,
	getUpdateQuery,
	getDeleteQuery,
	getShowQueries,
	getListQuery
} from '../database/cypher-queries/shared';
import dbQuery from '../database/db-query';
import prepareAsParams from '../lib/prepare-as-params';
import trimStrings from '../lib/trim-strings';
import validateString from '../lib/validate-string';
import verifyErrorPresence from '../lib/verify-error-presence';

const resolvePromiseWithInstance = instance => {

	const instanceObject = {};

	instanceObject[instance.model] = instance;

	return Promise.resolve(instanceObject);

};

export default class Base {

	constructor (props = {}) {

		this.uuid = props.uuid;
		this.name = props.name;
		this.pageTitle = props.pageTitle;
		this.hasError = false;
		this.errors = {};

	}

	validate (opts = {}) {

		trimStrings(this);

		const nameErrors = validateString(this.name, opts);

		if (nameErrors.length) this.errors.name = nameErrors;

	}

	validateInDb () {

		return dbQuery({ query: getValidateQuery(this.model), params: this })
			.then(({ instanceCount }) => {

				if (instanceCount > 0) this.errors.name = ['Name already exists'];

			});

	}

	createUpdate (getCreateUpdateQuery) {

		this.validate({ required: true });

		this.hasError = verifyErrorPresence(this);

		if (this.hasError) return resolvePromiseWithInstance(this);

		return this.validateInDb()
			.then(() => {

				this.hasError = verifyErrorPresence(this);

				if (this.hasError) return resolvePromiseWithInstance(this);

				return dbQuery({ query: getCreateUpdateQuery(this.model), params: prepareAsParams(this) });

			});

	}

	create () {

		return this.createUpdate(getCreateQuery);

	}

	edit () {

		return dbQuery({ query: getEditQuery(this.model), params: this });

	}

	update () {

		return this.createUpdate(getUpdateQuery);

	}

	delete () {

		return dbQuery({ query: getDeleteQuery(this.model), params: this });

	}

	show () {

		return dbQuery({ query: getShowQueries[this.model](), params: this });

	}

	static list (model) {

		return dbQuery({ query: getListQuery(model) });

	}

}
