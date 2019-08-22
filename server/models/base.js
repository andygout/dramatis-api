import { prepareAsParams } from '../lib/prepare-as-params';
import { validateString } from '../lib/validate-string';
import { verifyErrorPresence } from '../lib/verify-error-presence';
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

		this.uuid = props.uuid;
		this.name = props.name && props.name.trim() || '';
		this.errors = {};

	}

	validate (opts = {}) {

		const nameErrors = validateString(this.name, opts);

		if (nameErrors.length) this.errors.name = nameErrors;

	}

	async validateInDb () {

		const { instanceCount } = await neo4jQuery({ query: getValidateQuery(this.model, this.uuid), params: this });

		if (instanceCount > 0) this.errors.name = ['Name already exists'];

	}

	async createUpdate (getCreateUpdateQuery) {

		this.validate({ required: true });

		this.hasError = verifyErrorPresence(this);

		if (this.hasError) return this;

		await this.validateInDb();

		this.hasError = verifyErrorPresence(this);

		if (this.hasError) return this;

		return neo4jQuery({ query: getCreateUpdateQuery(this.model), params: prepareAsParams(this) });

	}

	create () {

		return this.createUpdate(getCreateQueries[this.model] || getCreateQuery);

	}

	edit () {

		return neo4jQuery({
			query: (getEditQueries[this.model] && getEditQueries[this.model]()) || getEditQuery(this.model),
			params: this
		});

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
