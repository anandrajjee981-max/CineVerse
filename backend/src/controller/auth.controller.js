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
async function login(req, res) {
    try {
        const { username, email, password } = req.body;

        // 1. Validation: Ensure password and at least one identifier is provided
        if (!password || (!username && !email)) {
            return res.status(400).json({
                message: "Please provide username/email and password"
            });
        }

        // 2. Find user by username OR email
        const user = await usermodel.findOne({
            $or: [
                { username: username || "" }, 
                { email: email || "" }
            ]
        }).select("+password");

        // 3. Generic error for missing user or incorrect password (Prevents Enumeration)
        if (!user) {
            return res.status(401).json({
                message: "Invalid username/email or password"
            });
        }

        const isPasswordValid = await bycrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid username/email or password"
            });
        }

        // 4. Generate JWT
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // 6. Send Response
        res.cookie("token", token);
        return res.status(200).json({
            message: "Login successful",
            user: { id: user._id, username: user.username, email: user.email } // Optional: return user info
        });

    } catch (err) {
        console.error("Login Error:", err); // Log the actual error for debugging
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}




module.exports = {
    register , login
}

