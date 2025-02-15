const {Schema,model}= require("mongoose")
const {createHmac, randomBytes }= require("crypto");
const { createTokenForUser } = require("../services/authentication");
const userSchema= new Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    salt:{
        type:String,
         
    },
    password:{
        type:String,
        required:true,
    },
    profileImageURL:{
        type:String,
        default: "/images/useravatar.jfif ",
    },
    role:{
        type:String,
        enum:["USER","ADMIN"],
        default:"USER",
    },
}, {timestamps:true});

userSchema.pre('save',async function (next){
    const user =  this;
       if(!user.isModified("password")) return;

       const salt=  randomBytes(16).toString();
       const hashedPassword = createHmac("sha256",salt).update(user.password).digest("hex");

       this.salt=salt;
       this.password=hashedPassword;

       next();
       
});
userSchema.static('matchPasswordAndGenerateToken',async function(email,password){
    console.log("yaha aaya")
    const user= await this.findOne({email});
    console.log(user)
    if(!user) throw new Error('User not found')

    const salt=user.salt;
    const hashedPassword =user.password;
    const userProvideHash =createHmac("sha256",salt).update(password).digest("hex");
    if(hashedPassword!=userProvideHash) throw new Error("Incorrect Password");
   // return {...user._doc,password:undefined,salt:undefined };
     const token =createTokenForUser(user);
     return token;
});

const user = model('user',userSchema);
module.exports=user;