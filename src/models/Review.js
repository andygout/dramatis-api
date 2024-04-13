import { isEntityInArray } from '../lib/get-duplicate-entity-info';
import { isValidDate } from '../lib/is-valid-date';
import Base from './Base';
import { Company, Person } from '.';
import { MODELS } from '../utils/constants';

export default class Review extends Base {

	constructor (props = {}) {

		super(props);

		const { url, date, publication, critic } = props;

		this.url = url?.trim() || '';

		this.date = date?.trim() || '';

		this.publication = new Company(publication);

		this.critic = new Person(critic);

	}

	get model () {

		return MODELS.REVIEW;

	}

	runInputValidations (opts) {

		this.validateUrl({ isRequired: false });

		this.validateUniquenessInGroup({ isDuplicate: opts.isDuplicate, properties: new Set(['url']) });

		this.validateUrlPresenceIfNamedChildren([this.publication, this.critic]);

		this.validateDate();

		this.publication.validateName({ isRequired: Boolean(this.url) });

		this.publication.validateDifferentiator();

		this.publication.validateUniquenessInGroup({
			isDuplicate: isEntityInArray(this.publication, opts.duplicatePublicationAndCriticEntities)
		});

		this.critic.validateName({ isRequired: Boolean(this.url) });

		this.critic.validateDifferentiator();

		this.critic.validateUniquenessInGroup({
			isDuplicate: isEntityInArray(this.critic, opts.duplicatePublicationAndCriticEntities)
		});

	}

	validateUrl (opts) {

		this.validateStringForProperty('url', { isRequired: opts.isRequired });

		try {

			new URL(this.url);

		} catch {

			const isStringWithLength = Boolean(this.url);

			if (isStringWithLength) this.addPropertyError('url', 'URL must be a valid URL');

		}

	}

	validateUrlPresenceIfNamedChildren (children) {

		if (this.url === '' && children.some(child => Boolean(child.name))) {

			this.addPropertyError('url', 'URL is required if named children exist');

		}

	}

	validateDate () {

		if (Boolean(this.date) && !isValidDate(this.date))
			this.addPropertyError('date', 'Value must be in date format');

	}

}