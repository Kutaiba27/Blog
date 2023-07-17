

const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
   title : { 
      type:String,
      required: true,
   },
   discreption:{
      type:String,
      required: true,
   },
   date:{
      type:Date,
      default: Date.now
   },
   user:{
      type:mongoose.Types.ObjectId,
      ref:'User'
   }
})






module.exports = mongoose.model("Post",postSchema)



