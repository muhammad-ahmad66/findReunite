const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');

const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const personRoutes = require('./routes/personRoutes');
const userRoutes = require('./routes/userRoutes');
const viewRoutes = require('./routes/viewRoutes');
const missingPersonRoutes = require('./routes/missingPersonRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();
/*
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        'cdnjs.cloudflare.com',
        'http://127.0.0.1:800',
        'https://unpkg.com',
      ],
      connectSrc: [
        "'self'",
        'http://127.0.0.1:800',
        'wss://find-reunite-3pw002s6t-muhammad-ahmads-projects-9cf6f0ca.vercel.app',
      ],
      styleSrc: [
        "'self'",
        'cdnjs.cloudflare.com',
        'https://cdn.jsdelivr.net',
        'https://fonts.googleapis.com',
      ],
      imgSrc: ["'self'", 'data:'],
      fontSrc: ["'self'", 'cdnjs.cloudflare.com', 'https://fonts.gstatic.com'],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  }),
);

*/

app.enable('trust proxy');

app.use(cors());
// allow access control to all origins

app.options('*', cors());

app.use(helmet());

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// THIRD-PARTY MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // Logging info about Request(http method, statusCode, url, time etc) -DEVELOPMENT
}

app.use(express.urlencoded({ extended: true, limit: '10kb' })); // to parse data from url, sending through form
app.use(cookieParser()); // To parse cookies from incoming request.
app.use(express.json()); // To parse data from req.body -called body parser

// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ['name', 'gender'],
  }),
);

app.use((req, res, next) => {
  // console.log(req.cookies);
  next();
});

app.use(compression()); // will compress codes that is send to the client

// Mounting Routes
app.use('/', viewRoutes);
app.use('/api/v1/persons', personRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/missing-persons', missingPersonRoutes);

// ---------
// ERROR HANDLING

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

// 404 Pages for this kind of url: http://127.0.0.1/api/persons/ [like without v1]
// app.all('*', (req, res, next) => {
//   res.status(404).json({
//     status: 'fail',
//     message: `Can't find ${req.originalUrl} on this server.`,
//   });
// });

// SECOND STEP
// CREATING AN ERROR
// app.all('*', (req, res, next) => {
//   const err = new Error(`Can't find ${req.originalUrl} on this server`);
//   err.status = 'fail';
//   err.statusCode = '404';

//   next(err);
// });

// FIRST STEP
// CREATING ERROR HANDLING MIDDLEWARE
// app.use((err, req, res, next) => {
//   console.log(err.stack);

//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || 'error';

//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message,
//   });
// });

module.exports = app;
