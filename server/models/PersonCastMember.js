import { getDuplicateNameIndices } from '../lib/get-duplicate-name-indices';
import Base from './Base';
import { Role } from '.';

export default class PersonCastMember extends Base {

	constructor (props = {}) {

		super(props);

		const { uuid, roles } = props;

		this.model = 'person';
		this.uuid = uuid;
		this.roles = roles
			? roles.map(role => new Role(role))
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
