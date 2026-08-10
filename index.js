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

app.put("/update/:user_id", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const userId = parseInt(req.params.user_id);

        // Check if user exists
        const [row] = await db.execute(
            "SELECT * FROM leaders WHERE user_id = ?",
            [userId]
        );

        if (row.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user
        await db.execute(
            `UPDATE leaders
             SET username = ?, email = ?, password = ?
             WHERE user_id = ?`,
            [username, email, hashedPassword, userId]
        );

        return res.status(200).json({
            message: "User updated successfully"
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user by username
        const [row] = await db.execute(
            "SELECT * FROM leaders WHERE username = ?",
            [username]
        );

        // User doesn't exist
        if (row.length === 0) {
            return res.status(404).json({
                message: "Username or password is incorrect"
            });
        }

        const user = row[0];

        // Compare entered password with hashed password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        // Password is incorrect
        if (!passwordMatch) {
            return res.status(401).json({
                message: "Username or password is incorrect"
            });
        }

        // Login successful
        return res.status(200).json({
            message: "User logged in successfully",
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

app.listen(5000, ()=>console.log("Server is running on port 5000"))