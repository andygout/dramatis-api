import { getDuplicateNameIndices } from '../lib/get-duplicate-indices';
import MaterialBase from './MaterialBase';
import { CharacterGroup, WritingCredit } from '.';

export default class Material extends MaterialBase {

	constructor (props = {}) {

		super(props);

		const {
			format,
			originalVersionMaterial,
			writingCredits,
			characterGroups
		} = props;

		this.format = format?.trim() || '';

		this.originalVersionMaterial = new MaterialBase(originalVersionMaterial);

		this.writingCredits = writingCredits
			? writingCredits.map(writingCredit => new WritingCredit(writingCredit))
			: [];

		this.characterGroups = characterGroups
			? characterGroups.map(characterGroup => new CharacterGroup(characterGroup))
			: [];

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
