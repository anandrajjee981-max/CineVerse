import axios from 'axios'

const api = axios.create({
    baseURL: "https://cineverse-zc5r.onrender.com",
    withCredentials: true
});

export async function allmovies(){
    try {
        const res = await api.get("/api/movie/all");
        return res.data;
    } catch(err) {
        console.log(err);
    }
}


export async function category(name){
    try {
        const res = await api.get("/api/movie/category/" + name);
        return res.data;
    } catch(err) {
        console.log("API Error in Category:", err);
        throw err; 
    }
}


export async function search(name){
    try {
        const res = await api.get("/api/movie/search/" + name);
        return res.data;
    } catch(err) {
        console.log("API Error in Search:", err);
        throw err;
    }
}