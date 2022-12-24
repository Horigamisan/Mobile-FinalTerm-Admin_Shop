const { CustomError } = require('../utils');

const handleCastErrorDB = (err) => {
	return new CustomError(`Invalid ${err.path}: ${err.value}`, 400);
};

const handleDuplicateFieldsDB = (err) => {
	// console.log(err.error);
	const duplicateValue = err.errmsg.match(/(["'])(?:\\.|[^\\])*?\1/)[0];
	// console.log(Object.keys(err));
	// const duplicates = err.error.keyValue;
	// const message = duplicates.map((field) => ({
	// 	field: duplicates[field],
	// }));
	// console.log(message);

	return new CustomError(
		`Duplicate field value: ${duplicateValue}. Please use another value!`,
		400
	);
};

const handleValidationErrorDB = (err) => {
	const errors = Object.values(err.errors).map((el) => el.message);
	const message = `Invalid input error. ${errors.join('. ')}`;
	return new CustomError(message, 400);
};

const handleJWTError = () =>
	new CustomError('Invalid token. Please login again', 401);

const handleJWTExpiredError = () =>
	new CustomError('Your token has expired. Please log in again!', 401);

const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		error: err,
		message: err.message,
		stack: err.stack,
	});
};

const sendErrorProd = (err, res) => {
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		});
	} else {
		res.status(500).json({
			status: 'error',
			message: 'Something went wrong',
		});
	}
};

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'err';

	if (process.env.NODE_ENV === 'development') {
		sendErrorDev(err, res);
	} else {
		let error = Object.create(err);
		console.log(error);

		if (error.name === 'CastError') error = handleCastErrorDB(error);
		if (error.name === 'ValidationError')
			error = handleValidationErrorDB(error);
		if (error.name === 'JsonWebTokenError') error = handleJWTError();
		if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
		if (error.code === 11000) error = handleDuplicateFieldsDB(error);

		sendErrorProd(error, res);
	}
};
