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

	runInputValidations (opts) {

		this.validateName({ requiresName: false });

		this.validateNameUniquenessInGroup({ hasDuplicateName: opts.hasDuplicateName });

		const duplicateNameIndices = getDuplicateNameIndices(this.roles);

		this.roles.forEach((role, index) => {

			role.validateName({ requiresName: false });

			role.validateCharacterName({ requiresCharacterName: false });

			role.validateNameUniquenessInGroup({ hasDuplicateName: duplicateNameIndices.includes(index) });

		});

	}

}
