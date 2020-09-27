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

	hasDifferentiatorProperty () {

		return Object.prototype.hasOwnProperty.call(this, 'differentiator');

	}

	runInputValidations () {

		this.validateName({ isRequired: true });

		this.validateDifferentiator();

	}

	validateName (opts) {

		this.validateStringForProperty('name', { isRequired: opts.isRequired });

	}

	validateDifferentiator () {

		this.validateStringForProperty('differentiator', { isRequired: false });

	}

	validateQualifier () {

		this.validateStringForProperty('qualifier', { isRequired: false });

	}

	validateStringForProperty (property, opts) {

		const stringErrorText = validateString(this[property], { isRequired: opts.isRequired });

		if (stringErrorText) this.addPropertyError(property, stringErrorText);

	}

	validateUniquenessInGroup (opts) {

		if (opts.isDuplicate) {

			const uniquenessErrorMessage = 'This item has been duplicated within the group';

			const properties = [
				'name',
				'differentiator',
				'characterDifferentiator',
				'qualifier',
				'group'
			];

			properties.forEach(property => {

				if (Object.prototype.hasOwnProperty.call(this, property))
					this.addPropertyError(property, uniquenessErrorMessage);

			});

		}

	}

	async runDatabaseValidations () {

		await this.validateUniquenessInDatabase();

	}

	async validateUniquenessInDatabase () {

		const { getDuplicateRecordCountQuery } = sharedQueries;

		const preparedParams = prepareAsParams(this);

		const { instanceCount } = await neo4jQuery({
			query: getDuplicateRecordCountQuery(this.model),
			params: {
				uuid: preparedParams.uuid,
				name: preparedParams.name,
				differentiator: preparedParams.differentiator
			}
		});

		if (instanceCount > 0) {

			const uniquenessErrorMessage = 'Name and differentiator combination already exists';

			this.addPropertyError('name', uniquenessErrorMessage);
			this.addPropertyError('differentiator', uniquenessErrorMessage);

		}

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
			params: { uuid: this.uuid }
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
			params: { uuid: this.uuid }
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

		const { model, name, differentiator, isDeleted, associatedModels } = await neo4jQuery({
			query: getDeleteQuery(this.model),
			params: { uuid: this.uuid }
		});

		if (isDeleted) {

			return new this.constructor({
				model,
				name,
				...(this.hasDifferentiatorProperty() && { differentiator })
			});

		}

		this.name = name;

		if (this.hasDifferentiatorProperty()) this.differentiator = differentiator;

		associatedModels.forEach(associatedModel => this.addPropertyError('associations', associatedModel));

		this.setErrorStatus();

		return this;

	}

	show () {

		return neo4jQuery({
			query: getShowQueries[this.model](),
			params: { uuid: this.uuid }
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
