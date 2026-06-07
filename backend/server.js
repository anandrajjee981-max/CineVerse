require("dotenv").config()
const app = require('./src/app')
const connectdb = require('./src/config/database')
const moviedata = require('./src/config/Movie')
connectdb()


app.listen(3000)