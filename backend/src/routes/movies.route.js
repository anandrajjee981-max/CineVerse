const express = require("express")
const movieroute = express.Router()
const moviecontroller = require('../controller/movie.controller')

movieroute.get("/all" , moviecontroller.getallmovie)
movieroute.get("/category/:name",moviecontroller.category)
movieroute.get("/search/:name",moviecontroller.search)



module.exports = movieroute


