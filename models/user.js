const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt= require('jsonwebtoken')
const userSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
   },
   age: {
      type: Number,
      required: true,
   },
   password: {
      type: String,
      required: true,
   },
   email: {
      type: String,
      required: true,
      unique:true
   },
   post: {
      type: [mongoose.Types.ObjectId],
      ref: "Post",
   },
   refreshToken:[String],
   admin:{
      type:Boolean,
      default:false
   }
});


userSchema.methods.accesstoken = function(){
   
   const token =  jwt.sign(
      {"userInfo":
         {"userId":this._id,
         "userName":this.name,
         "admin":this.admin}}
         ,process.env.ACCESS_TOKEN,
         { expiresIn: '10s' })
   return token;
}

userSchema.methods.refrestoken = function(){
   const token = jwt.sign(
      {"userInfo":
      {"userId":this._id,
      "userName":this.name,
      "admin":this.admin}},
      process.env.REFRESH_TOKEN,
      { expiresIn:"1d" })
   return token;
}


// userSchema.pre("save", function (done) {
//    bcrypt.genSalt(10,function (err, salt) {
//          bcrypt.hash(this.password,salt,function (err, hash) {
//                if (err) {
//                   return done(err);
//                }
//                this.password = hash; 
//                done();
//             }.bind(this)
//          );
//       }.bind(this)
//    );
// });

userSchema.methods.hash = (user)=>{
   var salt = bcrypt.genSaltSync(10);
   user.password = bcrypt.hashSync(user.password , salt);
};

module.exports = mongoose.model("User", userSchema);
