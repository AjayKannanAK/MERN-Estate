import express from 'express';
import { deleteUser, test, updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyToken.js';

const router = express.Router();

router.get("/test", test)
router.post("/update/:id", verifyToken, updateUser); //verifyToken is the middleware to check if the user is authorized or not(i.e signed in or not)
router.delete("/delete/:id", verifyToken, deleteUser);

export default router;