import { getDuplicateEntities, isEntityInArray } from '../lib/get-duplicate-entity-info';
import { getDuplicateBaseInstanceIndices, getDuplicateProductionIdentifierIndices } from '../lib/get-duplicate-indices';
import Base from './Base';
import { CompanyWithMembers, MaterialBase, Person, ProductionIdentifier } from '.';
import { MODELS } from '../utils/constants';

export default class Nomination extends Base {

	constructor (props = {}) {

		super(props);

		const { isWinner, entities, productions, materials } = props;

		this.isWinner = Boolean(isWinner);

		this.entities = entities
			? entities.map(entity => {
				switch (entity.model) {
					case MODELS.COMPANY:
						return new CompanyWithMembers(entity);
					default:
						return new Person(entity);
				}
			})
			: [];

		this.productions = productions
			? productions.map(production => new ProductionIdentifier(production))
			: [];

		this.materials = materials
			? materials.map(material => new MaterialBase(material))
			: [];

	}

	get model () {

		return MODELS.NOMINATION;

	}

	runInputValidations () {

		const duplicateEntities = getDuplicateEntities(this.entities);

		this.entities.forEach(entity => {

			entity.validateName({ isRequired: false });

			entity.validateDifferentiator();

			entity.validateUniquenessInGroup({ isDuplicate: isEntityInArray(entity, duplicateEntities) });

			if (entity.model === MODELS.COMPANY) entity.runInputValidations({ duplicateEntities });

		});

		const duplicateProductionIdentifierIndices = getDuplicateProductionIdentifierIndices(this.productions);

		this.productions.forEach((production, index) => {

			production.validateUuid();

			production.validateUniquenessInGroup(
				{ isDuplicate: duplicateProductionIdentifierIndices.includes(index), properties: new Set(['uuid']) }
			);

		});

		const duplicateMaterialIndices = getDuplicateBaseInstanceIndices(this.materials);

		this.materials.forEach((material, index) => {

			material.validateName({ isRequired: false });

			material.validateDifferentiator();

			material.validateUniquenessInGroup({ isDuplicate: duplicateMaterialIndices.includes(index) });

		});

	}

	async runDatabaseValidations () {

		for (const production of this.productions) await production.runDatabaseValidations();

	}

}
