const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing =require("../models/listing.js");
const {isLoggedIn,isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({storage});

router.route("/")
.get(wrapAsync(listingController.index))
.post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
);
// New Route
router.get("/new",isLoggedIn,listingController.renderNewForm );

router.route("/:id")
.get(wrapAsync( listingController.showListing))
.put(isLoggedIn,
    isOwner, 
    upload.single("listing[image]"),
    validateListing,
wrapAsync(listingController.updateListing)
)
.delete(isLoggedIn,isOwner,
wrapAsync(listingController.destroyListing));

// /Edit Route

    router.get('/:id/edit', async (req, res) => {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash('error', 'Cannot find that listing!');
            return res.redirect('/listings');
        }
        res.render('listings/edit', { listing });
    });

module.exports = router;