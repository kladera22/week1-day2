const express = require('express');
const router = express.Router();
const {
    getItems,
    postItem,
    deleteItems,
    getItem,
    updateItem,
    deleteItem
} = require('../controllers/itemController');

//root
router.route('/')
    .get(getItems)
    .post(postItem)
    .delete(deleteItems)

router.route('/:itemId')
    .get(getItem)
    .put(updateItem)
    .delete(deleteItem)

module.exports = router;