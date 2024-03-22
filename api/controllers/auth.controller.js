import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';

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