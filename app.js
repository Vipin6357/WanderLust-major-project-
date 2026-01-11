if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
};

const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const ejs = require("ejs");
// const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const  {listingSchema, reviewSchema} = require("./Schema.js");  jo files comment ki wo ab app.js me use nhi ho rahi hai
// const review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require ("passport-local");
const User = require("./models/user.js");





// require routes 
const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");




const dbUrl = process.env.ATLASDB_URL;

main()
    .then(res => console.log("connected to DB"))
    .catch(err => console.log(err));


async function main(){
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto : {
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error", (err) => {
    console.log("error in mongo session store", err);
});

const sessionOption = {
    store,  // ya store : store, bhi write kr skte hai 
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized : true,
    cookie: {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 1000*60*60*24*7,
        httponly: true,
    }
};

app.get("/", (req, res)=>{
    res.redirect("/listings");

});




app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser( User.serializeUser());
passport.deserializeUser(  User.deserializeUser());


//listing and reviews routes se pahele hum middleware create krenge aur flash success and error ko access krenge 
app.use((req,res,next) => {
   res.locals.success = req.flash("success");
   res.locals.error = req.flash("error");
   res.locals.currUser = req.user;
   next(); 
});


// to use listings.js routes
app.use("/listings", listingRouter);
//REVIEWS 
app.use("/listings/:id/reviews", reviewsRouter);
//user Router
app.use("/", userRouter);

app.use((req, res, next) => {
    next(new ExpressError(404, "Page not Found!"));
});


// ✅ Centralized error handler
app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs", {message});
    // res.status(statusCode).send(message);
});


app.listen(8080, () =>{
    console.log("server is listening at post 8080");
})

