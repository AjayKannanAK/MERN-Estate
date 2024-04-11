import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
    } catch (error) {
        next(error);
    }
}

export const deleteListing = async (req, res, next) => {
    //first check if the listing exists or not
    const listing = await Listing.findById(req.params.id);
    if(!listing) {
        return next(errorHandler(404, "Listing not found!"))
    }
    //if listing found then check if the user is the owner of the listing
    if(req.user.id != listing.userRef) {
        return next(errorHandler(401, "You can only delete your own listings!"))
    }
    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json("Listing deleted successfully")
    } catch (error) {
        next(error);
    }
}

export const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    console.log(listing);
    if(!listing) {
        return next(errorHandler(404, "Listing not found!"))
    }
    if(req.user.id != listing.userRef) {
        return next(errorHandler(401, "You can only update your own listings!"))
    }
    try {
        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}, //{new: true} -> if we didn't add this then updatedUser will still return the old data instead of new data
        );
        res.status(200).json(updatedListing);
    } catch (error) {
        next(error);
    }
    
}

export const getListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if(!listing) { return next(errorHandler(404, "Listing not found!")) }
        res.status(200).json(listing);
    } catch (error) {
        next(error);
    }
}