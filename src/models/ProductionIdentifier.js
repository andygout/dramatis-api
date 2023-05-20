import Entity from './Entity';
import { validationQueries } from '../neo4j/cypher-queries';
import { neo4jQuery } from '../neo4j/query';
import { MODELS } from '../utils/constants';

export default class ProductionIdentifier extends Entity {

	constructor (props = {}) {

		super(props);

		this.uuid = props.uuid?.trim() || '';

	}

	get model () {

		return MODELS.PRODUCTION_IDENTIFIER;

	}

	validateUuid () {

		this.validateStringForProperty('uuid', { isRequired: false });

	}

	async runDatabaseValidations () {

		if (this.uuid) {

			try {

				await this.confirmExistenceInDatabase({ model: MODELS.PRODUCTION });

			} catch (error) {

				if (error.message === 'Not Found') {

					this.addPropertyError('uuid', 'Production with this UUID does not exist');

				} else {

					throw error;

				}

			}

		}

		return;

	}

	async runSubProductionDatabaseValidations ({ subjectProductionUuid = null }) {

		if (this.uuid) {

			const { getSubProductionChecksQuery } = validationQueries;

			const {
				exists,
				isAssignedToSurProduction,
				isSurSurProduction,
				isSurProductionOfSubjectProduction,
				isSubjectProductionASubSubProduction
			} = await neo4jQuery({
				query: getSubProductionChecksQuery(),
				params: { uuid: this.uuid, subjectProductionUuid }
			});

			if (!exists) {
				this.addPropertyError('uuid', 'Production with this UUID does not exist');
			}

			if (isAssignedToSurProduction) {
				this.addPropertyError(
					'uuid',
					'Production with this UUID is already assigned to another sur-production'
				);
			}

			if (isSurSurProduction) {
				this.addPropertyError(
					'uuid',
					'Production with this UUID is the sur-most production of a three-tiered production collection'
				);
			}

			if (isSurProductionOfSubjectProduction) {
				this.addPropertyError('uuid', 'Production with this UUID is this production\'s sur-production');
			}

			if (isSubjectProductionASubSubProduction) {
				this.addPropertyError(
					'uuid',
					'Sub-production cannot be assigned to a three-tiered production collection'
				);
			}

		}

		return;

	}

}
