const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/error');
const category = require('./routes/category');
const item = require('./routes/item');
const user = require('./routes/user');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const fileupload = require('express-fileupload');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const cor = require('cors')

// read config values
dotenv.config({ path: './config/config.env'});

// connects to the database
connectDB();

// initialize express framework
const app = express();

// use the morgan logger for development purposes ONLY
if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

// read/parse json data
app.use(bodyParser.json())

// parse cookies
app.use(cookieParser())

// file upload middleware
app.use(fileupload())

// sanitize our nosql injection
app.use(mongoSanitize())

// protect from cross site scripting
app.use(xss())

// protect from http parameter pollution
app.use(hpp())

// set up a rate limit
const limiter = rateLimit({
    windowMs: 10*60*1000,
    max: 100
})

app.use(limiter)

// add security headers
app.use(helmet())

// add cors protection 
app.use(cor())

// use our logger
app.use(logger);

// hook up our routes
app.use('/api/v1/category', category);

// hook up our routes
app.use('/api/v1/item', item);

// hook up our routes
app.use('/api/v1/user', user);

// handles error
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server is listening on PORT: ${PORT}`)
})

//process our error and close off our server
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    //kill our server
    server.close(() => process.exit(1))
})