import { randomUUID } from 'node:crypto';

export const getRandomUuid = () => randomUUID({ disableEntropyCache: true });
