import { getDuplicateIndices } from '../lib/get-duplicate-indices';
import Base from './Base';
import { Character } from '.';

export default class Playtext extends Base {

	constructor (props = {}) {

		super(props);

		const { uuid, differentiator, characters, isAssociation } = props;

		this.model = 'playtext';
		this.uuid = uuid;
		this.differentiator = differentiator?.trim() || '';

		if (!isAssociation) {

			this.characters = characters
				? characters.map(character => new Character(character))
				: [];

		}

	}

	runInputValidations () {

		this.validateName({ isRequired: true });

		this.validatedifferentiator();

		const duplicateCharacterIndices = getDuplicateIndices(this.characters);

		this.characters.forEach((character, index) => {

			character.validateName({ isRequired: false });

			character.validatedifferentiator();

			character.validateUniquenessInGroup({ isDuplicate: duplicateCharacterIndices.includes(index) });

		});

	}

}
