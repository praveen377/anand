const mongoose = require("mongoose");
const express = require("express");
const app = express();
const multer = require("multer");
require("dotenv").config();
const path = require("path");

//store engine for order upload
const space = multer.diskStorage({
    destination : "./public/order/",
    filename:function(req,file,cb){
        console.log(file);
        cb(null , file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});
const order_upload = multer({storage:space});
module.exports={
    order_upload,
};
