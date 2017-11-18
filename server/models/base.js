import {
	getValidateUpdateQuery,
	getEditQuery,
	getUpdateQuery,
	getShowQueries,
	getListQuery
} from '../database/cypher-queries/shared';
import dbQuery from '../database/db-query';
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

	validateUpdateInDb () {

		return dbQuery({ query: getValidateUpdateQuery(this.model), params: this })
			.then(({ instanceCount }) => {

				if (instanceCount > 0) this.errors.name = ['Name already exists'];

			});

	}

	edit () {

		return dbQuery({ query: getEditQuery(this.model), params: this });

	}

	update () {

		this.validate({ required: true });

		this.hasError = verifyErrorPresence(this);

		if (this.hasError) return resolvePromiseWithInstance(this);

		return this.validateUpdateInDb()
			.then(() => {

				this.hasError = verifyErrorPresence(this);

				if (this.hasError) return resolvePromiseWithInstance(this);

				return dbQuery({ query: getUpdateQuery(this.model), params: this });

			});

	}

	show () {

		return dbQuery({ query: getShowQueries[this.model](), params: this });

	}

	static list (model) {

		return dbQuery({ query: getListQuery(model) });

	}

}
