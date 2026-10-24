import PlaceBase from './PlaceBase.js';
import { getTrimmedOrEmptyString } from '../lib/strings.js';

const MIN_LATITUDE_FLOOR = -90;
const MAX_LATITUDE_CEILING = 90;
const MIN_LONGITUDE_FLOOR = -180;
const MAX_LONGITUDE_CEILING = 180;

const parseCoordinate = (value) => {
	if (typeof value === 'string') {
		const trimmedOrEmptyString = getTrimmedOrEmptyString(value);

		return trimmedOrEmptyString === ''
			? null
			: isNaN(trimmedOrEmptyString)
				? trimmedOrEmptyString
				: Number(trimmedOrEmptyString);
	}

	return value ?? null;
};

export default class Place extends PlaceBase {
	constructor(props = {}) {
		super(props);

		const { minLatitude, maxLatitude, minLongitude, maxLongitude } = props;

		this.minLatitude = parseCoordinate(minLatitude);

		this.maxLatitude = parseCoordinate(maxLatitude);

		this.minLongitude = parseCoordinate(minLongitude);

		this.maxLongitude = parseCoordinate(maxLongitude);
	}

	runInputValidations() {
		this.validateName({ isRequired: true });

		this.validateDifferentiator();

		this.validateBoundingBoxCoordinates();
	}

	validateBoundingBoxCoordinates() {
		const coordinates = ['minLatitude', 'maxLatitude', 'minLongitude', 'maxLongitude'];

		const hasAnyCoordinate = coordinates.some((coordinate) => this[coordinate] !== null);
		const hasAllCoordinates = coordinates.every((coordinate) => this[coordinate] !== null);

		if (!hasAnyCoordinate) return;

		const incompleteBoundingBoxErrorText = 'All four bounding box coordinates must be provided';
		const numberErrorText = 'Value must be a number';
		const infiniteNumberErrorText = 'Value must be a finite number';

		for (const coordinate of coordinates) {
			const value = this[coordinate];

			if (value === null) {
				this.addPropertyError(coordinate, incompleteBoundingBoxErrorText);
			} else if (isNaN(value)) {
				this.addPropertyError(coordinate, numberErrorText);
			} else if (!Number.isFinite(value)) {
				this.addPropertyError(coordinate, infiniteNumberErrorText);
			}
		}

		if (!hasAllCoordinates || coordinates.some((coordinate) => !Number.isFinite(this[coordinate]))) return;

		if (this.minLatitude < MIN_LATITUDE_FLOOR || this.minLatitude > MAX_LATITUDE_CEILING) {
			this.addPropertyError(
				'minLatitude',
				`Latitude must be between ${MIN_LATITUDE_FLOOR.toString()} and ${MAX_LATITUDE_CEILING.toString()}`
			);
		}

		if (this.maxLatitude < MIN_LATITUDE_FLOOR || this.maxLatitude > MAX_LATITUDE_CEILING) {
			this.addPropertyError(
				'maxLatitude',
				`Latitude must be between ${MIN_LATITUDE_FLOOR.toString()} and ${MAX_LATITUDE_CEILING.toString()}`
			);
		}

		if (this.minLongitude < MIN_LONGITUDE_FLOOR || this.minLongitude > MAX_LONGITUDE_CEILING) {
			this.addPropertyError(
				'minLongitude',
				`Longitude must be between ${MIN_LONGITUDE_FLOOR.toString()} and ${MAX_LONGITUDE_CEILING.toString()}`
			);
		}

		if (this.maxLongitude < MIN_LONGITUDE_FLOOR || this.maxLongitude > MAX_LONGITUDE_CEILING) {
			this.addPropertyError(
				'maxLongitude',
				`Longitude must be between ${MIN_LONGITUDE_FLOOR.toString()} and ${MAX_LONGITUDE_CEILING.toString()}`
			);
		}

		if (this.minLatitude > this.maxLatitude) {
			this.addPropertyError('minLatitude', 'Minimum latitude must not exceed maximum latitude');
			this.addPropertyError('maxLatitude', 'Maximum latitude must not be below minimum latitude');
		}

		if (this.minLongitude > this.maxLongitude) {
			this.addPropertyError('minLongitude', 'Minimum longitude must not exceed maximum longitude');
			this.addPropertyError('maxLongitude', 'Maximum longitude must not be below minimum longitude');
		}
	}
}
