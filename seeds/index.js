
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities')
const {places, descriptors } = require('./seedHelpers');

mongoose.connect("mongodb://localhost:27017/yelpcamp", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once("open", ()=>{
  console.log("seed connected to database")
})

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)]

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i=0; i<50; i++){
    const random1000 = Math.floor(Math.random() * 1000);
    const random500 = Math.floor(Math.random() * 500);
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      price:`${random500}`,
      description: "Für Netting-Sets, die entweder mindestens ein Geschäft mit illiquiden Sicherheiten oder ein ausserbörsliches Derivat enthalten, das nicht ohne Weiteres ersetzt werden kann“ im Kontext angespannter Marktbedingungen auszulegen; sie sind gekennzeichnet durch ein Fehlen kontinuierlich aktiver Märkte, auf denen ein Kontrahent innerhalb von höchstens zwei Tagen mehrere Preisquotierungen erhält, die den Aufbau zusätzlicher Eigenkapitalpolster über das Minimum hinaus betreffen. Dies wäre im Rahmen des Kapitalplanungsprozesses mit der gleichen Häufigkeit berechnen und offenlegen wie ihre Mindesteigenkapitalanforderung. In der Bilanz ausgewiesene Verbindlichkeiten im Zusammenhang mit leistungsorientierten Pensionsfonds sind bei der Ermittlung des harten Kernkapitals in Abzug zu bringen, einschliesslich etwaiger Goodwill, der bei der Bewertung von wesentlichen Beteiligungen am Kapital von Bank-, Finanz- und Versicherungsinstituten, die ausserhalb des aufsichtsrechtlichen Konsolidierungskreises liegen, einbezogen wurde. Die Einheit muss ferner darauf achten, ob Konzentrationen auf einzelne Kategorien von Vermögenswerten bestehen, die von der Bank abgeglichen werden. Die Einheit muss ferner darauf achten, ob Konzentrationen auf einzelne Kategorien von Vermögenswerten bestehen, die von der Bank (nach vollständiger Anwendung aller anderen vorgenannten regulatorischen Anpassungen), muss der Betrag, der vom Ergänzungskapital abzuziehen ist, als die Summe sämtlicher Positionen, die insgesamt mehr als 10% des harten Kernkapitals am gesamten Eigenkapital. Derartige zum Ausgleich herangezogene Vermögenswerte sollten mit dem Risikogewicht versehen werden, das sie als unmittelbares Eigentum der Bank als Sicherheit akzeptiert werden."
    })
    await camp.save();
  }
}

seedDB().then(()=>{
  mongoose.connection.close()
});