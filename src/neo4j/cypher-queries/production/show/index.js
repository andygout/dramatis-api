import getShowQuery from './show';
import getShowAwardsQuery from './show-awards';

export default () => [
	getShowQuery(),
	getShowAwardsQuery()
];
