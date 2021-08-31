import { getDuplicateCharacterIndices } from '../lib/get-duplicate-indices';
import Base from './Base';
import { CharacterDepiction } from '.';
import { MODELS } from '../utils/constants';

export default class CharacterGroup extends Base {

	constructor (props = {}) {

		super(props);

		const { characters } = props;

		this.characters = characters
			? characters.map(character => new CharacterDepiction(character))
			: [];

	}

	get model () {

		return MODELS.CHARACTER_GROUP;

	}

	runInputValidations (opts) {

		this.validateName({ isRequired: false });

		this.validateUniquenessInGroup({ isDuplicate: opts.isDuplicate });

		const duplicateCharacterIndices = getDuplicateCharacterIndices(this.characters);

		this.characters.forEach((character, index) => {

			character.validateName({ isRequired: false });

			character.validateUnderlyingName();

			character.validateDifferentiator();

			character.validateQualifier();

			character.validateCharacterNameUnderlyingNameDisparity();

			character.validateUniquenessInGroup({ isDuplicate: duplicateCharacterIndices.includes(index) });

		});

	}

}
