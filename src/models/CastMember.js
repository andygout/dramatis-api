import { getDuplicateNameIndices } from '../lib/get-duplicate-name-indices';
import Person from './Person';
import { Role } from '.';

export default class CastMember extends Person {

	constructor (props = {}) {

		super(props);

		const { roles } = props;

		this.roles = roles
			? roles.map(role => new Role(role))
			: [];

	}

	runInputValidations (opts) {

		this.validateName({ requiresName: false });

		this.validateNameUniquenessInGroup({ hasDuplicateName: opts.hasDuplicateName });

		this.validateNamePresenceIfRoles();

		const duplicateNameIndices = getDuplicateNameIndices(this.roles);

		this.roles.forEach((role, index) => {

			role.validateName({ requiresName: false });

			role.validateCharacterName({ requiresCharacterName: false });

			role.validateCharacterNameHasRoleName();

			role.validateRoleNameCharacterNameDisparity();

			role.validateNameUniquenessInGroup({ hasDuplicateName: duplicateNameIndices.includes(index) });

		});

	}

	validateNamePresenceIfRoles () {

		if (this.name === '' && this.roles.some(role => !!role.name)) {

			this.addPropertyError('name', 'Name is required if cast member has named roles');

		}

	}

}
