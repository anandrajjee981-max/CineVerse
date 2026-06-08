import axios from 'axios'
const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
});
export async function allsave(){
try{
const res =await api.get('/api/save/allsave')
return res.data
}
catch(err){
    console.log(err)
    throw err
}
}
export async function save(name){
try{
const res =await api.post("/api/save/movie/" + name)
return res.data

}
catch(err){
    console.log(err)
    throw err
}

}

export async function deletesave(name){
    try{
const res = await api.delete("/api/save/delete/" + name)
return res.data

    }
    catch(err){
          console.log(err)
    throw err
    }
}









