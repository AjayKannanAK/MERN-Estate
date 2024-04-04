import express, { Router } from 'express';
import { google, signin, signout, signup } from '../controllers/auth.controller.js';
import { verifyToken } from '../utils/verifyToken.js';


const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
router.get("/signout", signout); //why we are not using verifyToken middleware to check authentication here -> say if the user is signed in and he clears cookies. If he tries to signout now it will throw an error. To avoid this error we are not using verifyToken middleware.

export default router;