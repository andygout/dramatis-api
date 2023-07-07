import getShowQuery from './show';
import getShowProductionsQuery from './show-productions';

export default () => [
	getShowQuery(),
	getShowProductionsQuery()
];
