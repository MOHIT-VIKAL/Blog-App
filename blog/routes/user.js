const {Router}= require("express")
const User =require('../models/user')
const router =Router();

  router.get("/signup",(req,res)=>{
    return res.render("signup");
  });
   
  router.get("/signin",(req,res)=>{
    return res.render("signin");
  });
  router.post("/signin",async(req,res)=>{
    const {email,password}=req.body;
    console.log(email, password)
    try{
      const token= await  User.matchPasswordAndGenerateToken(email,password);
      //console.log("User",user);
      
      return res.cookie("token",token).redirect("/");
    } catch(error){
      return res.render("signin",{
        error:"Incorrect Email or Password",
      });
    }
  
  });
   
  router.get("/logout", (req, res) => { o
    res.clearCookie("token").redirect("/");
});
  router.post('/signup', async(req,res)=>{
    const {email,password,fullName } = req.body;
    console.log(email, password, fullName)
    await User.create({
        fullName,
        email,
        password,
    });
    return res.redirect("/");
  });
module.exports=router;