const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/error');
const category = require('./routes/category')
const item = require('./routes/item')
const user = require('./routes/user')

// read config values
dotenv.config({ path: './config/config.env'});

// initialize express framework
const app = express();

// use the morgan logger for development purposes ONLY
if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

// read/parse json data
app.use(bodyParser.json())

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

