import cors from "cors"
import morgan from "morgan"
import express from "express"
import mysql from "mysql2/promise"
import bcrypt from "bcrypt"
  
const app = express()
 
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())

const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "school_db"
})
console.log("Database connected successfuly")



app.post("/register",async(req,res)=>{
    try{
        const {username,email,password}=req.body
        const [user]= await db.execute(
            "select * from leaders where username= ?",[username]
        )
        if(user.length > 0){
            return res.status(404).json({message: "username not founded"})
        }
         const [emai]= await db.execute(
            "select * from leaders where email= ?",[email]
        )
        if(emai.length > 0){
            return res.status(404).json({message: "Email arlead exist!!!"})
        }
        const hashedpassword= await bcrypt.hash(password, 10)
        await db.execute(
            "insert into leaders(username, email,password) values(?,?,?)"
            ,[username,email,hashedpassword]
        )
        return res.status(200).json({message: "new user created"})
    }catch(error){
        console.log(error)
        return res.status(500).json({message: "internal server error"})
    }
})
app.get("/select1",async(req,res)=>{

try{
    const [sel]= await db.execute("select * from leaders")
    return res.status(200).json({message: "all users",sel})
}catch(error){
    console.log(error)
    return res.status(500).json({message: "internal server error"})
}

})
app.delete("/delete/:user_id",async(req,res)=>{

try{

    const userId=parseInt(req.params.user_id)
    const [row]= await db.execute(
        "select * from leaders where user_id= ?",[userId]
    )
    if(row.length === 0){
        return res.status(404).json({message: "username not fuond"})
    }
    await db.execute(
        "delete from leaders where user_id= ?",[userId]
    )
    return res.status(200).json({message: "user deleted"})
}
catch(error){
    console.log(error)
    return res.status(500).json({message: "internal sever error"})
}
})

app.put("/update/:user_id",async(req,res)=>{
try{
    const {username,email,password }=req.body
    const userId=parseInt(req.params.user_id)
    const [row] = await db.execute(
        "select * from leaders where user_id= ?",[userId]
    )
if(row.length === 0){
    return res.status(404).json({message: "user not found"})
}

await db.execute(
    "update leaders set username= ?,email= ?,password= ? where user_id=?",[username, email,password,userId]
)
return res.status(200).json({message:"username updated"

})

}
catch(error){
    console.log(error)
    return res.status(500).json({message: "internal serve error"})

}

})


app.post("/login",async(req,res)=>{
    try{
        const {username, password}=req.body
        const [row]= await db.execute(
            "select * from leaders where username = ? ",[username]
        )
        if(row.length ===0){
            return res.status(404).json({message: "username or Password not foun"})
        }
        return res.status(200).json({message: "user logged in"})

    }catch(error){
        console.log(error)
        return res.status(500).json({message: "internal server error "})
    }
})


app.listen(5000, ()=>console.log("Server is running on port 5000"))