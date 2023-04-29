const mongoose=require("mongoose"); 
const shortId=require("shortid"); // auto matic generate id and save in schema

const urlSchema= mongoose.Schema({
    full:{
        type:String,
        required:true
    },
    short:{
        type:String,
        required:true,
        default: shortId.generate
    },
    count:{
        type:Number,
        required:true,
        default:0
    }
})

module.exports=mongoose.model("Url",urlSchema);