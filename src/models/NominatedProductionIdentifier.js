import ProductionIdentifier from './ProductionIdentifier';
import { MODELS } from '../utils/constants';

export default class NominatedProductionIdentifier extends ProductionIdentifier {

	constructor (props = {}) {

		super(props);

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
