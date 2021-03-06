const config = require("../utils/misc").get_config();

const add_config = config => fn => fn(config);

const with_config = obj => {
	Object.keys(obj).forEach(dep => {
		obj[dep] = add_config(config)(obj[dep]);
	});
	return obj;
};

module.exports = with_config({
	fetch: require("./fetch"),
	add: require("./add"),
	review: require("./review"),
	list: require("./list"),
	push: require("./push"),
	stats: require("./stats"),
	search: require("./search"),
});
