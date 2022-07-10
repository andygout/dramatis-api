import { getDuplicateBaseInstanceIndices, getDuplicateNameIndices } from '../lib/get-duplicate-indices';
import { isValidYear } from '../lib/is-valid-year';
import MaterialBase from './MaterialBase';
import { CharacterGroup, WritingCredit } from '.';

export default class Material extends MaterialBase {

	constructor (props = {}) {

		super(props);

		const {
			format,
			year,
			originalVersionMaterial,
			writingCredits,
			subMaterials,
			characterGroups
		} = props;

		this.format = format?.trim() || '';

		this.year = parseInt(year) || year?.trim() || '';

		this.originalVersionMaterial = new MaterialBase(originalVersionMaterial);

		this.writingCredits = writingCredits
			? writingCredits.map(writingCredit => new WritingCredit(writingCredit))
			: [];

		this.subMaterials = subMaterials
			? subMaterials.map(subMaterial => new MaterialBase(subMaterial))
			: [];

		this.characterGroups = characterGroups
			? characterGroups.map(characterGroup => new CharacterGroup(characterGroup))
			: [];

	}

	runInputValidations () {

		this.validateName({ isRequired: true });

		this.validateDifferentiator();

		this.validateFormat({ isRequired: false });

		this.validateYear({ isRequired: false });

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

		const duplicateSubMaterialIndices = getDuplicateBaseInstanceIndices(this.subMaterials);

		this.subMaterials.forEach((subMaterial, index) => {

			subMaterial.validateName({ isRequired: false });

			subMaterial.validateDifferentiator();

			subMaterial.validateNoAssociationWithSelf(this.name, this.differentiator);

			subMaterial.validateUniquenessInGroup({ isDuplicate: duplicateSubMaterialIndices.includes(index) });

		});

		const duplicateCharacterGroupIndices = getDuplicateNameIndices(this.characterGroups);

		this.characterGroups.forEach((characterGroup, index) =>
			characterGroup.runInputValidations({ isDuplicate: duplicateCharacterGroupIndices.includes(index) })
		);

	}

	validateFormat (opts) {

		this.validateStringForProperty('format', { isRequired: opts.isRequired });

	}

	validateYear () {

		if (Boolean(this.year) && !isValidYear(this.year))
			this.addPropertyError('year', 'Value must be a valid year');

	}

}
