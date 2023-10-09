const router = require('express').Router()
const auth = require('./middlewares/auth')
const role = require('./middlewares/role')
const { newPost, 
      deletePost, 
      updatePost, 
      searchPost, 
      getAllPost,
      getTheNextPage,
      getThePost } = require('../controllers/postController')

router.get('/',getAllPost)
      .get('/search',searchPost)
      .get('nextPage/:id',getTheNextPage)
      .get('/:id',getThePost)
      .post('/newPost',auth,newPost)
      .delete('/deletePost',[auth,role],deletePost)
      .put('updatePost',auth,updatePost)

module.exports = router