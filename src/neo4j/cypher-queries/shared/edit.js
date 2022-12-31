import { MODEL_TO_NODE_LABEL_MAP } from '../../../utils/constants';

export default model => `
	MATCH (n:${MODEL_TO_NODE_LABEL_MAP[model]} { uuid: $uuid })

	RETURN
		n.uuid AS uuid,
		n.name AS name,
		n.differentiator AS differentiator
`;
