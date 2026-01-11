const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review = require("./review.js");

// const defaultImage = {
//   filename: "default",
//   url: "https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg",
// };

const listingSchema = new Schema ({
    title : {
        type : String,
        required : true,
    },
    description : String,
    image: { 
        
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
            set: (v) => 
                v === "" 
                ? "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170"
                : v,
        },
        filename: String,
    },



    price :{
        type: Number,
        required : true,
        default: 1,
    },
    location : {
        type : String,
        required : true,
    },
    country : {
        type : String,
        required : true,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref : "review"
        }
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
});

listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing){
        await review.deleteMany({_id : {$in : listing.reviews}});
    }
    
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;