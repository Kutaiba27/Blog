
const router = require('express').Router();
const mongoose = require('mongoose');
const Post = require('../models/post')
const User = require('../models/user')
const valdation = require('../utility/valitadorPost')
const multer = require('multer')



router.post('/',async (req,res)=>{

   console.log(req.file)
   const {error} = valdation(req.body)
   if(!error){
      var {title,discreption} =  req.body
      var  id = req.user.userId
   }else{
      return res.status(400).json({message:error.details[0].message})
   }
   try {
      const post = await Post.create({title,discreption,user:id})
      const user =await User.findById(id).select('post');
      user.post = [...user.post,new mongoose.Types.ObjectId(post._id)];
      await user.save();
      res.status(201).json({post,user})
   } catch (error) {
      console.log(error)
   }
})

module.exports = router