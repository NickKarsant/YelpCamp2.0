const express = require('express');
const app = express();

const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const path = require('path');
const flash = require("connect-flash");
const Campground = require('./models/campground');
const User = require('./models/user');
const Comment = require('./models/comment');
const bodyParser = require("body-parser");
const methodOverride = require('method-override');


mongoose.connect("mongodb://localhost:27017/yelpcamp", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
})
.then(() => {
  console.log("YelpCamp database connected")
})
.catch(err => {
  console.log("OH NO ERROR!")
  console.log(err)
});

// App Configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate)

// App Tools
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));



// Routes
app.use('/yelpcamp/campgrounds', (req,res, next)=>{
  req.requestTime = Date.now()
  console.log(`Date: ${req.requestTime}`);

  next();
})

// Widget app goes here
app.get('/', (req, res) => {
  res.send('React app goes here');
});

// landing page
app.get('/yelpcamp', (req, res) => {
  res.render('landing');
});

// show all campgrounds on homepage
app.get('/yelpcamp/campgrounds', async (req, res) => {
  const allCamps = await Campground.find({});
  res.render('campgrounds/index', { allCamps });
});

// add campground form page
app.get('/yelpcamp/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

// add campground to database route
app.post('/yelpcamp/campgrounds', async (req, res) => {
  console.log(`Date: ${req.requestTime}`);
  const campground = new Campground(req.body.campground)
  await campground.save();
  res.redirect(`/yelpcamp/campgrounds/${campground._id}`)
});

// show specific campground page
app.get('/yelpcamp/campgrounds/:id', async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/show", { campground });
});

// show edit page
app.get('/yelpcamp/campgrounds/:id/edit', async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/edit", { campground });
});

// update database with edits
app.put('/yelpcamp/campgrounds/:id', async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  res.redirect(`/yelpcamp/campgrounds/${campground._id}`)
});

// delete
app.delete('/yelpcamp/campgrounds/:id', async (req,res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id)
  res.redirect('/yelpcamp/campgrounds');
});





app.get('/yelpcamp/login', (req, res) => {
  res.render("login");
});

app.get('/yelpcamp/register', (req, res) => {
  res.render("register");
});







app.use((req,res, next)=>{
  res.status(404).render("404")
})


app.listen(3000, () => {
  console.log('on port 3000');
});