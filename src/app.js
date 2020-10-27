const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");
const path = require("path");
const express = require("express");
const hbs = require("hbs");
const { send } = require("process");
const { request } = require("http");
const app = express();
const port = process.env.PORT || 3000;
//define paths for Express config

const puclicDirPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

//setup static directory to serve

app.use(express.static(puclicDirPath));
app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Arshad Ibrahim",
  });
});
app.get("/about", (req, res) => {
  res.render("about", {
    title: "About me",
    name: "Arshad Ibrahim",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    helpText: "This is some help!",
    title: "Help",
    name: "Arshad Ibrahim",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "you must provid an adress!",
    });
  }

  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }
      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({ error });
        }
        res.send({
          forecast: forecastData,
          location,
          address: req.query.address,
        });
      });
    }
  );
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "you must provid a search term!",
    });
  }
  console.log(req.query.search);
  res.send({
    products: [],
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Arshad Ibrahim",
    errorMessage: "Help article not found",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Arshad Ibrahim",
    errorMessage: "Page not found",
  });
});
app.listen(port, () => {
  console.log("Server is up on port " + port);
});
