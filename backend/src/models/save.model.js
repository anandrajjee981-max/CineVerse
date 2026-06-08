const mongoose = require('mongoose')
const saveschema = new mongoose.Schema({
username : {
    ref : "user",
type : mongoose.Schema.Types.ObjectId

},
movie : {
    ref : "Movie" ,
  type : mongoose.Schema.Types.ObjectId
}


},{
    timestamps: true
}
)
saveschema.index(
{username : 1 , movie : 1},
{unique : true }

)
const savemodel = mongoose.model("save",saveschema)
module.exports = savemodel








