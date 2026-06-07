import axios from 'axios'

const api = axios.create({
    baseURL: "http://localhost:3000",
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

// 🔥 FIXED: Added 'await' before api.get
export async function category(name){
    try {
        const res = await api.get("/api/movie/category/" + name);
        return res.data;
    } catch(err) {
        console.log("API Error in Category:", err);
        throw err; 
    }
}

// 🔥 FIXED: Added 'await' before api.get
export async function search(name){
    try {
        const res = await api.get("/api/movie/search/" + name);
        return res.data;
    } catch(err) {
        console.log("API Error in Search:", err);
        throw err;
    }
}