const { query } = require("express")
const Category = require('../models/Category');

// for  '/' endpoint
const getCategories = async (req, res, next) => {
    // query parameter
    // checking category if empty by .length
    if (Object.keys(req.query).length){
        const category = req.query.categoryName
        console.log(`Searching for category: ${category}`);
    }

    try {
        const categories = await Category.find();

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(categories)

    } catch (err) {
        throw new Error(`Error getting categories: ${err.message}`);
    }

   
}

const postCategory = async (req, res, next) => {
    try {
        const category = await Category.create(req.body);

        res
        .status(201)
        .setHeader('Content-Type', 'application/json')
        .json(category)

    } catch (err) {
        throw new Error(`Error retrieving categories: ${err.message}`);
    }
    
}

const deleteCategories = async (req, res, next) => {
    try {
        await Category.deleteMany();
        
        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json({
            success: true, msg: 'delete all category'
        })
        
    } catch (err) {
        throw new Error(`Error deleting categories: ${err.message}`);

    }
  
}

// for '/:categoryId' endpoint
const getCategory  = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.categoryId);
        
        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(result)
        
    } catch (err) {
        throw new Error(`Error getting categories:${req.params.categoryId}, ${err.message}`);

    }
}

const updateCategory  = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.categoryId, {
            $set: req.body
        },{
            new: true,
        });
        
        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(result)
        
    } catch (err) {
        throw new Error(`Error updating categories:${req.params.categoryId}, ${err.message}`);

    }
}

const deleteCategory  = async (req, res, next) => {
    try {
       await Category.findByIdAndDelete(req.params.categoryId);
        
        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json({
            success: true, msg: `delete category(s) with id:${req.params.categoryId}`
        })
                
    } catch (err) {
        throw new Error(`Error deleting categories:${req.params.categoryId}, ${err.message}`);

    }
}

module.exports = {
    getCategories,
    postCategory,
    deleteCategories,
    getCategory,
    updateCategory,
    deleteCategory
}