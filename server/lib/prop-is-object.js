export default instanceProp =>
	Object(instanceProp) === instanceProp &&
	!Array.isArray(instanceProp) &&
	Object.keys(instanceProp).length > 0;
