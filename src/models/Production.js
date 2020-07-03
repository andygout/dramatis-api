import { getDuplicateNameIndices } from '../lib/get-duplicate-name-indices';
import Base from './Base';
import { BasicModel, PersonCastMember, Theatre } from '.';

export default class Production extends Base {

	constructor (props = {}) {

		super(props);

		const { uuid, theatre, playtext, cast } = props;

		this.model = 'production';
		this.uuid = uuid;
		this.theatre = new Theatre(theatre);
		this.playtext = new BasicModel({ model: 'playtext', ...playtext });
		this.cast = cast
			? cast.map(castMember => new PersonCastMember(castMember))
			: [];

	}

	runInputValidations () {

		this.validateName({ requiresName: true });

		this.theatre.validateName({ requiresName: true });

		this.playtext.validateName({ requiresName: false });

		const duplicateNameIndices = getDuplicateNameIndices(this.cast);

		this.cast.forEach((castMember, index) =>
			castMember.runInputValidations({ hasDuplicateName: duplicateNameIndices.includes(index) })
		);

	}

	// Overrides Base model runDatabaseValidations() method because Production instances
	// do not require database validation as they can have the same name as others.
	runDatabaseValidations () {

		return;

	}

}
