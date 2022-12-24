const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const { userModel, shopModel } = require('../models');
const {
	PATH_FOR_ANONYMOUS,
	PATH_FOR_UNVERIFIED,
	SECONDS_PER_DAY,
} = require('../constants');
const { catchAsync, CustomError } = require('../utils');
const { redisService, otpService, emailService } = require('../services');

const generateToken = async (data) => {
	return await promisify(jwt.sign)(data, '123', {
		expiresIn: '2 days',
	});
};

const sendToken = async (data, statusCode, res, otp) => {
	const token = await generateToken(data);

	// remove otp
	const message = {
		status: 'success',
		token,
		otp,
	};

	res.status(statusCode).json(message);
};

const isLoggedIn = async (req) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1];
	}

	// case 1: token does not exists
	if (!token) return new CustomError('Please log in!', 401);

	// case 2: token is in blacklist
	const isInBlacklist = await redisService.get(`bl_${token}`);
	if (isInBlacklist) return new CustomError('Invalid Bearer Token', 401);

	return jwt.verify(token, '123', async (err, data) => {
		// case 3: error likes invalid jwt, jwt has already been expired
		if (err) {
			return err;
		}

		// case 4: owner of the jwt has already been deleted before jwt expires
		const { userId, shopId, exp } = data;
		const user = await userModel.findById(userId);

		if (!user) {
			return new CustomError(
				'The user belonging to this token is no longer exists',
				401
			);
		}

		// case 5: the account's password belongs to this jwt has already been changed
		// case 6: user belongs to this jwt has already been banned

		return {
			tokenData: { token, exp },
			user,
			shopId,
		};
	});
};

const authController = {
	classifyUser: catchAsync(async (req, res, next) => {
		const path = req.originalUrl;
		const isPathForAnonymous = PATH_FOR_ANONYMOUS.some((endpoint) =>
			path.includes(endpoint)
		);

		const checkLoggedInResult = await isLoggedIn(req);

		if (checkLoggedInResult instanceof Error) {
			// case 1: anonymous and path is for anonymous
			if (isPathForAnonymous) {
				return next();
			}

			// case 2: anonymous and path is for logged in
			return next(checkLoggedInResult);
		}

		// case 3: logged in and path is for anonymous
		if (isPathForAnonymous) {
			return next(
				new CustomError('This endpoint is only for anonymous user', 400)
			);
		}

		// case 4: logged in but account is not verified
		const { user, tokenData, shopId } = checkLoggedInResult;
		if (
			user.status === 'unverified' &&
			!PATH_FOR_UNVERIFIED.some((endpoint) => path.includes(endpoint))
		) {
			return next(
				new CustomError(
					'You must verify your account before accessing any functionality',
					403
				)
			);
		}

		// case 5: logged in and path is for logged in
		req.tokenData = tokenData;
		req.user = user;
		req.shopId = shopId;

		next();
	}),

	restricTo: (role) => {
		return (req, res, next) => {
			if (!req.user.role.includes(role)) {
				return next(
					new CustomError(
						'You do not have permission to perform this action',
						403
					)
				);
			}
			next();
		};
	},

	signup: catchAsync(async (req, res) => {
		const user = await userModel.create(req.body);
		const otp = await otpService.create(user._id);
		// const token = await generateToken({ userId: user._id });

		// await emailService.sendMail({
		// 	to: req.body.email,
		// 	subject: 'Otp của bạn nè',
		// 	content: `<p>Vui lòng nhập mã OTP để hoàn thành việc đăng ký nhé. OTP: ${otp}</p>`
		// })

		// const message = {
		// 	status: 'success',
		// 	token,
		// };

		// res.status(201).json(message);

		await sendToken({ userId: user._id }, 201, res, otp);
	}),

	verifyAccount: catchAsync(async (req, res, next) => {
		const otp = req.body.otp;
		const userId = req.user._id;
		const storedOtp = await otpService.get(userId);

		if (!storedOtp || storedOtp !== otp) {
			return next(new CustomError('Invalid otp', 400));
		}

		await userModel.findOneAndUpdate({ _id: userId }, { status: 'verified' });
		await otpService.invalidate(userId);

		res.json({
			status: 'success',
		});
	}),

	resendOtp: catchAsync(async (req, res) => {
		const userId = req.user._id;
		const otp = await otpService.create(userId);

		res.status(200).send({ status: 'success', otp });
	}),

	signin: catchAsync(async (req, res, next) => {
		const { email, password, role } = req.body;
		const user = await userModel.findOne({ email });

		if (!user || !bcrypt.compareSync(password, user.password)) {
			return next(new CustomError('Incorrect email or password', 401));
		}

		let shop;
		if (role === 'shop') {
			shop = await shopModel.findOne({
				owner: user._id,
				// status: { $ne: 'rejected' },
			});

			if (!shop) {
				return next(new CustomError('You are not seller', 401));
			}
		}

		await sendToken(
			{ userId: user._id, shopId: shop ? shop._id : undefined },
			200,
			res
		);
	}),

	signout: catchAsync(async (req, res) => {
		const { token, exp } = req.tokenData;

		await redisService.set(`bl_${token}`, token, {
			EX: Math.round((exp - Date.now() / 1000) / SECONDS_PER_DAY),
		});

		res.status(200).json({ status: 'success' });
	}),
};

module.exports = authController;
