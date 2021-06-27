const router = require("express").Router();
const {Design} = require("../database/design");
const {order_upload} = require("../database/setup_order");
const {OrderDB} = require("../database/order");

router.get("/profile" , async (req,res,next)=>{
    const person=req.user;
    
    res.render("profile",{person})
});
router.get("/design/:customDesign",function(req,res)
{
    const custom_design_name = req.params.customDesign;
    Design.findOne({heading:custom_design_name},function(err,foundList){
        if(!err)
        {
            if(!foundList)
            {
                
                res.redirect("/");
            }
            else
            {
                
                res.render("showcase",{show:foundList});
                
            }
        }
    });
});

router.get("/order" , async (req,res,next)=>{
    res.render("order")
});
router.post("/order" ,order_upload.single("order_img") , async (req,res,next)=>{
    
    const neworder = new OrderDB({
        userid:req.user._id,
        email:person.email,
        name:person.name,
        address:person.address,
        mob:person.mob,
        mob2:person.mob2,
        city:person.city,
        state:person.state,
        zip:person.zip,
        description:person.description,
        type:person.type,
        order_img:req.file.filename,
    });
    neworder.save();
    res.render("sucess" , {message : "your order is placed sucessfully" });
});


module.exports = router