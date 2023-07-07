import getShowQuery from './show';
import getShowMaterialsQuery from './show-materials';
import getShowProductionsQuery from './show-productions';

export default () => [
	getShowQuery(),
	getShowMaterialsQuery(),
	getShowProductionsQuery()
];
