import User from "../models/user.model.js"

import Jwt from "jsonwebtoken"
export const login=async(req,res)=>{
  const { email, password } = req.body;
  console.log("n jcen j")

  console.log(req.body,"n jcen j")

  const user=await User.findOne({email})
  console.log(req.body)
  try{
    if(!user){
      res.send("user not found");
     
    }
    if (password !== user?.password){
      res.send('Incorrect Password')
      return
  
    }
    if (user && password === user?.password){
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        pic: user.pic,
        status:"pass",
        token: Jwt.sign({ user}, "monkey", {
          expiresIn: "30d",
        }),
        
      });
  
    }

  }
  catch(e){

  }
}

export const register=async (req,res)=>{

  const { name, email, password, pic } = req.body;

  console.log(name,email)

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: Jwt.sign({ user}, "doggy", {
        expiresIn: "30d",
      }),
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }

}

export const allusers=async (req,res)=>{

  const {loggeduser}=req.query
  const keyword = req.query.search
    ?  {
      $or: [
        { name: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
      ],
    }
    : {};

    //console.log(req.query.search)

    
  const users = await User.find(keyword).find({ _id: { $ne: loggeduser } });
  res.send(users)



}



