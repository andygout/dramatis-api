import Base from './Base.js';
import { Locale, Place, Time } from './index.js';
import { MODELS } from '../utils/constants.js';

export default class Setting extends Base {
	constructor(props = {}) {
		super(props);

		const { time, place, locale } = props;

		this.time = new Time(time);

		this.place = new Place(place);

		this.locale = new Locale(locale);
	}

	get model() {
		return MODELS.SETTING;
	}

	runInputValidations(opts) {
		this.time.validateName({ isRequired: false });

		this.time.validateDifferentiator();

		this.time.validateUniquenessInGroup({ isDuplicate: opts.isDuplicate });

		this.place.validateName({ isRequired: false });

		this.place.validateDifferentiator();

		this.place.validateUniquenessInGroup({ isDuplicate: opts.isDuplicate });

		this.locale.validateName({ isRequired: false });

		this.locale.validateDifferentiator();

		this.locale.validateUniquenessInGroup({ isDuplicate: opts.isDuplicate });
	}
}
