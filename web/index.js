import { initializeApp } from "firebase/app";
import { GeocoderAutocomplete } from '@geoapify/geocoder-autocomplete';
import { getDatabase, set, push, get,ref as database_ref } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChYOck4VcEdS81trsBoortqyzmtUFoHYo",
  authDomain: "turtlemap-6340f.firebaseapp.com",
  projectId: "turtlemap-6340f",
  storageBucket: "turtlemap-6340f.appspot.com",
  messagingSenderId: "806157536569",
  appId: "1:806157536569:web:04a167f6a731064e4e2ce8"
};
const app = initializeApp(firebaseConfig);


import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getStorage
} from "firebase/storage";
const storage = getStorage();
const database = getDatabase(app);
// Initialize Firebase

//const socket = io()

var map = L.map('map').setView([0, 0], 2.4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);


var fileUpload = document.getElementById("fileButton")

fileUpload.addEventListener("change", (e) => {
  var file = e.target.files[0]

  const storageRef = ref(storage, `/files/${file.name}`)
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on(
      "state_changed",
      (snapshot) => {
          const percent = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );

          // update progress
          setPercent(percent);
      },
      (err) => console.log(err),
      () => {
          // download url
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
              $("#imgurl").val(url)
          });
      }
  ); 
})


const autocomplete = new GeocoderAutocomplete(
  document.getElementById("autocomplete"), 
  '59061a072f6241a485feda9ef9f1319c', 
  { /* Geocoder options */ });

autocomplete.on('select', (location) => {
 // console.log(location)
  $("#lat").val(location.properties.lat)
  $("#lon").val(location.properties.lon)
  $("#address").val(location.properties.formatted)
  $("#submit").prop('disabled', false);
});

autocomplete.on('suggestions', (suggestions) => {
// process suggestions here
});

function setPercent(percent) {
  $("#percent").css("width", percent + "%")
}



$().ready(() => {
 // document.getElementsByClassName(".geoapify-autocomplete-input")[0].classList.add("form-control")
 $("#submit").on("click", (e) => {
  const turtleRef = database_ref(database, "turtles/")
  const turtleId = push(turtleRef)
  set(turtleId, {
    title: $("#address").val(),
    lat: $("#lat").val(),
    lon: $("#lon").val(),
    imgurl: $("#imgurl").val(),
  }).then(() => {
    window.location.reload()
  })
 })

 get(database_ref(database, "turtles/")).then((snapshot) => {
  var turtles = snapshot.val()
  Object.entries(turtles).forEach(([key, value]) => {
    L.marker([value.lat, value.lon], {
      color: "red"
    }).addTo(map)
    .bindPopup('<img src="'+value.imgurl+'" width="75%"><br>'+value.title)
    .openPopup();
  })
})

})
