const errorHandler = (err, req, res, next) => {
    let error = { ...err };

    error.message = err.message;

    console.log(err.stack)

    res
    .status(error.statusCode || 500)
    .setHeader('Content-Type', 'application/json')
    .json({
        success: false,
        error: error.message || 'Server Error'
    })
}

module.exports = errorHandler;