const express = require("express")
const app = express()
app.use(express.json())
const cookieparser = require("cookie-parser")
app.use(cookieparser())
const authroute = require("./routes/auth.route")
app.use("/api/auth",authroute)

module.exports = app