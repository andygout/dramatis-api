import { IRREGULAR_PLURAL_NOUNS_MAP } from '../utils/constants';

const pascalCasify = string => string.charAt(0).toUpperCase() + string.substring(1);

const pluralise = model => IRREGULAR_PLURAL_NOUNS_MAP[model] || `${model}s`;

export {
	pascalCasify,
	pluralise
};
