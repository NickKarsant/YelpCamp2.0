const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const Campground = require('./models/campground');
const bodyParser = require("body-parser");


mongoose.connect("mongodb://localhost:27017/yelpcamp", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true
})
.then(() => {
  console.log("YelpCamp database connected")
})
.catch(err => {
  console.log("OH NO ERROR!")
  console.log(err)
});

 app.use(bodyParser.urlencoded({ extended: true }));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get('/yelpcamp', (req, res) => {
  res.render('landing');
});

app.get('/yelpcamp/campgrounds', async (req, res) => {
  const allCamps = await Campground.find({});
  res.render('campgrounds/index', { allCamps });
});

app.get('/yelpcamp/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

app.post('/yelpcamp/campgrounds', async (req, res) => {
  const campground = new Campground(req.body.campground)
  await campground.save();
  res.redirect(`/yelpcamp/campgrounds/${campground._id}`)
});


app.get('/yelpcamp/campgrounds/:id', async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/show", { campground });
});

app.get('/yelpcamp/campgrounds/:id/edit', async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/edit", { campground });
});









app.listen(3000, () => {
  console.log('on port 3000');
});