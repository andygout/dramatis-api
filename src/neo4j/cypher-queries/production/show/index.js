import getShowAwardsQuery from './show-awards.js';
import getShowQuery from './show.js';

export default () => [getShowQuery(), getShowAwardsQuery()];
