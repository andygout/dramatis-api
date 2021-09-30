import { isEntityInArray } from '../lib/get-duplicate-entity-info';
import Company from './Company';
import { Person } from '.';

export default class CompanyWithNominatedMembers extends Company {

	constructor (props = {}) {

		super(props);

		const { nominatedMembers } = props;

		this.nominatedMembers = nominatedMembers
			? nominatedMembers.map(nominatedMember => new Person(nominatedMember))
			: [];

	}

	runInputValidations (opts) {

		this.validateNamePresenceIfNamedChildren(this.nominatedMembers);

		this.nominatedMembers.forEach(nominatedMember => {

			nominatedMember.validateName({ isRequired: false });

			nominatedMember.validateDifferentiator();

			nominatedMember.validateUniquenessInGroup(
				{ isDuplicate: isEntityInArray(nominatedMember, opts.duplicateEntities) }
			);

		});

	}

}
