import { getDuplicateNameIndices } from '../lib/get-duplicate-name-indices';
import Base from './Base';
import { Character } from '.';

export default class Playtext extends Base {

	constructor (props = {}) {

		super(props);

		const { uuid, characters } = props;

		this.model = 'playtext';
		this.uuid = uuid;
		this.characters = characters
			? characters.map(character => new Character(character))
			: [];

	}

	runInputValidations () {

		this.validateName({ requiresName: true });

		const duplicateNameIndices = getDuplicateNameIndices(this.characters);

		this.characters.forEach((character, index) => {

			character.validateName({ requiresName: false });

			character.validateNameUniquenessInGroup({ hasDuplicateName: duplicateNameIndices.includes(index) });

		});

	}

}
