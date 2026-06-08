const express = require("express")
const saveroute = express.Router()
const verifyuser = require('../middleware/verify.middleware')
const savecontrol = require('../controller/save.controller')
saveroute.post("/movie/:name",verifyuser , savecontrol.handlesave)
saveroute.delete("/delete/:name",verifyuser,savecontrol.savedelete)
saveroute.get("/allsave",verifyuser,savecontrol.getallsave)




module.exports = saveroute
