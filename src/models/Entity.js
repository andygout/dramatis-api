import { hasErrors } from '../lib/has-errors';
import { prepareAsParams } from '../lib/prepare-as-params';
import Base from './Base';
import {
	getCreateQueries,
	getEditQueries,
	getUpdateQueries,
	getShowQueries,
	getListQueries,
	sharedQueries
} from '../neo4j/cypher-queries';
import { neo4jQuery } from '../neo4j/query';
import { MODELS } from '../utils/constants';

const DIFFERENTIATOR_EXEMPT_MODELS = new Set([
	MODELS.AWARD_CEREMONY,
	MODELS.PRODUCTION,
	MODELS.PRODUCTION_IDENTIFIER
]);

const ASSOCIATION_WITH_SELF_NON_EMPTY_COMPARISON_KEYS = new Set([
	'uuid',
	'name'
]);

export default class Entity extends Base {

	constructor (props = {}) {

		super(props);

		const { uuid, differentiator } = props;

		this.uuid = uuid;

		if (!DIFFERENTIATOR_EXEMPT_MODELS.has(this.model)) this.differentiator = differentiator?.trim() || '';

	}

	hasDifferentiatorProperty () {

		return Object.prototype.hasOwnProperty.call(this, 'differentiator');

	}

	runInputValidations () {

		this.validateName({ isRequired: true });

		this.validateDifferentiator();

	}

	validateDifferentiator () {

		this.validateStringForProperty('differentiator', { isRequired: false });

	}

	validateNoAssociationWithSelf (association) {

		const hasAssociationWithSelf = Object.entries(association).every(([key, value]) =>
			(ASSOCIATION_WITH_SELF_NON_EMPTY_COMPARISON_KEYS.has(key) ? Boolean(value) : true) &&
			this[key] === value
		);

		if (hasAssociationWithSelf) {

			for (const key of Object.keys(association)) {
				this.addPropertyError(key, 'Instance cannot form association with itself');
			}

		}

	}

	async runDatabaseValidations () {

		await this.validateUniquenessInDatabase();

	}

	async validateUniquenessInDatabase () {

		const { getDuplicateRecordCountQuery } = sharedQueries;

		const preparedParams = prepareAsParams(this);

		const { duplicateRecordCount } = await neo4jQuery({
			query: getDuplicateRecordCountQuery(this.model),
			params: {
				uuid: preparedParams.uuid,
				name: preparedParams.name,
				differentiator: preparedParams.differentiator
			}
		});

		if (duplicateRecordCount > 0) {

			const uniquenessErrorMessage = 'Name and differentiator combination already exists';

			this.addPropertyError('name', uniquenessErrorMessage);
			this.addPropertyError('differentiator', uniquenessErrorMessage);

		}

	}

	setErrorStatus () {

		this.hasErrors = hasErrors(this);

	}

	async confirmExistenceInDatabase (opts = {}) {

		const { getExistenceQuery } = sharedQueries;

		await neo4jQuery({
			query: getExistenceQuery(opts.model || this.model),
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
			query: getEditQueries[this.model]?.() || getEditQuery(this.model),
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

		const { name, differentiator, isDeleted, associatedModels } = await neo4jQuery({
			query: getDeleteQuery(this.model),
			params: { uuid: this.uuid }
		});

		if (isDeleted) {

			return new this.constructor({
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

	async show () {

		const showQueryPromises =
			getShowQueries[this.model]()
				.map(showQuery =>
					neo4jQuery({
						query: showQuery,
						params: { uuid: this.uuid }
					})
				);

		const showQueryResponses = await Promise.all(showQueryPromises);

		return Object.assign({}, ...showQueryResponses);

	}

	static list (model) {

		const { getListQuery } = sharedQueries;

		return neo4jQuery(
			{
				query: getListQueries[model]?.() || getListQuery(model)
			},
			{
				isOptionalResult: true,
				isArrayResult: true
			}
		);

	}

}
