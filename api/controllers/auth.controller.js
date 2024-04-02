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

export const google = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if(user) { //if user exists then create a jwt token and store it in cookie 
            const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET);
            const {password: pass, ...rest} = user._doc;
            res.cookie("access_token", token, {httpOnly: true}).status(200).json(rest);
        }
        else { //if user not found in db then add user to the database with the details which we got using googleAuth like displayName, email etc. And in User model password is required - so generate a random 16 digit password and store that in db.
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = await User.create({
                //username: req.body.name //if we do like this then we get say "Ajay Kannan". But we dont want to store it like this -> we don't want spacing and want them to be in lowercase and also we can add random alphanumeric string of 4 characters for convenience
                username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.photo
            });
            const token = jwt.sign({ id: newUser._id}, process.env.JWT_SECRET);
            const {password: pass, ...rest} = newUser._doc;
            res.cookie("access_token", token, {httpOnly: true}).status(200).json(rest);
        }
    } catch (error) {
        next(error);
    }
}