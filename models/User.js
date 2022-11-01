const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcrypt');


const UserSchema = new Schema({
    userName: {
        type: String,
        unique: true,
        required: true,
        maxLength: [10, 'User Name cannot be more than 10 characters']
    },

    firstName: {
        type: String,
        required: true,
    },

    lastName: {
        type: String,
        required: true,
    },

    gender: {
        type: String,
        required: true,
        enum: [
            'Male',
            'Female'
        ]
    },

    email: {
        type: String,
        unique: true,
        required: [true, 'Please add a email'],
        validate: (email) => {
            return validator.isEmail(email)
        }
    },

    password: {
        type: String,
        required: [true, 'Please add a password'],
        validate: (password) => {
            return validator.isStrongPassword(password)
        }
    },

    phoneNumber: {
        type: String,
        required: [true, 'Please add a phone number'],
        validate: (phoneNumber) => {
            return validator.isNumeric(phoneNumber)
        }
    },

    resetPasswordToken: {
        type: String
    },

    resetPasswordExpire: {
        type: Date
    },

    admin: {
        type: Boolean,
        default: false
    }

},{
    timestamps: true
})

// bcrypt - prehook to hash our password
UserSchema.pre('save', async function(next){

    //check if password is not modified
    if(!this.isModified('password')) next();

    //length of the hash
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
});

// generate jwt token
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

// match password for login
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

UserSchema.methods.getResetPasswordToken = function () {
    // create a hex token with size of 20
    const resetToken = crypto.randomBytes(20).toString('hex')

    // create a hash to increase security and tell it that it came from hex
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    this.resetPasswordExpire = Date.now() +10 *60*1000 // expire in 1hr
    return resetToken;
}

module.exports = mongoose.model('User', UserSchema);
