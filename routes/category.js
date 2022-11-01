const express = require('express');
const router = express.Router();
const {
    getCategories,
    postCategory,
    deleteCategories,
    getCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');
const reqLogger = require ('../middlewares/reqLogger')
const {categoryValidator} = require ('../middlewares/utils/validators')
const protectedRoute = require('../middlewares/auth')

//root
router.route('/')
    .get(reqLogger, getCategories)
    .post(reqLogger, protectedRoute, categoryValidator, postCategory)
    .delete(reqLogger, protectedRoute, deleteCategories)

router.route('/:categoryId')
    .get(reqLogger, getCategory)
    .put(reqLogger, protectedRoute, updateCategory)
    .delete(reqLogger, protectedRoute, deleteCategory)

module.exports = router;