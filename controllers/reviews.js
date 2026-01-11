const review = require("../models/review.js");
const Listing = require("../models/listing.js");


module.exports.createReview = async(req, res) => {
    
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = new review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();

    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`); // or (`/listings/${id}`);
};

module.exports.deleteReview = async(req, res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews : reviewId}});  // issh line se mujhe toh koi antr lga nhi but imp line for database to remove reviewId 
    await review.findByIdAndDelete(reviewId);
    
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);

};