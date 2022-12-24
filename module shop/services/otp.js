const redisService = require('./redis');

const generateOtp = async () => {
	let otp;

	otp = '';
	const digits = '0123456789';
	const otpLength = 4;

	for (let i = 0; i < otpLength; i++) {
		const index = Math.floor(Math.random() * digits.length);
		otp += digits[index];
	}

	return otp;
};

const otpService = {
	get: async (userId) => {
		return await redisService.get(`otp_${userId}`);
	},

	create: async (userId) => {
		const otpCode = await generateOtp();

		await redisService.set(`otp_${userId.toString()}`, otpCode, {
			EX: 300,
		});

		return otpCode;
	},

	invalidate: async (userId) => {
		await redisService.del(`otp_${userId}`);
	},
};

module.exports = otpService;
