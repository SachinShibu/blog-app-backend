const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const {blogmodel} = require("./models/blog")
const jwt=require("jsonwebtoken")
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

app.post("/signin",(req,res)=>{
    let input=req.body
    blogmodel.find({"email":req.body.email}).then(
        (response)=>{
            if(response.length>0) {
              let dbPassword = response[0].password
              console.log(dbPassword)  
              bcrypt.compare(input.password,dbPassword,(error,isMatch)=>{
                if (isMatch)
                    {
                   jwt.sign({email:input.email},"blog-app",{expiresIn:"1d"},(error,token)=>{
                    if(error){
                        res.json({"status":"unable to create token"})
                    }
                    else
                    {
                        res.json({"status":"success","userid":response[0]._id,"token":token})
                    }
                   })
            
                }
                else{
                    res.json({"status":"Incorrect"})
                }
              })
            }else{
                res.json({"status":"user not found"})
            }
        }
    ).catch()

})


app.listen(8080,()=>{
    console.log("server running...")
})
