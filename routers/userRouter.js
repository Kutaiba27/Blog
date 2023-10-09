const router = require('express').Router()
const { newUser, signIn, userPosts, logOut, updateUser } = require('../controllers/userController')
const auth = require('./middlewares/auth')

router.post('/regester',newUser)
      .post('/singIn',signIn)
      .get('/posts',userPosts)
      .post('/logout',auth,logOut)
      .put('/update',auth,updateUser)

module.exports = router;