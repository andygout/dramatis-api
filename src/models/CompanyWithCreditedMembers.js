import { isEntityInArray } from '../lib/get-duplicate-entity-info';
import Company from './Company';
import { Person } from '.';

export default class CompanyWithCreditedMembers extends Company {

	constructor (props = {}) {

		super(props);

		const { creditedMembers } = props;

		this.creditedMembers = creditedMembers
			? creditedMembers.map(creditedMember => new Person(creditedMember))
			: [];

	}

	runInputValidations (opts) {

		this.validateNamePresenceIfNamedChildren(this.creditedMembers);

		this.creditedMembers.forEach(creditedMember => {

			creditedMember.validateName({ isRequired: false });

			creditedMember.validateDifferentiator();

			creditedMember.validateUniquenessInGroup(
				{ isDuplicate: isEntityInArray(creditedMember, opts.duplicateEntities) }
			);

		});

	}

}
