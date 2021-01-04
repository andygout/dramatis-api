import { getDuplicateBaseInstanceIndices } from '../lib/get-duplicate-indices';
import Base from './Base';
import { CastMember, Material, Theatre } from '.';

export default class Production extends Base {

	constructor (props = {}) {

		super(props);

		const { uuid, theatre, material, cast } = props;

		this.model = 'production';
		this.uuid = uuid;
		this.material = new Material({ ...material, isAssociation: true });
		this.theatre = new Theatre({ ...theatre, isAssociation: true });
		this.cast = cast
			? cast.map(castMember => new CastMember(castMember))
			: [];

	}

	runInputValidations () {

		this.validateName({ isRequired: true });

		this.theatre.validateName({ isRequired: false });

		this.theatre.validateDifferentiator();

		this.material.validateName({ isRequired: false });

		this.material.validateDifferentiator();

		const duplicateCastMemberIndices = getDuplicateBaseInstanceIndices(this.cast);

		this.cast.forEach((castMember, index) =>
			castMember.runInputValidations({ isDuplicate: duplicateCastMemberIndices.includes(index) })
		);

	}

	// Overrides Base model runDatabaseValidations() method because Production instances
	// do not require database validation as they can have the same name as others.
	runDatabaseValidations () {

		return;

	}

}
