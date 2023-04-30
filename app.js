const express = require("express");
const mongoose = require("mongoose");
const shortId = require("shortid"); // auto matic generate id and save in schema
const app = express();


// Stuck hue the link krne mai .net/nameOfDB only
mongoose.connect("mongodb+srv://chirag:arpit21@cluster1.2rwlxxw.mongodb.net/urlDB", function (err) {
  if (err) {
    console.log("Error Occured!");
  }
  else {
    console.log("Successfulll");
  }
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


const urlSchema = mongoose.Schema({
  full: {
    type: String,
    required: true
  },
  short: {
    type: String,
    required: true,
    default: shortId.generate
  },
  count: {
    type: Number,
    required: true,
    default: 0
  }
})

const Url = mongoose.model("url", urlSchema);


app.get("/", function (req, res) {
  Url.find({}, function (err, foundItem) {
    if (!err)
      res.render("index", { shorturls: foundItem });
    else {
      console.log("Error!!");
    }
  })
})

app.post("/shorturls", function (req, res) {
  // connect and save in our local db
  const url = new Url(
    {
      full: req.body.fullurl
    }
  );
  url.save();
  res.redirect("/");
})


app.get("/:shorturl", function (req, res) {
  // Stuck hue the isme error handle !urlFound wala nhi use kiye the
  Url.findOne({ short: req.params.shorturl }, function (err, urlFound) {
    if (err) {
      // Handle the error
      res.status(500).send("Error finding URL");
      return;
    }
    if (!urlFound) {
      // The short URL was not found in the database
      res.status(404).send("URL not found");
      return;
    }
    urlFound.count++;
    urlFound.save();
    //console.log(urlFound.full);
    res.redirect(urlFound.full);
  })

  // user demand wrong url we send 404


})

app.get("/delete/:urlId", function (req, res) {
  let deleteId = req.params.urlId;
  Url.deleteOne({ _id: deleteId }, function (err) {
    if (!err) {
      res.redirect("/");
    }
  })
})

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000!");
})