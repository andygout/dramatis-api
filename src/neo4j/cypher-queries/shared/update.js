import { getEditQuery } from '.';
import { MODEL_TO_NODE_LABEL_MAP } from '../../../utils/constants';

export default model => `
	MATCH (n:${MODEL_TO_NODE_LABEL_MAP[model]} { uuid: $uuid })
		SET
			n.name = $name,
			n.differentiator = $differentiator

	WITH n

	${getEditQuery(model)}
`;
