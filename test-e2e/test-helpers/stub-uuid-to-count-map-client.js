const stubUuidToCountMap = new Map();

const clear = () => stubUuidToCountMap.clear();

const get = key => stubUuidToCountMap.get(key);

const set = (key, value) => stubUuidToCountMap.set(key, value);

export {
	clear,
	get,
	set
};
