import { getDuplicateBaseInstanceIndices } from '../lib/get-duplicate-indices';
import Base from './Base';
import { CharacterGroup, WriterGroup } from '.';

export default class Playtext extends Base {

	constructor (props = {}) {

		super(props);

		const { uuid, differentiator, writerGroups, characterGroups, isAssociation } = props;

		this.model = 'playtext';
		this.uuid = uuid;
		this.differentiator = differentiator?.trim() || '';

		if (!isAssociation) {

			this.writerGroups = writerGroups
				? writerGroups.map(writerGroup => new WriterGroup(writerGroup))
				: [];

			this.characterGroups = characterGroups
				? characterGroups.map(characterGroup => new CharacterGroup(characterGroup))
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

		const duplicateCharacterGroupIndices = getDuplicateBaseInstanceIndices(this.characterGroups);

		this.characterGroups.forEach((characterGroup, index) =>
			characterGroup.runInputValidations({ isDuplicate: duplicateCharacterGroupIndices.includes(index) })
		);

	}

}
