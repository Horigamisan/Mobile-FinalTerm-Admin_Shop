const { DEFAULT_FILTER_CATEGORIES, LIMIT_PER_PAGE } = require('../constants');

module.exports = class {
	constructor(query, queryOrigin) {
		this.query = query;
		this.queryOrigin = queryOrigin;
	}

	filter(type) {
		const queryObj = { ...this.queryOrigin };
		const excludedFields = ['page'];
		const defaultFilterCategories = DEFAULT_FILTER_CATEGORIES[type];

		excludedFields.forEach((field) => delete queryObj[field]);
		this.query.find({ ...queryObj, ...defaultFilterCategories });

		return this;
	}

	sort() {
		const fields = Object.keys(this.queryOrigin);
		let criterias;

		if (fields.length > 0) {
			criterias = fields.join(' ');
			this.query.sort(criterias);
		} else {
			criterias = '-createdAt';
		}

		return this.query.sort(criterias);
	}

	pagination() {
		const page = this.queryOrigin.page - 0 || 1;
		const skip = (page - 1) * LIMIT_PER_PAGE;

		this.query.skip(skip).limit(LIMIT_PER_PAGE);
		return this;
	}
};
