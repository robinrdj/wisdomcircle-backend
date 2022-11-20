const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const serverless = require("serverless-http");
const mongoose = require("mongoose");
mongoose.connect("mongodbconnection", {useNewUrlParser: true});

app.use(function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
      });
      
      app.use(bodyParser.urlencoded({extended:true}));
      app.use(express.json());
    var cors = require('cors')
    app.use(cors())

    const userSchema={
        firstName:String,
        lastName:String,
        email:String,
        mobileNo:Number,
        password:String
   }
       
   const User = mongoose.model("User",userSchema);

   app.post("/createUser",(req,res)=>{
    const fName = req.body.firstName;
    const lName = req.body.lastName;
    const email = req.body.email;
    const mNo = req.body.number;
    const password = req.body.password;

    User.find({email:email},(err, foundItem)=>{
        if(foundItem.length){
            res.send("user already exists with this email")
        }else{
            User.find({mobileNo:mNo},(err,foundItem)=>{
                if(foundItem.length){
                    res.send("user already exists with this number")
                }else{
                    const newUser = new User({
                        firstName:fName,
                        lastName:lName,
                        email:email,
                        mobileNo:mNo,
                        password:password
                    })
                    newUser.save(function(err){
                        if(err){
                            console.log(err)
                        }
                        else{
                            // res.send(newUser)
                            res.send("Successfully Saved");
                        }
                    })
                }
            })
        }
    })
   })



   app.post("/signIn",(req,res)=>{
    const mobileNo = req.body.mobileNo;
    const email = req.body.email;
    const password = req.body.password;
    if(email){
        User.find({email:email},(err,foundItem)=>{
            if(foundItem.length){
                if(password===foundItem[0].password){
                    res.send("sign in")
                }else{
                    res.send("wrong password")
                }
            }else{
                res.send("user does not exist")
            }
        })
    }else{
        User.find({mobileNo:mobileNo},(err,foundItem)=>{
            if(foundItem.length){
                if(password===foundItem[0].password){
                    res.send("sign in")
                }else{
                    res.send("wrong password")
                }
            }else{
                res.send("user does not exist")
            }
        })
    }
   })

   app.get("/getAllUsers",(req,res)=>{
    User.find({},(err, foundItems)=>{
        if(err){
            console.log(err)
        }else{
            res.send(foundItems)
        }
    })
   })

   app.get("/",(req,res)=>{
       res.send("The server is running")
   })

    var PORT = 5000
      app.listen(PORT, () => {
    console.log(`nodeExample app listening at http://localhost:${PORT}`);
});

// module.exports.handler = serverless(app)