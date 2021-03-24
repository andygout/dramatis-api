import Base from './Base';
import { Person } from '.';

export default class Company extends Base {

	constructor (props = {}) {

		super(props);

		const { uuid, differentiator, creditedMembers, isProductionAssociation } = props;

		this.uuid = uuid;
		this.differentiator = differentiator?.trim() || '';

		if (isProductionAssociation) {

			this.creditedMembers = creditedMembers
				? creditedMembers.map(creditedMember => new Person(creditedMember))
				: [];

		}

	}

	get model () {

		return 'company';

	}

}
