import express from 'express';
import { deleteUser, test, updateUser, getUserListings, getListingUserInfo } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyToken.js';

const router = express.Router();

router.get("/test", test)
router.post("/update/:id", verifyToken, updateUser); //verifyToken is the middleware to check if the user is authorized or not(i.e signed in or not)
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/listings/:id", verifyToken, getUserListings); //to get the listings posted by a particular user
router.get("/listingUserInfo/:id", verifyToken, getListingUserInfo) //to get the details of the user who posted the listing

export default router;