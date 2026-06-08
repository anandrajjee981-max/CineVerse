const usermodel = require('../models/auth.models')
const moviemodel = require('../models/movie.model')
const savemodel = require('../models/save.model')

async function handlesave(req,res){
try{
const username = req.user.id
const movie = await moviemodel.findOne({
  title: {
    $regex: `^${req.params.name}$`,
    $options: "i"
  }
});
if(!movie){
    return res.status(404).json({
        message :"no movie found for this name"
    })
} 


const check = await savemodel.findOne({
    username,
    movie: movie._id
});
if(check){
    return res.status(404).json({
        message : "you already saved this movie"
    })
}

const save = await savemodel.create({
    username,
    movie: movie._id
});
res.status(200).json({
    message : "saved sucessfully" ,
    save
})


}
catch(err){
res.status(500).json({
    message : "internal server error"
})

}


}
async function savedelete(req, res) {
  try {
    const username = req.user.id;

    const movie = await moviemodel.findOne({
      title: {
        $regex: `^${req.params.name}$`,
        $options: "i"
      }
    });

    if (!movie) {
      return res.status(404).json({
        message: "movie not found"
      });
    }

    const check = await savemodel.findOne({
      username,
      movie: movie._id
    });

    if (!check) {
      return res.status(404).json({
        message: "save not found"
      });
    }

    await savemodel.findOneAndDelete({
      username,
      movie: movie._id
    });

    res.status(200).json({
      message: "deleted successfully"
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "internal server error",
      error: err.message
    });
  }
}
async function getallsave(req,res){
try{
let username = req.user.id
const save = await savemodel.find({username : username} ).populate("movie")

res.status(200).json({
    message : "your all saved content" ,
    save
})
}
catch(err){
res.status(500).json({
    message : "internal server error"
})
}

}

module.exports = {
    handlesave , savedelete , getallsave
}
