// for  '/' endpoint
const getCategories = (req, res, next) => {
    res
    .status(200)
    .setHeader('Content-Type', 'application/json')
    .json({
        success: true, msg: 'show me all categories'
    })
}

const postCategory = (req, res, next) => {
    res
    .status(201)
    .setHeader('Content-Type', 'application/json')
    .json({
        success: true, msg: 'create new category'
    })
}

const deleteCategories = (req, res, next) => {
    res
    .status(200)
    .setHeader('Content-Type', 'application/json')
    .json({
        success: true, msg: 'delete all category'
    })
}

// for '/:categoryId' endpoint
const getCategory  = (req, res, next) => {
    res
    .status(200)
    .setHeader('Content-Type', 'application/json')
    .json({
        success: true, msg: `show me one category with id: ${req.params.categoryId}`
    })
}

const updateCategory  = (req, res, next) => {
    res
    .status(200)
    .setHeader('Content-Type', 'application/json')
    .json({
        success: true, msg: `update category with id: ${req.params.categoryId}`
    })
}

const deleteCategory  = (req, res, next) => {
    res
    .status(200)
    .setHeader('Content-Type', 'application/json')
    .json({
        success: true, msg: `delete category with id: ${req.params.categoryId}`
    })
}

module.exports = {
    getCategories,
    postCategory,
    deleteCategories,
    getCategory,
    updateCategory,
    deleteCategory
}