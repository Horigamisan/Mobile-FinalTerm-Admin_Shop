const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const db = require('./db');
const indexRouter = require('./routes');

const app = express();

app.set('views', `${__dirname}/views/`);
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(
	cors({
		origin: '*',
		methods: ['GET', 'POST', 'PATCH', 'DELETE'],
	})
);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(cookieParser());

app.use('/', indexRouter);

db.connect();

app.listen(3001, () => {
	console.log('Listening on port 3001');
});
