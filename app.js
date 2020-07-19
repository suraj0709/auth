//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRETS, encryptedFields: ['password']});

const User = mongoose.model("user", userSchema);

app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  const newUser = new User({
    username: username,
    password: password
  });

  newUser.save(function(err){
    if (!err) {
      res.render("Secrets")
    } else {
      console.log(err);
    }
  })
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({username:username},function(err, foundUser){

    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          console.log("matched");
          res.render("Secrets")
        }
      }
    }
  })
});

app.listen(3000, function(req, res){
  console.log("Server running on Port 3000");
});
