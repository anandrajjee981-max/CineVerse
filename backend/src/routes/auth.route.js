const express = require("express")
const authvalidation = require('../validation/auth.validation')
const authroute = express.Router()
const authcontroller = require('../controller/auth.controller')
const verifyuser = require('../middleware/verify.middleware')
authroute.post("/register",authvalidation ,authcontroller.register)
authroute.post("/login",authcontroller.login)
authroute.get('/getme',verifyuser,authcontroller.getme)


module.exports = authroute
