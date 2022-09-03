const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const LocalStrategy = require("passport-local");
const User = require("./models/userModel");
const port = process.env.port || 4000;

mongoose
  .connect("mongodb://127.0.0.1:27017/auth_database")
  .then(() => {
    console.log("Connected Successfully");
  })
  .catch(() => {
    console.log("Cannot Connected");
  });
app.use(
  require("express-session")({
    secret: "Any normal Word", 
    resave: false,
    saveUninitialized: false,
  })
);
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser()); 
passport.use(new LocalStrategy(User.authenticate()));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/register", (req, res) => {
  res.render("register");
});
app.post("/register", (req, res) => {
  User.register(
    new User({
      username: req.body.username,
      phone: req.body.phone,
      email: req.body.email,
    }),
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.render("register");
      }
      passport.authenticate("local")(req, res, function () {
        res.redirect("/login");
      });
    }
  );
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
