const express = require("express")
const authvalidation = require('../validation/auth.validation')
const authroute = express.Router()
const authcontroller = require('../controller/auth.controller')
authroute.post("/register",authvalidation ,authcontroller.register)




module.exports = authroute
