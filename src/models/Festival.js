import FestivalBase from './FestivalBase';
import { FestivalSeries } from '.';
import { MODELS } from '../utils/constants';

export default class Festival extends FestivalBase {

	constructor (props = {}) {

		super(props);

		const { festivalSeries } = props;

		this.festivalSeries = new FestivalSeries(festivalSeries);

	}

	get model () {

		return MODELS.FESTIVAL;

	}

	runInputValidations () {

		this.validateName({ isRequired: true });

		this.validateDifferentiator();

		this.festivalSeries.validateName({ isRequired: false });

		this.festivalSeries.validateDifferentiator();

	}

}
