import { getDuplicateRoleIndices } from '../lib/get-duplicate-indices';
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

		this.validateName({ isRequired: false });

		this.validateDifferentiator();

		this.validateUniquenessInGroup({ isDuplicate: opts.isDuplicate });

		this.validateNamePresenceIfRoles();

		const duplicateRoleIndices = getDuplicateRoleIndices(this.roles);

		this.roles.forEach((role, index) => {

			role.validateName({ isRequired: false });

			role.validateCharacterName();

			role.validateCharacterDifferentiator();

			role.validateQualifier();

			role.validateRoleNameCharacterNameDisparity();

			role.validateUniquenessInGroup({ isDuplicate: duplicateRoleIndices.includes(index) });

		});

	}

	validateNamePresenceIfRoles () {

		if (this.name === '' && this.roles.some(role => !!role.name)) {

			this.addPropertyError('name', 'Name is required if cast member has named roles');

		}

	}

}
