// for  '/' endpoint
const getUsers = (req, res, next) => {
    res
    .status(200)
    .setHeader('Content-Type', 'application/json')
    .json({
        success: true, msg: 'show me all users'
    })
}

const postUser = (req, res, next) => {
    res
    .status(201)
    .setHeader('Content-Type', 'application/json')
    .json({
        success: true, msg: 'create new user'
    })
}

const deleteUsers = (req, res, next) => {
    res
    .status(200)
    .setHeader('Content-Type', 'application/json')
    .json({
        success: true, msg: 'delete all users'
    })
}

// for '/:categoryId' endpoint
const getUser  = (req, res, next) => {
    res
    .status(200)
    .setHeader('Content-Type', 'application/json')
    .json({
        success: true, msg: `show me one user with id: ${req.params.userId}`
    })
}

const updateUser  = (req, res, next) => {
    res
    .status(200)
    .setHeader('Content-Type', 'application/json')
    .json({
        success: true, msg: `update user with id: ${req.params.userId}`
    })
}

const deleteUser  = (req, res, next) => {
    res
    .status(200)
    .setHeader('Content-Type', 'application/json')
    .json({
        success: true, msg: `delete user with id: ${req.params.userId}`
    })
}

module.exports = {
    getUsers,
    postUser,
    deleteUsers,
    getUser,
    updateUser,
    deleteUser
}