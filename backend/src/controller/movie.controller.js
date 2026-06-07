const moviemodel = require('../models/movie.model')
async function getallmovie(req,res){
try{
    const movie = await moviemodel.find()
     res.status(200).json({
message : "all movie",
movie
    })
}
catch(err){
    res.status(500).json({
        message : "internal server error"
    })
}

}
async function category(req, res) {
    try {
        let genreName = req.params.name; // This will catch "Drama"

        // Search inside the 'genres' array from your schema
        // Using regex makes it case-insensitive (handles 'drama' or 'Drama')
        const movie = await moviemodel.find({ 
            genres: { $regex: new RegExp(`^${genreName}$`, 'i') } 
        });

        if (movie.length === 0) {
            return res.status(404).json({ 
                message: `No movies found in the '${genreName}' genre.` 
            });
        }

        res.status(200).json({
            message: `All movies belonging to the ${genreName} genre`,
            movie
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
async function search(req, res) {
    try {
        const name = req.params.name;
        
        // Use a case-insensitive regex so 'the running man' still matches 'The Running Man'
        const movie = await moviemodel.findOne({ 
            title: { $regex: new RegExp(`^${name}$`, 'i') } 
        });

        // 1. Check if movie doesn't exist, return early
        if (!movie) {
            return res.status(404).json({ // Changed to 404 (Not Found) which is standard
                message: "No content found"
            });
        }

        // 2. This must be OUTSIDE the if-block so it executes when a movie is found
        return res.status(200).json({
            message: "Your search result",
            movie
        });

    } catch (err) {
        console.error(err); // Good practice to log the actual error for debugging
        res.status(500).json({
            message: "Internal server error"
        });
    }
}



module.exports = {
    getallmovie , category , search
}



