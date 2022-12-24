const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const User = new Schema({
	name: String,
	email: {
		type: String,
		required: true,
		unique: true,
	},
	tel: {
		type: String,
		required: true,
		unique: true,
	},
	birthDate: {
		type: Date,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	passwordChangedAt: {
		type: Date,
		default: undefined,
	},
	gender: {
		type: String,
		default: 'Nam',
	},
	role: {
		type: [String],
		enum: ['admin', 'user', 'seller'],
		default: ['user'],
	},
	address: String,
	status: {
		type: String,
		enum: ['unverified', 'active'],
		default: 'unverified',
	},
});

User.pre('save', async function (next) {
	// 12 is salt length
	this.password = await bcrypt.hash(this.password, 12);
	next();
});

module.exports = model('User', User);
