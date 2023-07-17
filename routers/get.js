const router = require('express').Router();
const User = require('../models/user')
const Post = require('../models/post')
const {getAllPost,getTheNextPage,getTheUser,getThePost} =  require('../controllers/getPost')

//Get All Posts
router.get('/',getAllPost)
// Get The Next Page
router.get('/:id',getTheNextPage)
// Get The Post
router.get('/post/:id',getThePost)
// Get The User
router.get('/user/:id',getTheUser)



module.exports= router