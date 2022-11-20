import Entity from './Entity';
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

	validateNoAssociationWithSelf (associationUuid) {

		const hasAssociationWithSelf = this.uuid === associationUuid;

		if (hasAssociationWithSelf) {

			this.addPropertyError('uuid', 'Instance cannot form association with itself');

		}

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

}
