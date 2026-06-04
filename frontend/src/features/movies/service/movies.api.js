import axios from 'axios'
const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
});

export async function allmovies(){
try{
const res = await api.get("/api/movie/all")
return res.data
}
catch(err){
    console.log(err)
}


}






