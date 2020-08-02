import { hasErrors } from '../lib/has-errors';
import { prepareAsParams } from '../lib/prepare-as-params';
import { validateString } from '../lib/validate-string';
import {
	getCreateQueries,
	getEditQueries,
	getUpdateQueries,
	getShowQueries,
	sharedQueries
} from '../neo4j/cypher-queries';
import { neo4jQuery } from '../neo4j/query';

export default class Base {

	constructor (props = {}) {

		this.name = props.name?.trim() || '';
		this.errors = {};

	}

	runInputValidations () {

		this.validateName({ requiresName: true });

	}

	validateName (opts) {

		const nameErrorText = validateString(this.name, { isRequiredString: opts.requiresName });

		if (nameErrorText) this.addPropertyError('name', nameErrorText);

	}

	validateNameUniquenessInGroup (opts) {

		if (opts.hasDuplicateName) this.addPropertyError('name', 'Name has been duplicated in this group');

	}

	async runDatabaseValidations () {

		await this.validateNameUniquenessInDatabase();

	}

	async validateNameUniquenessInDatabase () {

		const { getDuplicateNameCountQuery } = sharedQueries;

		const { instanceCount } = await neo4jQuery({
			query: getDuplicateNameCountQuery(this.model, this.uuid),
			params: this
		});

		if (instanceCount > 0) this.addPropertyError('name', 'Name already exists');

	}

	addPropertyError (property, errorText) {

		this.errors[property]
			? this.errors[property].push(errorText)
			: this.errors[property] = [errorText];

	}

	setErrorStatus () {

		this.hasErrors = hasErrors(this);

	}

	async confirmExistenceInDatabase () {

		const { getExistenceQuery } = sharedQueries;

		await neo4jQuery({
			query: getExistenceQuery(this.model),
			params: this
		});

	}

	async createUpdate (getCreateUpdateQuery) {

		this.runInputValidations();

		await this.runDatabaseValidations();

		this.setErrorStatus();

		if (this.hasErrors) return this;

		const neo4jInstance = await neo4jQuery({
			query: getCreateUpdateQuery(this.model),
			params: prepareAsParams(this)
		});

		return new this.constructor(neo4jInstance);

	}

	create () {

		const { getCreateQuery } = sharedQueries;

		return this.createUpdate(getCreateQueries[this.model] || getCreateQuery);

	}

	async edit () {

		const { getEditQuery } = sharedQueries;

		const neo4jInstance = await neo4jQuery({
			query: (getEditQueries[this.model]?.()) || getEditQuery(this.model),
			params: this
		});

		return new this.constructor(neo4jInstance);

	}

	async update () {

		await this.confirmExistenceInDatabase();

		const { getUpdateQuery } = sharedQueries;

		return this.createUpdate(getUpdateQueries[this.model] || getUpdateQuery);

	}

	async delete () {

		const { getDeleteQuery } = sharedQueries;

		const { model, name, isDeleted, associatedModels } = await neo4jQuery({
			query: getDeleteQuery(this.model),
			params: this
		});

		if (isDeleted) return { model, name };

		this.name = name;

		associatedModels.forEach(associatedModel =>
			this.addPropertyError('associations', associatedModel)
		);

		this.setErrorStatus();

		return this;

	}

	show () {

		return neo4jQuery({
			query: getShowQueries[this.model](),
			params: this
		});

	}

	static list (model) {

		const { getListQuery } = sharedQueries;

		return neo4jQuery(
			{
				query: getListQuery(model)
			},
			{
				isOptionalResult: true,
				isArrayResult: true
			}
		);

	}

}
