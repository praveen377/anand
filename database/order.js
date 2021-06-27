const mongoose = require("mongoose");

const Orderschema = new mongoose.Schema({
    userid:String,
    email:String,
    name:String,
    address:String,
    mob:String,
    mob2:String,
    city:String,
    state:String,
    zip:String,
    description:String,
    type:String,
    order_img:String,
    
});


const OrderDB = new mongoose.model("OrderDB",Orderschema);

module.exports= {
    OrderDB
};