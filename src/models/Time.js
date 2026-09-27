import TimeBase from './TimeBase.js';
import isChronological from '../lib/is-chronological.js';
import isValidDate from '../lib/is-valid-date.js';
import { getTrimmedOrEmptyString } from '../lib/strings.js';

export default class Time extends TimeBase {
	constructor(props = {}) {
		super(props);

		const { fromDate, toDate } = props;

		this.fromDate = getTrimmedOrEmptyString(fromDate);

		this.toDate = getTrimmedOrEmptyString(toDate);
	}

	runInputValidations() {
		this.validateName({ isRequired: true });

		this.validateDifferentiator();

		this.validateDates();
	}

	validateDates() {
		const formatErrorText = 'Value must be in date format';

		const isValidFromDate = isValidDate(this.fromDate, { allowBce: true });
		const isValidToDate = isValidDate(this.toDate, { allowBce: true });

		if (Boolean(this.fromDate) && !isValidFromDate) {
			this.addPropertyError('fromDate', formatErrorText);
		}

		if (Boolean(this.toDate) && !isValidToDate) {
			this.addPropertyError('toDate', formatErrorText);
		}

		if (isValidToDate && !this.fromDate) {
			this.addPropertyError('fromDate', "'To' date requires corresponding 'from' date");
		}

		if (isValidFromDate && !this.toDate) {
			this.addPropertyError('toDate', "'From' date requires corresponding 'to' date");
		}

		if (isValidFromDate && isValidToDate && !isChronological(this.fromDate, this.toDate)) {
			this.addPropertyError('fromDate', "'From' date must not be after 'to' date");
			this.addPropertyError('toDate', "'To' date must not be before 'from' date");
		}
	}
}
