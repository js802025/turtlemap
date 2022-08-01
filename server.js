const express = require("express")


const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const nodeGeocoder = require("node-geocoder")
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const admin = require("firebase-admin");

const app = express()
const port = process.env.PORT || 80

let options = {
  provider: 'openstreetmap'
};


let geocoder = nodeGeocoder(options);

var serviceAccount = require("./turtlemap-6340f-firebase-adminsdk-4hipk-f8d268ac42.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://turtlemap-6340f-default-rtdb.firebaseio.com"
});

var db = admin.database()
// client.on('ready', () => {
//   console.log(`Logged in as ${client.user.tag}!`);
// });

app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/web'));

app.use(express.static(__dirname + '/dist'));
app.get("/", (req, res) => {
    res.render("new.ejs")
})
const server = app.listen(port)
// var io = require("socket.io")(server)
// io.on("connection", (socket) => {
//   updateLocations(socket)
// })

// async function fetchAddress(params) {
//   return new Promise(async (resolve, reject) => {
//     var response = await fetch("http://api.positionstack.com/v1/forward?access_key=da447e4587b30998f4525e786849edbe&query="+encodeURIComponent(params))
//     var body = await response.text()
//     console.log(params)
//     console.log(body)
//     resolve(JSON.parse(body).data)
//   })
// }

// function updateLocations(socket) {

//   var channel = client.channels.cache.get("963292322123112448")
//   var locs = new Promise((resolve, reject) => {
//     var locations = {}
//     channel.messages.fetch({limit:100}).then(messages => {
//     var o = 0;
//     messages.forEach((message, i) => {
//     //  console.log(Array.from(message.reactions.cache.keys()))
//       if (!Array.from(message.reactions.cache.keys()).includes("🤔")) {
//       fetchAddress(message.content).then((res) => {
//         if (res.length > 0) {
//           var [attach] = message.attachments.values()
//           var url = attach.url
//           locations[message.content] = {longitude:res[0].longitude, latitude:res[0].latitude, imgsrc:url, href:"https://discord.com/channels/803804129646215200/963292322123112448/"+message.id}
//         }
//       //  console.log(o)
//         if (o === messages.size -1) resolve(locations)
//         o++
//       }).catch((err) => {
//         console.log(err)
//       })} else {
//         if (o === messages.size -1) resolve(locations)
//         o++
//       }
//     });
//   })
// })
// locs.then((locations) => {
//   //console.log(locations)
//   socket.emit("locs", locations)
// })
// }



// client.login("ODgwODQzNTAyOTQ5MzgwMTc2.YSkLcA.K60o7kAnSv8EOQ21aUjWim0NXrw")
