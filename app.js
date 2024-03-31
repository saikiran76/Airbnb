if(process.env.NODE_ENV != 'production') {
    require('dotenv').config();
}
// Now in development phase

console.log(process.env.CLOUD_NAME);

const express = require('express');
const app = express();
const engine = require('ejs-mate');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user.js');
const MongoStore = require('connect-mongo');
const userRoutes = require('./routes/user.js');


const Listing = require('./models/Listing.js');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");


const ExpressError = require("./utils/ExpressError.js"); 

const listings = require('./routes/listing.js');
const reviews = require('./routes/review.js');

const port = 4000;
// const Mongo_url = "mongodb://127.0.0.1:27017/Airbnb";
const dbUrl = process.env.MONGO_URL;

main()
 .then(() => {
    console.log('Successfully Connected Mongoose');
 })
 .catch((err) => {
    console.log(err);
 })

async function main() {
    await mongoose.connect(dbUrl);
}

const store =  MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET, 
      },
      touchAfter: 24 * 3600,
});
// view engine setup
app.set('view engine', 'ejs' );
app.set('views', path.join(__dirname, '/views'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '/public')));
app.engine("ejs", engine);
  

const sessionOptions = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }

};


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize()); // passport middleware
app.use(passport.session()); 
passport.use(new localStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next)=>{
    // res.locals.success = req.session;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    console.log(res.locals.success);
    next();
});

app.get('/demouser', async(req, res)=>{
    let fakeUser = new User({
        email: "daipattase@gmail.com",
        username: "alias-ceaser"
    });

    let registeredUser = await User.register(fakeUser, "hello");
    res.send(registeredUser);

})

app.use('/listings', listings);
app.use('/listings/:id/reviews', reviews);
app.use('/listings', reviews);
app.use('/', userRoutes); // user route middleware

app.get('/', (req, res)=>{
    res.redirect('/listings');;
})



app.all("*", (req, res, next) => {
    console.log('sdd');    
    next(new ExpressError(404, "Page Not Found")); 
});


// Error handling middleware
app.use((err, req, res, next) => {
    const { statusCode=500, message = 'Something went wrong!' } = err;
    res.status(statusCode).render('Error.ejs', {message})
});
  


app.listen(port, ()=>{
    console.log(`App started running at port: ${port}`);
})



