const router = require("express").Router();
const Post  = require('../models/post')

router.post("/search", async (req, res) => {
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
});

module.exports = router;
