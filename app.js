//jshint esversion:6
require('dotenv').config()

const express = require("express");
const app =express();

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/Auth_Project");

const enct = require("mongoose-encryption");

const bodyparser = require("body-parser");
const ejs = require("ejs")

// console.log(process.env.secret);

app.use(express.static("public"));
app.use(bodyparser.urlencoded({extented:true}));
app.set('view engine', 'ejs')

const schemaobj = new  mongoose.Schema({
  email: String,
  password: String
});

schemaobj.plugin(enct, { secret: process.env.secret, encryptedFields: ["password"] });


Auth_Project = mongoose.model("Authentication", schemaobj);

app.get("/", function(req, res){
 res.render("home")
})

app.get("/login", function(req, res){
res.render("login")
})

app.get("/register", function(req, res){
res.render("register")
})


app.post("/register", function(req,res){
  const email = req.body.username;
  const password = req.body.password;

  const Register_Candidate = new Auth_Project({
    email : email,
    password : password
  });

  Register_Candidate.save(function(err){
    if(!err){res.render("secrets")}
    else{res.send(err)}
  })
})


app.post("/login", function(req,res){
  const email = req.body.username;
  const password = req.body.password;

  Auth_Project.findOne({email : email}, function(err, userfound){
    if(userfound)
    {
      if(password === userfound.password)
      {
        res.render("secrets")
      }
    }
    else{
      res.send(err)
    }
  })
})

app.listen(3000, function(){
  console.log("Server Started");
})
