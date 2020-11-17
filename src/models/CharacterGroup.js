import { getDuplicateCharacterIndices } from '../lib/get-duplicate-indices';
import Base from './Base';
import { Character } from '.';

export default class CharacterGroup extends Base {

	constructor (props = {}) {

		super(props);

		const { characters } = props;

		this.model = 'characterGroup';
		this.characters = characters
			? characters.map(character => new Character({ ...character, isAssociation: true }))
			: [];

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
