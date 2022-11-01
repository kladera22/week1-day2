const Item = require('../models/Item');
const path = require('path');

// for '/' endpoint
const getItems = async (req, res, next) => {
    // query paramater
    if (Object.keys(req.query).length){
        const { 
            itemName,
            itemDescription,
            gender, 
            price,
            isClearance,
            colors,
            sizes } = req.query

        const filter = [];

        if (itemName) filter.push(itemName);
        if (itemDescription) filter.push(itemDescription);
        if (gender) filter.push(gender);
        if (price) filter.push(price);
        if (isClearance) filter.push(isClearance);
        if (colors) filter.push(colors);
        if (sizes) filter.push(sizes)

        for(let i=0; i < filter.length; i++){
            console.log(`Searching item(s) by: ${filter[i]}`)
        }
    }

    try {
        const items = await Item.find();

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(items)

    } catch (err) {
        throw new Error(`Error getting item: ${err.message}`);
    }


}

const postItem = async (req, res, next) => {
    try {
        const item = await Item.create(req.body);

        res
        .status(201)
        .setHeader('Content-Type', 'application/json')
        .json(item)

    } catch (err) {
        throw new Error(`Error retrieving item: ${err.message}`);
    }
}

const deleteItems = async (req, res, next) => {
    try {
        await Item.deleteMany();
        
        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json({
            success: true, msg: 'delete all item'
        })
        
    } catch (err) {
        throw new Error(`Error deleting item: ${err.message}`);

    }
}

// for '/:itemId' endpoint
const getItem  = async (req, res, next) => {
    try {
        const item = await Item.findById(req.params.itemId);
        
        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(item)
        
    } catch (err) {
        throw new Error(`Error getting item:${req.params.itemId}, ${err.message}`);

    }
}

const updateItem  = async (req, res, next) => {
    try {
        const item = await Item.findByIdAndUpdate(req.params.itemId, {
            $set: req.body
        },{
            new: true,
        });
        
        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(item)
        
    } catch (err) {
        throw new Error(`Error updating item:${req.params.itemId}, ${err.message}`);

    }
}

const deleteItem  = async (req, res, next) => {
    try {
        await Item.findByIdAndDelete(req.params.itemId);
         
         res
         .status(200)
         .setHeader('Content-Type', 'application/json')
         .json({
             success: true, msg: `delete item(s) with id:${req.params.itemId}`
         })
                 
     } catch (err) {
         throw new Error(`Error deleting item:${req.params.itemId}, ${err.message}`);
 
     }
};

// for '/:itemId/ratings'
const getItemRatings = async (req, res, next) => {
    try {
        const item = await Item.findById(req.params.itemId);
        const ratings = item.ratings;

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(ratings)
                
    } catch (err) {
        throw new Error(`Error retrieving ratings: ${err.message}`);
    }
}

// for '/:itemId/ratings/:ratingId'
const postItemRating = async (req, res, next) => {
    try {
        const item = await Item.findById(req.params.itemId);
        item.ratings.push(req.body);

        const result = await item.save(); //saving the new item with the new rating

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(result)
    }

    catch (err) {
        throw new Error(`Error retrieving ratings: ${err.message}`);
    }
}

const deleteItemRatings = async (req, res, next) => {
    try {
        const item = await Item.findById(req.params.itemId);

        item.ratings = [];

        await item.save();
      
        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json({
            success: true, msg: `delete all ratings for item id:${req.params.itemId}`
        })
    }

    catch (err) {
        throw new Error(`Error retrieving ratings: ${err.message}`);
    }
}

// for '/:itemId/ratings/:ratingId'
const getItemRating = async (req, res, next) => {
    try {
        const item = await Item.findById(req.params.itemId);
        const rating = item.ratings.find(rating => (rating._id).equals(req.params.ratingId))

        if(!rating) {rating = {success:false, msg: `No rating found with rating id: ${req.params.ratingId}`}}

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(rating)

    } catch (err) {
        throw new Error(`Error retrieving ratings: ${err.message}`)
    }
}

const updateItemRating = async (req, res, next) => {
    try {
        const item = await Item.findById(req.params.itemId);
        let rating = item.ratings.find(rating => (rating._id).equals(req.params.ratingId))

            if(rating) {
                const ratingIndexPosition = item.ratings.indexOf(rating);
                item.ratings.splice(ratingIndexPosition, 1, req.body);
                rating = item.ratings[ratingIndexPosition];
                await item.save();
            }
            else {
                rating = {success:false, msg: `No rating found with rating id: ${req.params.ratingId}`}
            }

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(rating)

    } catch (err) {
        throw new Error(`Error retrieving ratings: ${err.message}`)
    }
}

const deleteItemRating = async (req, res, next) => {
    try {
        const item = await Item.findById(req.params.itemId);
        let rating = item.ratings.find(rating => (rating._id).equals(req.params.ratingId));
        
        if(rating) {
            const ratingIndexPosition = item.ratings.indexOf(rating);
            item.ratings.splice(ratingIndexPosition, 1);
            await item.save();
        }
        else {
            rating = {success:false, msg: `No rating found with rating id: ${req.params.ratingId}`}
        }

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json({
            success: true, msg: `delete rating with id:${req.params.ratingId}`
        })

    } catch (err) {
        throw new Error(`Error retrieving ratings: ${err.message}`)
    }
}

//

const postItemImage = async (req, res, next) => {
    if(!req.files) throw new Error('Missing image!')

    const file = req.files.file

    // check if file is image
    if(!file.mimetype.startsWith('image')) throw new Error('Please upload a image file type!')
    // check for file size
    if(file.sizes > process.env.MAX_FILE_SIZE) throw new Error(`Image exceeds size of ${process.env.MAX_FILE_SIZE}`)

    file.name = `photo_${path.parse(file.name).ext}`
 
    const filePath = process.env.FILE_UPLOAD_PATH + file.name
    
    // file.mv(path.resolve(__dirname,`${process.env.FILE_UPLOAD_PATH}`, file.name), async (err) => {
        file.mv(filePath, async (err) => {
        if(err) throw new Error('Problem uploading photo')

        await Item.findByIdAndUpdate(req.params.itemId, { image: file.name })

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json({success: true, data: file.name})
    })
}



module.exports = {
    getItems,
    postItem,
    deleteItems,
    getItem,
    updateItem,
    deleteItem,
    getItemRatings,
    postItemRating,
    deleteItemRatings,
    getItemRating,
    updateItemRating,
    deleteItemRating,
    postItemImage
}