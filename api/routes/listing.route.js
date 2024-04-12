import express from "express";
import { createListing, deleteListing, updateListing, getListing, getAllListingsInDb } from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/create", verifyToken, createListing);
router.delete("/delete/:id", verifyToken, deleteListing);
router.post("/update/:id", verifyToken, updateListing);
router.get("/get/:id", getListing); //to get a single listing by passing listing id
router.get("/get", getAllListingsInDb); //to get all listings in db for searchpage and homepage

export default router;