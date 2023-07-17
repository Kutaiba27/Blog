
const router = require('express').Router()
const {validateUserSing} = require('../utility/valitadorUser')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
router.get('/',async (req,res)=>{
   console.log("start")
   const {error} = validateUserSing(req.body)
   console.log(error)
   if (error){
      return res.status(400).json({"message":error})
   }
   const { password, email } = req.body;
   const user = await User.findOne({email:email});
   if (!user)
   return res.status(404).send("you are not regester");
   const match = await bcrypt.compare(password, user.password);
   if (!match)
   return res.status(400).send("you password not correct");
   const refresh = req.cookies.refreshToken
   res.clearCookie('refreshToken',{ httpOnly: true, sameSite: 'None' });
   user.refreshToken = user.refreshToken.filter(x => x !=refresh)
   const newrefresh =  user.refrestoken()
   const newaccess = user.accesstoken()
   res.cookie('refreshToken',newrefresh)   
   res.cookie('accessToken',newaccess) 
   user.refreshToken = [...user.refreshToken,newrefresh];
   await user.save()
   res.status(200).json({newrefresh,newaccess})
})



module.exports = router