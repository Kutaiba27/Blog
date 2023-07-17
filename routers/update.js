const router = require('express').Router()
const Post = require('../models/post')

router.put('/:id',async (req, res)=>{
   const idPost = req.params.id;
   const { title, discreption } = req.body;
   try {
      let post = await Post.findById(idPost);
      if(title && title != ""){
         post.title = title;
      }
      if(discreption && discreption != ""){
         post.discreption = discreption
      }
      post = await post.save()
      res.status(201).json({post})
   } catch (error) {
      console.log(error.message)
   }
})


module.exports = router
