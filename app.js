const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const {blogmodel} = require("./models/blog")
const bcrypt = require("bcryptjs")


const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://sachin:sachin@cluster0.ervt8e3.mongodb.net/blogdb?retryWrites=true&w=majority&appName=Cluster0")


const generateHashedPassword = async (password) =>{
    const salt=await bcrypt.genSalt(10)
    return bcrypt.hash(password,salt)
}



app.post("/signup",async(req,res)=>{

    let input = req.body
    let hasedPassword = await generateHashedPassword(input.password)
    console.log(hasedPassword)
    input.password = hasedPassword
    let blog = new blogmodel(input)
    blog.save()
    res.json({"status":"success"})
})


app.listen(8080,()=>{
    console.log("server running...")
})
