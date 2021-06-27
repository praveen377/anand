const bodyParser = require("body-parser");
const passport = require("passport");


const connectEnsureLogin = require("connect-ensure-login");
const {upload} = require("./database/setup")


app.use(morgan("dev"));


app.use(bodyParser.urlencoded({extended:true}));




app.use(passport.initialize());
app.use(passport.session());
require("../utils/passport.auth.js");


app.use((req,res,next)=>{
    res.locals.user = req.user
    next();
})

app.use(connectFlash());
app.use((req ,res ,next)=>{
    res.locals.message = req.flash();
    next();
})

app.use("/" , require("../routes/index.route"));


//admin protected ,autheticate
app.get("/total_order",async (req,res)=>{
    res.render("order");
})
//admin protected ,autheticate
app.post("/add", upload.single('design_img') , function(req,res)
{
    console.log(req.body);
    console.log(req.file);
    const newdesign = new Design({
        heading:req.body.heading,
        sec_head:req.body.sec_head,
        head_des:req.body.head_des,
        path:req.file.filename,
        fb:req.body.fb,
        google:req.body.google,
        linkedin:req.body.linkedin,
        twitter:req.body.twitter,
        para1:req.body.para1,
        para2:req.body.para2,
        para3:req.body.para3,
        web:req.body.web
    });
    newdesign.save();
    res.redirect("/");
});
//user , autheticate

// admin autheticate
app.get("/add",async function(req,res){
    res.render("add_item");
});
