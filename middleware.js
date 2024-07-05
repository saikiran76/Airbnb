const Listing = require('./models/Listing')
const ExpressError = require('./utils/ExpressError.js')
const {ListingSchema, reviewSchema} = require('./schema.js');
const review = require('./models/review.js');

module.exports.isLoggedIn = (req, res, next)=>{
    console.log(req.path, '..', req.originalUrl);
    req.session.redirectUrl = req.originalUrl;
    console.log(req.user);
    if(!req.isAuthenticated()){
        req.flash("error", "You must be logged in to create a listing");    // flash message
        return res.redirect("/login");
    }
    next();
}

module.exports.isLoggedOut = (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash('error', 'Unauthorized') // Only respective owner can update the listing
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = ((req, res, next) => {
    console.log("Validation started")
    let {error} = ListingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new Error(400, errMsg);
    }
    else {
        next();
    }
});


module.exports.validateReview = (req, res, next) =>{
    let {error} = reviewSchema.validate(req.body);
    // console.log(result);
    if(error){
        let errMessage = error.details.map((el) => el.message).join(",");
        throw new ExpressError(errMessage, 400); 
    }else{
        next();
    }
} 

module.exports.IsReviewAuthor = async(req, res, next) =>{
    let {id, reviewId} = req.params;   
    // console.log(result);
    let review = await review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash('error', 'Unauthorized to delete this review');
        return res.redirect(`/listings/${id}`);
    }
} 