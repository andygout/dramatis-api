import { getDuplicateNameIndices } from '../lib/get-duplicate-name-indices';
import Person from './Person';
import { Role } from '.';

export default class CastMember extends Person {

	constructor (props = {}) {

		super(props);

		this.roles = props.roles.map(role => new Role(role));

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
