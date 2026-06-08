const jwt = require('jsonwebtoken')

async function verifyuser(req,res, next){
const token = req.cookies.token 
if(!token){
    return res.status(404).json({
        message : "token not found"
    })
}
let decoded ;
try{
decoded = await jwt.verify(token , process.env.JWT_SECRET)
if(!decoded){
return res.status(404).json({
    message : "unauthorise acess"
})
}
req.user = decoded

next()

}
catch(err){
console.log(err)
}

}
module.exports = verifyuser







