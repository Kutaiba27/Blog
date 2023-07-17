
const router = require('express').Router();
const {validateUser} = require('../utility/valitadorUser')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
router.post('/',async(req,res)=>{
   const {error} = validateUser(req.body);
   if(!error){
      var {name,password,email,age} = req.body;
      try {
         const user = await User.findOne({email:email})
         if(user)
            return res.status(400).json({massege:"user already regester"})
      } catch (error) {
         console.log(error.message)
      }
   }else{
      return res.status(400).json({message:error.details[0].message})
   }
   try {
      const user = await User({name,password,age,email});
      user.hash(user)
      // console.log(req.headers['x-auth-token'])
      const accessToken = user.accesstoken()
      const refreshToken = user.refrestoken()
      res.cookie('accessToken', accessToken)
      res.cookie('refreshToken',refreshToken)
      // res.header('x-auth-token',token)
      user.refreshToken = [refreshToken];
      await user.save()
      res.status(201).json({user,accessToken})
   } catch (error) {
      res.send(error.message)
   }

})




module.exports= router
