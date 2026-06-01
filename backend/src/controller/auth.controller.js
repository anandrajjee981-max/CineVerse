const jwt = require("jsonwebtoken")
const usermodel = require('../models/auth.models')
const bycrypt = require("bcryptjs")
async function register (req,res){
    try{
const {username , email , password} = req.body
const check = await usermodel.findOne({
    $or:[
        {username : username},
        {email : email}
    ]
})
if(check){
  return  res.status(400).json({
        message : "invalid credential"
    })
}

 const hash =await bycrypt.hash(password , 10)
const user = await usermodel.create({
    username , email , password:hash
})
const token = jwt.sign({
    id :user._id ,
    username : user.username
},
process.env.JWT_SECRET, {expiresIn : "1d"}
)
res.cookie("token",token)
res.status(200).json({
    message : "user profile created" ,
    user :{
        username : user.username,
        email : user.email
    }
})
    }
  catch(err){
    console.log(err);

    res.status(500).json({
        message : err.message
    })
}
}






module.exports = {
    register
}

