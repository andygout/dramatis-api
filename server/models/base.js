import { hasErrors } from '../lib/has-errors';
import { prepareAsParams } from '../lib/prepare-as-params';
import { validateString } from '../lib/validate-string';
import {
	getCreateQueries,
	getEditQueries,
	getUpdateQueries,
	getDeleteQueries,
	getShowQueries
} from '../neo4j/cypher-queries/model-query-maps';
import {
	getValidateQuery,
	getCreateQuery,
	getEditQuery,
	getUpdateQuery,
	getDeleteQuery,
	getListQuery
} from '../neo4j/cypher-queries/shared';
import { neo4jQuery } from '../neo4j/query';

export default class Base {

	constructor (props = {}) {

		const { model, uuid, name } = props;

		if (model) this.model = model;

		this.uuid = uuid;
		this.name = name && name.trim() || '';
		this.errors = {};

	}

	validate (opts = { requiresName: false }) {

		const nameErrors = validateString(this.name, opts.requiresName);

		if (nameErrors.length) this.errors.name = nameErrors;

	}

	async validateInDb () {

		const { instanceCount } = await neo4jQuery({ query: getValidateQuery(this.model, this.uuid), params: this });

		if (instanceCount > 0) this.errors.name = ['Name already exists'];

	}

	async createUpdate (getCreateUpdateQuery) {

		this.validate({ requiresName: true });

		this.hasErrors = hasErrors(this);

		if (this.hasErrors) return this;

		await this.validateInDb();

		this.hasErrors = hasErrors(this);

		if (this.hasErrors) return this;

		const neo4jInstance = await neo4jQuery({
			query: getCreateUpdateQuery(this.model),
			params: prepareAsParams(this)
		});

		return new this.constructor(neo4jInstance);

	}

	create () {

		return this.createUpdate(getCreateQueries[this.model] || getCreateQuery);

	}

	async edit () {

		const neo4jInstance = await neo4jQuery({
			query: (getEditQueries[this.model] && getEditQueries[this.model]()) || getEditQuery(this.model),
			params: this
		});

		return new this.constructor(neo4jInstance);

	}

	update () {

		return this.createUpdate(getUpdateQueries[this.model] || getUpdateQuery);

	}

	delete () {

		return neo4jQuery({
			query: (getDeleteQueries[this.model] && getDeleteQueries[this.model]()) || getDeleteQuery(this.model),
			params: this
		});

	}

	show () {

		return neo4jQuery({ query: getShowQueries[this.model](), params: this });

	}

	static list (model) {

		return neo4jQuery({ query: getListQuery(model) }, { isReqdResult: false, returnArray: true });

	}

}
