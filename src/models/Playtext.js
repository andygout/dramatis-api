import { getDuplicateBaseInstanceIndices } from '../lib/get-duplicate-base-instance-indices';
import { getDuplicateCharacterIndices } from '../lib/get-duplicate-character-indices';
import Base from './Base';
import { Character, Person } from '.';

export default class Playtext extends Base {

	constructor (props = {}) {

		super(props);

		const { uuid, differentiator, writers, characters, isAssociation } = props;

		this.model = 'playtext';
		this.uuid = uuid;
		this.differentiator = differentiator?.trim() || '';

		if (!isAssociation) {

			this.writers = writers
				? writers.map(writer => new Person({ ...writer, isAssociation: true }))
				: [];

			this.characters = characters
				? characters.map(character => new Character({ ...character, isAssociation: true }))
				: [];

		}

	}

	runInputValidations () {

		this.validateName({ isRequired: true });

		this.validateDifferentiator();

		const duplicateBaseInstanceIndices = getDuplicateBaseInstanceIndices(this.writers);

		this.writers.forEach((writer, index) => {

			writer.validateName({ isRequired: false });

			writer.validateDifferentiator();

			writer.validateUniquenessInGroup({ isDuplicate: duplicateBaseInstanceIndices.includes(index) });

		});

		const duplicateCharacterIndices = getDuplicateCharacterIndices(this.characters);

		this.characters.forEach((character, index) => {

			character.validateName({ isRequired: false });

			character.validateUnderlyingName();

			character.validateDifferentiator();

			character.validateQualifier();

			character.validateGroup();

			character.validateCharacterNameUnderlyingNameDisparity();

			character.validateUniquenessInGroup({ isDuplicate: duplicateCharacterIndices.includes(index) });

		});

	}

}
