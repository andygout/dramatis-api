import { getEditQuery } from '.';
import { MODEL_TO_NODE_LABEL_MAP } from '../../../utils/constants';

export default model => `
	CREATE (n:${MODEL_TO_NODE_LABEL_MAP[model]} { uuid: $uuid, name: $name, differentiator: $differentiator })

	WITH n

	${getEditQuery(model)}
`;
