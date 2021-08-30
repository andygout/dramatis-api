import Entity from './Entity';
import { MODELS } from '../utils/constants';

export default class MaterialBase extends Entity {

	constructor (props = {}) {

		super(props);

	}

	get model () {

		return MODELS.MATERIAL;

	}

}
