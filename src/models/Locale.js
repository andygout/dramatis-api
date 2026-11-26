import { SurLocale } from './index.js';
import LocaleBase from './LocaleBase.js';

export default class Locale extends LocaleBase {
	constructor(props = {}) {
		super(props);

		const { surLocale } = props;

		this.surLocale = new SurLocale(surLocale);
	}

	runInputValidations() {
		this.validateName({ isRequired: true });

		this.validateDifferentiator();

		this.surLocale.validateName({ isRequired: false });

		this.surLocale.validateDifferentiator();

		this.surLocale.validateNoAssociationWithSelf({
			name: this.name,
			differentiator: this.differentiator
		});
	}

	async runDatabaseValidations() {
		await this.validateUniquenessInDatabase();

		await this.surLocale.runDatabaseValidations({ subjectLocaleUuid: this.uuid });
	}
}
