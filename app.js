const express=require("express");
const mongoose=require("mongoose");
const ShortUrl=require("./models/shortUrl");
const app=express();


mongoose.connect("mongodb://127.0.0.1:27017/urlDB");

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:false}));
app.use(express.static("public"));

 app.get("/",function(req,res){
   ShortUrl.find({},function(err,foundItem){
    res.render("index",{shorturls:foundItem});
   })
 })

app.post("/shorturls",function(req,res){
    // connect and save in our local db
      const url=new ShortUrl({full:req.body.fullurl});
      url.save();
      res.redirect("/");
})


app.get("/:shorturl",function(req,res){
    ShortUrl.findOne({short:req.params.shorturl},function(err,foundList){
       foundList.count++;
       foundList.save();
       res.redirect(foundList.full);
    });
    
  // user demand wrong url we send 404
 

})

app.get("/delete/:urlId",function(req,res){
    let deleteId=req.params.urlId;
    ShortUrl.deleteOne({_id:deleteId},function(err){
      if(!err){
        res.redirect("/");
      }
    })
  })

app.listen(process.env.PORT || 3000,function(){
    console.log("Server is running on port 3000!");
})