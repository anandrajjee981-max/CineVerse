const {body , validationResult} = require("express-validator")

const validate=(req,res,next)=>{
    const error = validationResult(req)
if(error.isEmpty()){
    return next()
}
res.status(400).json({
    error : error.array()
})

}
const registerValidate = [
body("username").isString().withMessage("username should string").trim().notEmpty(),
body("email").isEmail().withMessage("email should be valid"),
body("password").custom((value)=>{
    if(value.length<6){
        throw new Error("password should be alteast 6 character")
    }
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
if(!passwordRegex){
    throw new Error("should atleast contain one uppercase lowecase ")
}
return true

}).withMessage("password is required"),
validate


]

module.exports = registerValidate










