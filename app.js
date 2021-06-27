const express = require("express");
const createHttpError = require("http-errors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const ejs = require("ejs");
require("dotenv").config();
const {upload} = require("./database/setup");
const session = require("express-session");
const connectFlash = require("connect-flash");
const passport = require("passport");
const MongoStore = require("connect-mongo");
const connectEnsureLogin = require("connect-ensure-login");
const {roles} = require("./utils/constants");
const multer = require("multer");

const app = express();
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/uploads"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(session({
    store: MongoStore.create({mongoUrl:process.env.MONGO_URI}),
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:false,
    Cookie:{
        // secure:true,
        httpOnly:true
    }
}));

app.use(passport.initialize());
app.use(passport.session());
require(__dirname+"/utils/passport.auth.js");
app.use( ( req,res,next) =>{
    res.locals.user = req.user;
    next();
});

app.use(connectFlash());

// app.use( ( req,res,next) =>{
//     res.locals.message = req.flash();
//     next();
// });


app.use("/" , require("./routes/index.route"));
app.use("/auth" , require("./routes/auth.route"));
app.use("/user" ,connectEnsureLogin.ensureLoggedIn({redirectTo:"/auth/login"}), require("./routes/user.route"));
app.use("/admin" ,connectEnsureLogin.ensureLoggedIn({redirectTo:"/auth/login"}),ensureAdmin, require("./routes/admin.route"));

// app.use( (req,res,next) => { 
//     next(createHttpError.NotFound());
// });

// app.use( (error,req,res,next) => {
//     error.status = error.status || 500
//     res.status(error.status);
//     res.render("error_40x" , {error});
// });

const PORT = process.env.PORT;
app.listen(PORT || 3000,function(){
    console.log("server is running on "+ PORT +" port");
});
function ensureAdmin(req,res,next){
    if(req.user.role===roles.admin)
    {
        next();
    }
    else
    {
        req.flash("warning" , "you are not authorized to see this route")
        res.redirect("/");
    }
}



