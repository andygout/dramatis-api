import getShowMaterialsQuery from './show-materials.js';
import getShowProductionsQuery from './show-productions.js';
import getShowQuery from './show.js';

export default () => [getShowQuery(), getShowMaterialsQuery(), getShowProductionsQuery()];
