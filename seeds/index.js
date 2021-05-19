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
          url:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.chronogram.com%2Fhudsonvalley%2Fcamp-sites-of-all-stripes%2FContent%3Foid%3D8615101&psig=AOvVaw3GS5jVMO2mnkvotog7tWEI&ust=1621476162370000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCLD8ws3T1PACFQAAAAAdAAAAABAD",
          filename: "YelpCamp/velziw8u4he0hheuzr54"
        },
        {
          // url:"https://res.cloudinary.com/dh2243wtt/image/upload/v1611345707/YelpCamp/caxxgz6qyr56rjzebdpw.jpg",
          url:"https://www.google.com/imgres?imgurl=https%3A%2F%2Fd194ip2226q57d.cloudfront.net%2Fimages%2FCampsites-by-Water_CO-Shutterstock.original.jpg&imgrefurl=https%3A%2F%2Fwww.417mag.com%2Foutdoors%2Fcamping%2Fbest-campsites-near-water-southwest-mo%2F&tbnid=OuYdDSqAeQN1aM&vet=12ahUKEwihu9DG09TwAhWN0FMKHRAtAGYQMyg9egQIARBt..i&docid=z_WucZeaTAO7HM&w=1100&h=700&q=campsites&ved=2ahUKEwihu9DG09TwAhWN0FMKHRAtAGYQMyg9egQIARBt",
          filename: "YelpCamp/caxxgz6qyr56rjzebdpw"
        },
        {
          // url:"https://res.cloudinary.com/dh2243wtt/image/upload/v1611345708/YelpCamp/ov0jecbwlno73ftneled.jpg",
          url:"https://www.google.com/imgres?imgurl=https%3A%2F%2Fwww.novascotia.com%2Fsites%2Fdefault%2Ffiles%2F2020-09%2FGraves-Island-camping-stars.jpg&imgrefurl=https%3A%2F%2Fwww.novascotia.com%2Fplaces-to-stay%2Fcampgrounds&tbnid=s6A9P0mpBUXDcM&vet=12ahUKEwj-993109TwAhUEsFMKHU7UAPkQMygGegUIARDdAQ..i&docid=dcB58ohvEciUlM&w=1920&h=1080&q=camping%20&ved=2ahUKEwj-993109TwAhUEsFMKHU7UAPkQMygGegUIARDdAQ",
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
