import { getDuplicateNameIndices } from '../lib/get-duplicate-indices';
import Base from './Base';
import { CharacterGroup, WritingCredit } from '.';

export default class Material extends Base {

	constructor (props = {}) {

		super(props);

		const {
			uuid,
			differentiator,
			format,
			originalVersionMaterial,
			writingCredits,
			characterGroups,
			isAssociation
		} = props;

		this.uuid = uuid;
		this.differentiator = differentiator?.trim() || '';

		if (!isAssociation) {

			this.format = format?.trim() || '';

			this.originalVersionMaterial = new Material({ ...originalVersionMaterial, isAssociation: true });

			this.writingCredits = writingCredits
				? writingCredits.map(writingCredit => new WritingCredit(writingCredit))
				: [];

			this.characterGroups = characterGroups
				? characterGroups.map(characterGroup => new CharacterGroup(characterGroup))
				: [];

		}

	}

	get model () {

		return 'material';

	}

	runInputValidations () {

		this.validateName({ isRequired: true });

		this.validateDifferentiator();

		this.validateFormat({ isRequired: false });

		this.originalVersionMaterial.validateName({ isRequired: false });

		this.originalVersionMaterial.validateDifferentiator();

		this.originalVersionMaterial.validateNoAssociationWithSelf(this.name, this.differentiator);

		const duplicateWritingCreditIndices = getDuplicateNameIndices(this.writingCredits);

		this.writingCredits.forEach((writingCredit, index) =>
			writingCredit.runInputValidations({
				isDuplicate: duplicateWritingCreditIndices.includes(index),
				subject: { name: this.name, differentiator: this.differentiator }
			})
		);

		const duplicateCharacterGroupIndices = getDuplicateNameIndices(this.characterGroups);

		this.characterGroups.forEach((characterGroup, index) =>
			characterGroup.runInputValidations({ isDuplicate: duplicateCharacterGroupIndices.includes(index) })
		);

	}

	validateFormat (opts) {

		this.validateStringForProperty('format', { isRequired: opts.isRequired });

	}

}
