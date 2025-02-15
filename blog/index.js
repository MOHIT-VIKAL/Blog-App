const express = require('express')
const path = require('path')
const mongoose = require("mongoose");
const userRoute = require('./routes/user')
const cookieParser =require('cookie-parser')
const blogRoute =require('./routes/blog')
const Blog= require("./models/blog")
const checkForAuthenticationCookie=require("./middlewares/authentication")
const app = express();
const PORT = 8000;
 
mongoose
.connect("mongodb://localhost:27017/blogify")
.then((e) => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB connection error:", err));
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.static(path.resolve("./public")))
app.get('/', async(req, res) => {
    const allBlogs =await Blog.find({});
    res.render('home',{
        user:req.user,
        blogs:allBlogs,
    })
});
app.use( express.urlencoded({extended:false}))
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));
app.use("/user", userRoute);
app.use("/blog", blogRoute);
app.listen(PORT, () => console.log(`Server started at port: ${PORT}`));