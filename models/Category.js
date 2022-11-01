const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    categoryName: {
        type: String,
        required: [true, 'Please add a category'],
        unique: true,
        trim: true,
        maxLength: 15,
    },

    gender: {
        type: String,
        required: true,
        enum: [
            'Male',
            'Female'
        ]
    }
},{
    timestamps: true

})

module.exports = mongoose.model('Category', CategorySchema);

