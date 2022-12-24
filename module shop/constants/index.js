const PATH_FOR_ANONYMOUS = ['/signin', '/signup'];

const PATH_FOR_UNVERIFIED = ['/auth/resend-otp', '/signout', '/verify-account'];

const DEFAULT_FILTER_CATEGORIES = {
	shop: {
		status: 'opened',
	},
	product: {
		isAvailable: true,
	},
};

const SECONDS_PER_DAY = 24 * 60 * 60;

const USER_DISPLAY_FIELDS = ['name', 'email', 'tel', 'birthDate', 'gender'];

const SHOP_DISPLAY_FIELDS = [
	'name',
	'owner',
	'address',
	'sumOfRating',
	'noOfRatings',
	'noOfReviews',
	'shopOpenTime',
	'shopCloseTime',
	'avatar',
	'status',
]; // avatar

const PRODUCT_DISPLAY_FIELDS = [
	'name',
	'shop',
	'price',
	'sumOfRating',
	'noOfRatings',
	'isAvailable',
	'soldQuantity',
	'category',
	'description',
	'images',
];

const LIMIT_PER_PAGE = 10;

module.exports = {
	PATH_FOR_ANONYMOUS,
	PATH_FOR_UNVERIFIED,
	SECONDS_PER_DAY,
	DEFAULT_FILTER_CATEGORIES,
	USER_DISPLAY_FIELDS,
	SHOP_DISPLAY_FIELDS,
	PRODUCT_DISPLAY_FIELDS,
	LIMIT_PER_PAGE,
};
