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

export const getAllListingsInDb = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = req.query.startIndex || 0;
        let offer = req.query.offer;
        if(offer == undefined || offer == false) {
            offer = {$in: [false, true]}; // $in - Matches any of the values specified in an array. This means offer can be either false or true. This means return listings which can either have an offer or it doesn't have an offer.
        }

        let furnished = req.query.furnished;
        if(furnished === undefined || furnished === false) {
            furnished = {$in: [false, true]};
        }

        let parking = req.query.parking;
        if(parking === undefined || parking === false){
            parking = {$in: [false, true]};
        }

        let type = req.query.type;
        if(type === undefined || type === "all") {
            type = {$in: ["sale", "rent"]};
        }

        const searchTerm = req.query.searchTerm || '';
        const sort = req.query.sort || 'createdAt';
        const order = req.query.order || 'desc';

        const listings = await Listing.find({
            name: {$regex: searchTerm, $options: 'i'}, //$options -> it can be either be lowercase or uppercase
            offer,
            furnished,
            parking,
            type,
        }).sort(
            {[sort]: order} //eg. this sorts according to descending order of createdAt //[sort] - gives createdAt whereas sort gives "createdAt"
        ).limit(limit).skip(startIndex); //if the startIndex is 0 then it's gonna start from the beginning but if it's 1 then it gonna skip the first 9 because we want to limit it to 9 by default

        res.status(200).json(listings);
    } catch (error) {
        next(error);
    }
}