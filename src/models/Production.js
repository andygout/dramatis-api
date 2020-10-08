import { getDuplicateIndices } from '../lib/get-duplicate-indices';
import Base from './Base';
import { CastMember, Playtext, Theatre } from '.';

export default class Production extends Base {

	constructor (props = {}) {

		super(props);

		const { uuid, theatre, playtext, cast } = props;

		this.model = 'production';
		this.uuid = uuid;
		this.playtext = new Playtext({ ...playtext, isAssociation: true });
		this.theatre = new Theatre(theatre);
		this.cast = cast
			? cast.map(castMember => new CastMember(castMember))
			: [];

	}

	runInputValidations () {

		this.validateName({ isRequired: true });

		this.theatre.validateName({ isRequired: false });

		this.theatre.validateDifferentiator();

		this.playtext.validateName({ isRequired: false });

		this.playtext.validateDifferentiator();

		const duplicateCastMemberIndices = getDuplicateIndices(this.cast);

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
