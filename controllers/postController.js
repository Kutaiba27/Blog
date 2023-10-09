
const mongoose = require('mongoose');
const Post = require('../models/post')
const User = require('../models/user')
const valdation = require('../utility/valitadorPost')

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

const newPost = async (req,res)=>{

   const {error} = valdation(req.body)
   if(!error){
      const {title,discreption,images} =  req.body
      const  id = req.user.userId
   }else{
      return res.status(400).json({message:error.details[0].message})
   }
   try {
      const post = await Post.create({title,discreption,images,user:id})
      const user =await User.findById(id).select('post');
      user.post = [...user.post,new mongoose.Types.ObjectId(post._id)];
      await user.save();
      res.status(201).json({post,user})
   } catch (error) {
      console.log(error)
   }
}

const deletePost = async (req,res)=>{
   const idPost = req.params.id;
   try {
      const user = await User.findOne({post:idPost});
      await Post.deleteOne({_id:idPost});
      user.post =  user.post.filter(x=> x !=idPost)
      user.save();
      console.log("the delete route",user)
      res.status(200).json({user})
   } catch (error) {
      console.log("the delete file ",error.message)
   }
}

const updatePost = async (req, res)=>{
   const idPost = req.params.id;
   const { title, discreption, images } = req.body;
   try {
      let post = await Post.findById(idPost);
      if(title && title != ""){
         post.title = title;
      }
      if(discreption && discreption != ""){
         post.discreption = discreption
      }
      if(images && images != ""){
         post.images = images;
      }
      post = await post.save()
      res.status(201).json({post})
   } catch (error) {
      console.log(error.message)
   }
}

const searchPost = async (req, res) => {
   try {
      const locals = {
         title: "Seach",
         description: "Simple Blog created with NodeJs, Express & MongoDb.",
      };
      let searchTerm = req.body.searchTerm;
      const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
      const data = await Post.find({
         $or: [
            { title: { $regex: new RegExp(searchNoSpecialChar, "i") } },
            { body: { $regex: new RegExp(searchNoSpecialChar, "i") } },
         ],
      });
      res.status(200).json({data})
   } catch (error) {
      console.log(error);
   }
} 

module.exports = {
                     getAllPost,
                     getTheNextPage,
                     getThePost,
                     newPost, 
                     deletePost,
                     updatePost,
                     searchPost
                  }