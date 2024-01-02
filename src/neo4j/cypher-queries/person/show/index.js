import getShowQuery from './show';
import getShowAwardsQuery from './show-awards';
import getShowAwardsForSubsequentVersionMaterialsQuery from './show-awards-for-subsequent-version-materials';
import getShowAwardsForSourcingMaterialsQuery from './show-awards-for-sourcing-materials';
import getShowAwardsForRightsGrantorMaterialsQuery from './show-awards-for-rights-grantor-materials';
import getShowMaterialsQuery from './show-materials';
import getShowProductionsOfMaterialsQuery from './show-productions-of-materials';
import getShowProductionsQuery from './show-productions';

export default () => [
	getShowQuery(),
	getShowAwardsQuery(),
	getShowAwardsForSubsequentVersionMaterialsQuery(),
	getShowAwardsForSourcingMaterialsQuery(),
	getShowAwardsForRightsGrantorMaterialsQuery(),
	getShowMaterialsQuery(),
	getShowProductionsOfMaterialsQuery(),
	getShowProductionsQuery()
];
