const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");
const User = require("../models/user");
const catchAsync = require('../utils/catchAsync');
// const { cloudinary } = require("../cloudinary");

require("dotenv").config();

// mongoose.connect(("mongodb://localhost:27017/yelpcamp" || MONGODB_URI), {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useUnifiedTopology: true
// });
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];






const seedDB = async () => {
  // const seedUser = await new User({
  //   email: "nick@gmail.com",
  //   username: "nick"
  // })
  await Campground.deleteMany({});
  for (let i = 0; i < 30; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const random500 = Math.floor(Math.random() * 500);
    const randomIndex = Math.floor(Math.random() * 6);
    const camp = await new Campground({
      author: "603c46b16eb2db7bb5e9922b",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      price: `${random500}`,
      geometry: { type: "Point", coordinates: [cities[random1000].longitude, cities[random1000].latitude]  },
      images: [
        {
          // url:"https://res.cloudinary.com/dh2243wtt/image/upload/v1611345708/YelpCamp/velziw8u4he0hheuzr54.jpg",
          url:"https://d194ip2226q57d.cloudfront.net/images/Campsites-by-Water_CO-Shutterstock.original.jpg",
          filename: "YelpCamp/velziw8u4he0hheuzr54"
        },
        {
          // url:"https://res.cloudinary.com/dh2243wtt/image/upload/v1611345707/YelpCamp/caxxgz6qyr56rjzebdpw.jpg",
          url:"https://d3vhc53cl8e8km.cloudfront.net/hello-staging/wp-content/uploads/sites/46/2019/06/09122028/NW2018_0914_004028-3025_IME-header-sm.jpg",
          filename: "YelpCamp/caxxgz6qyr56rjzebdpw"
        },
        {
          // url:"https://res.cloudinary.com/dh2243wtt/image/upload/v1611345708/YelpCamp/ov0jecbwlno73ftneled.jpg",
          url:"https://media.cntraveler.com/photos/607313c3d1058698d13c31b5/16:9/w_2560%2Cc_limit/FamilyCamping-2021-GettyImages-948512452-2.jpg",
          filename: "YelpCamp/ov0jecbwlno73ftneled"
        }
      ],
      reviews: [],
      description:
        "Für Netting-Sets, die entwedertens zwei die von der Bank (nach vollständiger Anwendung aller anderen vorgenannten regulatorischen Anpassungen), muss der Betrag, der vom Ergänzungskapital abzuziehen ist, als die Summe sämtlicher Positionen, die insgesamt mehr als 10% des harten Kernkapitals am gesamten Eigenkapital. Derartige zum Ausgleich herangezogene Vermögenswerte sollten mit dem Risikogewicht versehen wiert werden."
    });
    console.log(camp);
    await camp.save();
  }
};

seedDB().then(() => {
  console.log("Database closes");
  mongoose.connection.close();
});
