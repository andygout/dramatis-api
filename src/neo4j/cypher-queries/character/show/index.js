import getShowMaterialsQuery from './show-materials';
import getShowProductionsQuery from './show-productions';

export default () => [
	getShowMaterialsQuery(),
	getShowProductionsQuery()
];
