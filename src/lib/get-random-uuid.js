import { randomUUID } from 'crypto';

export const getRandomUuid = () => randomUUID({ disableEntropyCache: true });
