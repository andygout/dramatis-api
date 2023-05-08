import getShowQuery from './show';
import getShowAwardsQuery from './show-awards';
import getShowAwardsSubsequentVersionMaterialQuery from './show-awards-subsequent-version-material';
import getShowAwardsSourcingMaterialQuery from './show-awards-sourcing-material';
import getShowMaterialsQuery from './show-materials';
import getShowProductionsQuery from './show-productions';

export default () => [
	getShowQuery(),
	getShowAwardsQuery(),
	getShowAwardsSubsequentVersionMaterialQuery(),
	getShowAwardsSourcingMaterialQuery(),
	getShowMaterialsQuery(),
	getShowProductionsQuery()
];
