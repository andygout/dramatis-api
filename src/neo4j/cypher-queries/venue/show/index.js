import getShowProductionsQuery from './show-productions.js';
import getShowQuery from './show.js';

export default () => [getShowQuery(), getShowProductionsQuery()];
