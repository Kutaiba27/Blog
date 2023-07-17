const router = require('express').Router();

router.delete('/:id',async (req,res)=>{
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
})


module.exports = router;