const User = require('../models/User');
const crypto = require ('crypto')

// for  '/' endpoint
const getUsers = async (req, res, next) => {
// query paramater

    const filter = {}; //to return only selected fields
    const options = {}; //sorting, pagination e.g. limit data to come back, or sorting by asc of userName

    if (Object.keys(req.query).length){
        const { userName, 
                gender,
                limit,
                sortbyFirstName
            } = req.query

        if (userName) filter.userName = true
        if (gender) filter.gender = true

        if (limit) options.limit = limit;
        if (sortbyFirstName) options.sort = {
            firstName: sortbyFirstName === 'asc' ? 1: -1 
        }
    }
    try {
        const users = await User.find({}, filter, options);

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(users)

    } catch (err) {
        throw new Error(`Error getting user: ${err.message}`);
    }
}

const postUser = async (req, res, next) => {
    try {
        const user = await User.create(req.body);

     sendTokenResponse(user, 201, res)

    } catch (err) {
        throw new Error(`Error retrieving user: ${err.message}`);
    }
}

const deleteUsers = async (req, res, next) => {
    try {
        await User.deleteMany();
        
        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json({
            success: true, msg: 'delete all user'
        })
        
    } catch (err) {
        throw new Error(`Error deleting user: ${err.message}`);
    }
  
}

// for '/:categoryId' endpoint
const getUser  = async(req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        
        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(user)
        
    } catch (err) {
        throw new Error(`Error getting user:${req.params.userId}, ${err.message}`);
    }
}

const updateUser  = async(req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.userId, {
            $set: req.body
        },{
            new: true,
        });
        
        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(user)
        
    } catch (err) {
        throw new Error(`Error updating user:${req.params.userId}, ${err.message}`);
    }
}

const deleteUser  = async(req, res, next) => {
    try {
        await User.findByIdAndDelete(req.params.userId);
         
         res
         .status(200)
         .setHeader('Content-Type', 'application/json')
         .json({
             success: true, msg: `delete user(s) with id:${req.params.userId}`
         })
                 
     } catch (err) {
         throw new Error(`Error deleting user:${req.params.userId}, ${err.message}`);
     }
};

 // for '/login'
const login = async (req, res, next) => {
    const {email, password} = req.body;

    if(!email || !password) throw new Error('Please provide a email and password');
    
    //find a user by email and return with password
    const user = await User.findOne({email}).select('+password');

    if(!user) throw new Error('Invalid credentials');

    // check if password matches
    const isMatch = await user.matchPassword(password)

    if(!isMatch) throw new Error('Invalid Credentials');
    
    sendTokenResponse(user, 200, res);

};

// for '/forgotPassword'
const forgotPassword = async (req, res, next) => {
    const user = await User.findOne({email: req.body.email});

    if(!user) throw new Error('No user found');

    const resetToken = user.getResetPasswordToken();

    try {
        await user.save({validateBeforeSave: false})

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json({
            success: true,
            msg: `Password has been reset with token: ${resetToken}`
        })
  
    } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false})

        throw new Error('Failed to save reset password token')
    }
}

// for '/resetPassword'

const resetPassword = async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.query.resetToken).digest('hex')

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()} // find a resetPasswordExpire greater than the current time
    })

    if(!user) throw new Error('Invalid token');
    
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save()

    sendTokenResponse(user, 200, res)
}

const updatePassword = async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password')

    const passwordMatches = await user.matchPassword(req.body.password)

    if(!passwordMatches) throw new Error ('Password is incorrect')

    user.password = req.body.newPassword;

    await user.save()

    sendTokenResponse(user, 200, res)
}

const logout = async (req, res, next) => {
    res
    .status(200)
    .cookie('token', 'none', {
        expires: new Date(Date.now() +10 *1000),
        httpOnly: true
    })
    .json({success: true, msg:'Successfully logged out!'})

    await user.save()
}


const sendTokenResponse = (user, statusCode, res) => {
    //generate token to send back to the user!
    const token = user.getSignedJwtToken();

    const options = {
        // set expiration for cookie to be?
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE *24*60*60*1000),
        httpOnly: true //security to hide/encrypt payload
    }

    if(process.env.NODE_ENV === 'production') options.secure = true;

    res
    .status(statusCode) //stored in the header
    .cookie('token', token, options) //stored in the header
    .json({success: true, token}) //stored in body
}

module.exports = {
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
}