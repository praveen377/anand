const User = require("../models/user.model");
const router = require("express").Router()
const mongoose = require("mongoose");
const roles = require("../utils/constants");
const { findByIdAndUpdate } = require("../models/user.model");
const {upload} = require("../database/setup");
const {Design} = require("../database/design");
const {OrderDB} = require("../database/order");
router.get("/users" , async(req,res,next)=>{
    try {
        const users= await User.find();
        res.render("manage-users" , {users});
    } catch (error) { 
        next(error);
    }
});

router.get("/user/:id", async(req,res,next) =>{
    try {
        const {id} = req.params;
        if(!mongoose.Types.ObjectId.isValid(id))
        {
            req.flash("error" , "Invalid id");
            res.redirect("/admin/users");
            return;
        }
        const person = await User.findById(id);
        res.render("profile",{person});
    } catch (error) 
    {
        next(error);
    }
});
//admin protected ,autheticate
router.get("/total_order",async (req,res)=>{
    const orders = await OrderDB.find();
    res.render("total_order",{orders});
});
router.get("/add",(req,res)=>{
    res.render("add_item")
});

router.post("/add", upload.single('design_img') , function(req,res)
{
    
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
router.post("/update-role" , async (req,res,next)=>{
    const {id,role} = req.body;
    //checking for id and roles in req body
    if(!id || !role)
    {
        req.flash("error" , "invalid request")
        return res.redirect("back");
    }
    //check for valid mongoose objectID
    if(!mongoose.Types.ObjectId.isValid(id))
    {
        req.flash("error" , "Invalid id");
        return res.redirect("back");
    }
    //check for valid  role 
    const rolesArray = Object.values(roles);
    // console.log(rolesArray);
    // console.log(role);
    // if(!rolesArray.includes(role)){
    //     req.flash("error" , "Invalid role");
    //     return res.redirect("back");
    // }
    //admin cannot remove himself/herself as an admin
    if(req.user.id===id){
        req.flash("error" , "admins canot remove themselves from admin role");
        return res.redirect("back");
    }
    //fially update role
    const user = await User.findByIdAndUpdate(id , {role:role} , {new:true,runValidators:true});
    req.flash("info" , "updated role for "+user.email+" to "+user.role);
    res.redirect("back");
})

module.exports = router;