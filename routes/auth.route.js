const router = require("express").Router();
const passport = require("passport");
const User = require("../models/user.model");
const {body, validationResult } = require("express-validator");

router.get("/login" ,ensureNotAutheticated, async (req,res,next)=>{
    res.render("login");
});
// router.post("/login",(req,res)=>{
//     console.log(req.body);
//     res.send(req.body);
// });
router.post("/login" ,ensureNotAutheticated, passport.authenticate("local" , {
    
    successReturnToOrRedirect:"/",
    failureRedirect:"/auth/login",
    failureFlash:true
}));

router.get("/register" ,ensureNotAutheticated, async (req,res,next)=>{
    res.render("register");
});
// router.post("/register",(req,res)=>{
//     console.log(req.body);
//     res.send(req.body);
// });
router.post("/register" ,ensureNotAutheticated,[
    body('email').trim().isEmail()
    .withMessage("Email must be a valid email").normalizeEmail()
    .toLowerCase(),
    body("password").trim().isLength(2)
    .withMessage("password length short min 2 char required"),
    body("password2").custom ((value , {req} )=> {
        if(value !== req.body.password){
            throw new Error("password do not match");
        }
        return true;
    })
    ], async (req,res,next)=>{
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            errors.array().forEach(error=>{
                req.flash("error" , error.msg)
            })
            res.render("register" ,{ email:req.body.email,message:req.flash()})
            return;
        }
        const {email} = req.body;
        const doesExist = await User.findOne({email});
        if(doesExist)
        {
            req.flash("error" , email+" is already used");
            res.redirect("/auth/register");
            // console.log(req.body);
            return;
        }

        const user = new User(req.body);
        await user.save();
       
        res.redirect("/auth/login");
    } catch (error) {
        next(error);
    }
    
});

router.get("/logout" ,ensureAutheticated,async (req,res,next) =>{
    req.logOut();
    res.redirect("/");
    // res.send("logout");
});

function ensureAutheticated(req,res,next){
    console.log(req.body);
    if(req.isAuthenticated()){
        next();
    }else{
        res.redirect("/auth/login");
    }
}

function ensureNotAutheticated(req,res,next){
    if(req.isAuthenticated()){
        res.redirect("back");
    }else{
        next();
    }
}


module.exports = router