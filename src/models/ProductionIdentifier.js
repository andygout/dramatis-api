import { getTrimmedOrEmptyString } from '../lib/strings';
import Entity from './Entity';
import { MODELS } from '../utils/constants';

export default class ProductionIdentifier extends Entity {

	constructor (props = {}) {

		super(props);

		this.uuid = getTrimmedOrEmptyString(props.uuid);

	}

	get model () {

		return MODELS.PRODUCTION_IDENTIFIER;

	}

	validateUuid () {

		this.validateStringForProperty('uuid', { isRequired: false });

	}

}
