import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    const {username, email, password} = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10); // hashSync is already using await so we are not using await
    try {
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        })
        res.status(201).json("User created successfully");
    } catch (error) {
        //res.status(500).json(error.message) //instaed of writing this for every api, we can create a middleware and it will handle error part
        //for using the middleware add next in arguments
        //go to index.js -> you will see app.use at the bottom and that is the middleware which we created
        next(error);
    }
}

export const signin = async (req, res, next) => {
    const {email, password} = req.body;
    try {
        //check wheather email exists in db or not
        const validUser = await User.findOne({ email });
        if(!validUser) { return next(errorHandler(404, "User not found!")) };
        //if exists then check wheather password entered and password in db is same or not
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if(!validPassword) { return next(errorHandler(401, "Wrong credential!")) };

        //if password is crct then create a jsonwebtoken
        const token = jwt.sign({ id: validUser._id}, process.env.JWT_SECRET);
        const { password: pass, ...rest } = validUser._doc; //while sending back the json in postman - we should not send password(even though it is hashed). So here we are separating password and rest details, and storing the rest details in a const rest. Why validUser._doc? try to do like this by keeping only validUser and note the difference in postman
        res.cookie("access_token", token, { httpOnly: true }).status(200).json(rest); //we should not send validUser because it contains password, so only we are not directly sending validUser
    } catch (error) {
        next(error);
    }
}