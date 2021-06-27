const mongoose = require("mongoose");

const designschema = new mongoose.Schema({
    heading:String,
    sec_head:String,
    head_des:String,
    path:String,
    fb:String,
    google:String,
    linkedin:String,
    twitter:String,
    para1:String,
    para2:String,
    para3:String,
    web:String
});

const Design = new mongoose.model("Design",designschema);

module.exports= {
    Design
};