const router = require("express").Router();
const {Design} = require("../database/design.js");

router.get("/" , (req,res,next) =>{

    Design.find({},function(err,result){
        res.render("index", {design : result});
    });
});
router.get("/join" , async(req,res,next)=>{
    res.render("main");
});
router.get("/blog" , async(req,res,next)=>{
    res.render("blog");
});

module.exports = router
