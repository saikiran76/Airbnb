const Listing = require('../models/Listing');
const Review = require('../models/review');

module.exports.reviewPost = async (req, res) => {
    const id = req.params.id; // Extract the ID parameter from req.params
    console.log("ID parameter:", id);

    try {
      let listing = await Listing.findById(id);
      if (!listing) {                
        req.flash("error", "Listing not found");
        return res.redirect("/listings"); // Handle the case where the listing is not found
      }

      let newReview = new Review(req.body.review);
      newReview.author = req.user._id;
      console.log("New review:", newReview);
      listing.reviews.push(newReview);

      await newReview.save();
      await listing.save();
      req.flash("success", "Review added");
      console.log("New review saved");
      res.redirect(`/listings/${id}`);
    } catch (error) {
      console.error("Error adding review:", error);
      req.flash("error", "Failed to add review");
      res.redirect(`/listings/${id}`);
    }
  }


module.exports.destroyReview = async(req, res)=>{
    console.log("DELETE /listings/:id/reviews/:reviewId route hit");
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {
        $pull: {
            reviews: reviewId
        }
    });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted');
    res.redirect(`/listings/${id}`);
  }