const express = require("express")
const app = express()
const cors = require("cors")
app.use(cors({
   origin: [
      "https://cineverse-zc5r.onrender.com"  ,
         "http://localhost:5173"

]
   ,
   credentials: true
}))

app.use(express.json())
const cookieparser = require("cookie-parser")
app.use(cookieparser())
const authroute = require("./routes/auth.route")
const movieroute = require('./routes/movies.route')
const saveroute = require('./routes/save.route')
app.use("/api/auth",authroute)
app.use("/api/movie" ,movieroute )
app.use('/api/save',saveroute)

const path = require("path");
app.use(express.static(path.join(__dirname, "../public/dist")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../public/dist/index.html"));
});

module.exports = app