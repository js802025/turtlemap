const express = require("express")


const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const nodeGeocoder = require("node-geocoder")

const app = express()
const port = process.env.PORT || 80

let options = {
  provider: 'openstreetmap'
};

let geocoder = nodeGeocoder(options);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/web'));


app.get("/", (req, res) => {
  console.log("hello")
  res.render("index.ejs")
})
const server = app.listen(port)
var io = require("socket.io")(server)
io.on("connection", (socket) => {
  updateLocations(socket)
})
function updateLocations(socket) {

  var channel = client.channels.cache.get("963292322123112448")
  var locs = new Promise((resolve, reject) => {
    var locations = {}
    channel.messages.fetch({limit:100}).then(messages => {
    var o = 0;
    messages.forEach((message, i) => {
      geocoder.geocode(message.content).then((res) => {
        if (res.length > 0) {
          var [attach] = message.attachments.values()
          var url = attach.url
          locations[message.content] = {longitude:res[0].longitude, latitude:res[0].latitude, tooltip:{content:"<p>"+message.content+"</p><img width='75%' src='"+url+"'/>"}, href:"https://discord.com/channels/803804129646215200/963292322123112448/"+message.id}
        }
        console.log(o)
        if (o === messages.size -1) resolve(locations)
        o++
      }).catch((err) => {
        console.log(err)
      })
    });
  })
})
locs.then((locations) => {
  //console.log(locations)
  socket.emit("locs", locations)
})
}



client.login("ODgwODQzNTAyOTQ5MzgwMTc2.YSkLcA.DHNnjU8e1jABAMnvdcgnsAgOuXQ")
