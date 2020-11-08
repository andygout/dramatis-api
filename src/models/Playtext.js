import { getDuplicateBaseInstanceIndices } from '../lib/get-duplicate-base-instance-indices';
import { getDuplicateCharacterIndices } from '../lib/get-duplicate-character-indices';
import Base from './Base';
import { Character, WriterGroup } from '.';

export default class Playtext extends Base {

	constructor (props = {}) {

		super(props);

		const { uuid, differentiator, writerGroups, characters, isAssociation } = props;

		this.model = 'playtext';
		this.uuid = uuid;
		this.differentiator = differentiator?.trim() || '';

		if (!isAssociation) {

			this.writerGroups = writerGroups
				? writerGroups.map(writerGroup => new WriterGroup(writerGroup))
				: [];

			this.characters = characters
				? characters.map(character => new Character({ ...character, isAssociation: true }))
				: [];

		}

	}

	runInputValidations () {

		this.validateName({ isRequired: true });

		this.validateDifferentiator();

		const duplicateWriterGroupIndices = getDuplicateBaseInstanceIndices(this.writerGroups);

		this.writerGroups.forEach((writerGroup, index) =>
			writerGroup.runInputValidations({ isDuplicate: duplicateWriterGroupIndices.includes(index) })
		);

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
