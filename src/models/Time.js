import TimeBase from './TimeBase.js';
import isValidDate from '../lib/is-valid-date.js';
import { getTrimmedOrEmptyString } from '../lib/strings.js';
import { MODELS } from '../utils/constants.js';

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

		const isValidFromDate = isValidDate(this.fromDate);
		const isValidToDate = isValidDate(this.toDate);

		if (Boolean(this.fromDate) && !isValidFromDate) {
			this.addPropertyError('fromDate', formatErrorText);
		}

		if (Boolean(this.toDate) && !isValidToDate) {
			this.addPropertyError('toDate', formatErrorText);
		}

		if (isValidToDate && !Boolean(this.fromDate)) {
			this.addPropertyError('fromDate', "'To' date requires corresponding 'from' date");
		}

		if (isValidFromDate && !Boolean(this.toDate)) {
			this.addPropertyError('toDate', "'From' date requires corresponding 'to' date");
		}

		if (isValidFromDate && isValidToDate && this.fromDate > this.toDate) {
			this.addPropertyError('fromDate', "'From' date must not be after 'to' date");
			this.addPropertyError('toDate', "'To' date must not be before 'from' date");
		}
	}
}
