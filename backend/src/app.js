const express = require("express")
const app = express()
const cors = require("cors")
app.use(cors({
    credentials: true,
    origin: (origin, callback) => {
      if (!origin || /^https?:\/\/localhost(?::\d+)?$/.test(origin)) {
        return callback(null, true)
      }
      callback(new Error("Not allowed by CORS"))
    },
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


module.exports = app