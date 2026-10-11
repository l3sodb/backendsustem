const express=require('express');
// const db=require('./db.js')

const bcrypt = require('bcrypt')
const jwt=require('jsonwebtoken')
const app=express();
require('dotenv').config();

const db = require('./db')
const requestLogger=require('./logger');
const requestlogger = require('./logger');


app.use(express.json());
app.use(requestLogger); //middle ware
//our first endpoint
/*
syntax :
app.http_METHOD (ROUT, (req, res)){})*/
app.get('/', requestlogger, (req,res)=>{
res.status(200).json({message:"Welcome to our API"})
})
app.get('/about', (req,res)=>{
res.status(200).json({name: "pacifique", telephone:"0782893337"})
})

app.get('/login', (req,res)=>{
    res.status(200).json({location:"Nyagatare",province:"East",Sector:"Gatunda"})
})

app.get('/api/student',(req,res)=>{
    let sql="select*from student";
    
    db.query(sql,(err, result)=>{

        if(err){
            res.status(500).json({   message:'fail to fetch students'   })
          
           
        }
          res.status(200).json(result)
    })
}) 

app.get('/api/teacher', (req,res)=>{
    let sql= "select*from teacher"
    db.query(sql, (err,result)=>{
    if(err){
        res.status(500).json({message:"Fail to fetch teachers"})
        console.log(err);
    }
    res.status(200).json(result)
})})
app.post('/api/teacher', (req,res)=>{
    //let name = req.body.name;
    //let email = req.body.email;
    //let course = req.body.course;
let {name,email,course}=req.body//destruction

    let sql= `insert into teacher(name,email,course) values (?,?,?)`; // prepared statement
db.query(sql, [name,email,course], (err,result) => {
    if(err){
        res.status(500).json({message:"Fail to create teachers"})
        console.log(err);
    }
    res.status(201).json ({message:"teacher created success full"})
})
})

// get by id
// dynamic route

app.get('/api/teacher/:id',(req,res) => {
    let {id}= req.params; //destructing same as let id = req.params.id
    let sql= `select * from teacher where id= ?`;
    db.query(sql,[id],(err,result)=>{
        if(err){
        res.status(500).json({message:"Fail to get teachers"})
        console.log(err);
    }
    res.status(200).json (result)

    })
})
// endponint to delete teacher by id
app.delete('/api/teacher/:id',(req,res)=>{
    let{id}=req.params;
    let sql=`delete from teacher where id= ?`;
    db.query(sql,[id],(err,result)=>{
        if(err){
        res.status(500).json({message:"Fail to delete teachers"})
        console.log(err);
    }
    res.status(200).json ({message: "teacher have been deleted"
    })
})
})
// endponint to update teacher by id

app.put('/api/teacher/:id',(req,res)=>{
    let {name,email,course}= req.body
    let id = req.params.id;
    let sql=`update teacher set name= ?,email =?,course = ? where id= ?`; // prepared statement
    db.query(sql,[name,email,course,id],(err,result)=>{
        if(err){
        res.status(500).json({message:"Fail to update teachers"})
        console.log(err);
    }
    res.status(201).json ({message: "teacher have been updated"
    })
})
})
// authentication
// qpi to register user
app.post('/api/register', async (req,res)=>{
    let {name,email,password, role}=req.body;
    let hashed_password= await bcrypt.hash(password, 10);  //sat value
    let sql=`insert into users(name,email,password_hash,role) values(?,?,?,?)`
    db.query(sql,[name,email,hashed_password,role],(err,result)=>{
        if(err){
            res.status(500).json({message:"Fail to register user"}
            )
            console.log(err.message)
        }
        res.status(201).json({message:"new user created success full"})
    })
})
 
//login endpoint
app.post('/api/login',(req,res)=>{
    let{email,password}=req.body
    let user_sql=`select*from users where email=?`;
    db.query(user_sql,[email], async (err,result) => {
        if(err){
            res.status(500).json({message:"Fail to login"})
            console.log(err);

}else if (result.length==0) {
    res.status(400).json({message:"invalid email or password"})
}
else {
    let user=result[0];
    let match=await bcrypt.compare(password,user.password_hash)
    if(!match){
        res.status(400).json({message:"invalid email or password"})
    }
    
    //token
let token=jwt.sign(
    {id:user.id,email:user.email,role:user.role},
        process.env.JWT_SECRETE,
    {expiresIn:'24h'}
)
res.status(200).json({message:"Login success full",
    token:token,
    user:user
 
})
}

 })
})







app.listen(3000, () =>{
    console.log("Server is running on port 3000 ...");
})  