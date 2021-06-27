const mongoose = require("mongoose");
const express = require("express");
const app = express();
const multer = require("multer");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI,
     {
         useNewUrlParser: true, 
         useUnifiedTopology: true,
         useCreateIndex:true,
         useFindAndModify:false
    }).then(() =>{
        console.log("database sucessfully connected");
        
    });

const path = require("path");
//set storage engine.
const storage = multer.diskStorage({
    destination : "./public/uploads/",
    filename:function(req,file,cb){
        
        cb(null , file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});

//intialise upload
const upload = multer({storage:storage});


module.exports={
    upload,
    
};
