const mongoose = require("mongoose")
async function connectdb(){
    await mongoose.connect(process.env.MONGO_URI)
    console.log("connect db")

}

module.exports = connectdb





