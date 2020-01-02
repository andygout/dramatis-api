import { getDuplicateNameIndices } from '../lib/get-duplicate-name-indices';
import Base from './base';
import Role from './role';

export default class PersonCastMember extends Base {

	constructor (props = {}) {

		super(props);

		this.model = 'person';
		this.roles = props.roles
			? props.roles.map(role => new Role(role))
			: [];

	}

	runValidations (opts) {

		this.validateGroupItem({ ...opts, requiresName: false });

		const duplicateNameIndices = getDuplicateNameIndices(this.roles);

		this.roles.forEach((role, index) => {

			role.validateGroupItem({ hasDuplicateName: duplicateNameIndices.includes(index), requiresName: false });

			role.validateCharacterName({ requiresCharacterName: false });

		});

	}

}
