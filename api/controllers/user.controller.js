import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import User from '../models/user.model.js';
import Listing from '../models/listing.model.js';

export const test = (req, res) => {
    res.json({
        message: "API route is working"
    })
};

export const updateUser = async (req, res, next) => {
    if(req.user.id !== req.params.id)  { //if the _id which we got from cookie and id which we got from user(params) are not equal then we should send error message - "You can only update your own account"
        return next(errorHandler(401, "You can only update your own account"))
    }
    try {
        //if the user is trying to change his password then we need to hash the password
        if(req.body.password) {
            //req.body.password = bcryptjs.hashSync(req.body.password, 10);
            const hashedPassword = bcryptjs.hashSync(req.body.password, 10);
            req.body.password = hashedPassword;
        }
        
        //const updatedUser = User.findByIdAndUpdate(req.params.id, {$set: req.body}); //what is the use of set -> there are high chaces that user updates only his username -> in that case set will set the username to new one and will ignore the other fields(email, password, avatar)
        //but there is one more problem in the above line -> we should not simply send req.body because the user can send other fields other than the required fields say isAdmin: true and can hack the database.
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar
            }
        }, {new: true}); //{new: true} -> if we didn't add this then updatedUser will still return the old data instead of new data
        //console.log(updatedUser)
        const {password: pass, ...rest} = updatedUser._doc;

        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
}


export const deleteUser = async (req, res, next) => {
    if(req.user.id != req.params.id) {
        return next(errorHandler(401, "You can only delete your own account"));
    }
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie("access_token").status(200).json("User has been deleted");
    } catch (error) {
        next(error);
    }
}

export const getUserListings = async (req, res, next) =>{
    if(req.user.id != req.params.id) {
        return next(errorHandler(401, "You can only view your own listings!"));
    }
    try {
        const listings = await Listing.find({userRef: req.params.id});
        res.status(200).json(listings);
    } catch (error) {
        next(error);
    }
}