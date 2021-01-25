const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/yelpcamp", {
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
  await Campground.deleteMany({});
  for (let i = 0; i < 300; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const random500 = Math.floor(Math.random() * 500);
    const randomIndex = Math.floor(Math.random() * 6);
    const camp = await new Campground({
      author: "6007498d1cebd3ef0b1c39a2",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      price: `${random500}`,
      geometry: { type: "Point", coordinates: [cities[random1000].longitude, cities[random1000].latitude]  },
      images: [
        {
          url:"https://res.cloudinary.com/dh2243wtt/image/upload/v1611345708/YelpCamp/velziw8u4he0hheuzr54.jpg",
          filename: "YelpCamp/velziw8u4he0hheuzr54"
        },
        {
          url:"https://res.cloudinary.com/dh2243wtt/image/upload/v1611345707/YelpCamp/caxxgz6qyr56rjzebdpw.jpg",
          filename: "YelpCamp/caxxgz6qyr56rjzebdpw"
        },
        {
          url:"https://res.cloudinary.com/dh2243wtt/image/upload/v1611345708/YelpCamp/ov0jecbwlno73ftneled.jpg",
          filename: "YelpCamp/ov0jecbwlno73ftneled"
        }
      ],
      reviews: [],
      description:
        "Für Netting-Sets, die entwedertens zwei die von der Bank (nach vollständiger Anwendung aller anderen vorgenannten regulatorischen Anpassungen), muss der Betrag, der vom Ergänzungskapital abzuziehen ist, als die Summe sämtlicher Positionen, die insgesamt mehr als 10% des harten Kernkapitals am gesamten Eigenkapital. Derartige zum Ausgleich herangezogene Vermögenswerte sollten mit dem Risikogewicht versehen wiert werden."
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
