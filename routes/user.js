const express = require('express');
const router = express.Router();
const {
    getUsers,
    postUser,
    deleteUsers,
    getUser,
    updateUser,
    deleteUser,
    login,
    forgotPassword,
    resetPassword,
    updatePassword,
    logout
} = require('../controllers/userController');
const reqLogger = require ('../middlewares/reqlogger')
const {
    userValidator,
    adminValidator} = require ('../middlewares/utils/validators');
const protectedRoute = require('../middlewares/auth')


//root
router.route('/')
    .get(reqLogger, adminValidator, getUsers)
    .post(reqLogger, userValidator, postUser)
    .delete(reqLogger, protectedRoute, deleteUsers)

router.route('/login')
    .post(reqLogger, login)

router.route('/forgotPassword')
    .post(reqLogger, forgotPassword)

router.route('/resetPassword')
    .put(reqLogger, resetPassword)

router.route('/updatePassword')
    .put(reqLogger, protectedRoute, updatePassword)

router.route('/logout')
    .get(reqLogger, protectedRoute, logout)

router.route('/:userId')
    .get(reqLogger, getUser)
    .put(reqLogger, protectedRoute, updateUser)
    .delete(reqLogger, protectedRoute, deleteUser)


module.exports = router;