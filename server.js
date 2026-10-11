const express=require('express');
const app=express();


//our first endpoint
/*
syntax :
app.http_METHOD (ROUT, (req, res)){})*/
app.get('/', (req,res)=>{
res.status(200).json({message:"Welcome to our API"})
})
app.get('/about', (req,res)=>{
res.status(200).json({name: "pacifique", telephone:"0782893337"})
})

app.get('/login', (req,res)=>{
    res.status(200).json({location:"Nyagatare",province:"East",Sector:"Gatunda"})
})


app.listen(3001, () =>{
    console.log("Server is running on port 3001 ...");
})