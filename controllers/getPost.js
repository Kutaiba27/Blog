const Post = require('../models/post');
const User = require('../models/user');
const path = require('path')
const getAllPost = async (req,res)=>{
   try{
      const numberOfArticl = 15;
      const numberOfPage = 1;
      var posts = await Post.find()
      .select('-discreption')
      .populate('user','name ')
      .limit(numberOfArticl)
      res.status(200).json({posts,numberOfPage})
   }catch(error){
      console.log(error.message)
   }
}

const getTheNextPage =  async (req,res)=>{
   try {
      const idPage = req.params.id
      const numberOfPage = idPage+1;
      const numberOfArticl = 15;
         var posts = await Post.find()
         .select('-discreption')
         .populate('user','name ')
         .limit(numberOfArticl)
         .skip(idPage * numberOfArticl) 
         res.status(200).json({posts,numberOfPage})
      
   } catch (error) {
      console.log(error.message)
   }
}

const getThePost = async(req,res)=>{
   const post = await Post.findById(req.params.id)
   res.status(200).json({post})
}

const getTheUser = async(req,res)=>{
   let user = await User.findById(req.params.id)
   .populate('post')
   res.status(200).json(user)
}




module.exports = {getAllPost,getTheNextPage,getThePost,getTheUser}