import axios from 'axios'

const api = axios.create({
    baseURL: "https://cineverse-zc5r.onrender.com",
    withCredentials: true
});

export async function login(username , password){
const res =await api.post("/api/auth/login",{
    username ,
    password
})
return res.data


}
export async function register(username , email , password){
const res =await api.post("/api/auth/register",{
    username , email , password
})
return res.data

}
export async function getme(){
const res = await api.get("/api/auth/getme")
return res.data
}