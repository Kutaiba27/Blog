
const {validateUser} = require('../utility/valitadorUser')
const User = require('../models/user')

const newUser = async(req,res)=>{
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
}

const signIn = async(req,res)=>{
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
}

const updateUser = async (user) => {
   const { name, email, password } = req.body
   try {
      const user = await User.findOne({email:email})
      if(user) return res.json({message:"this email already exists"})
      if( name!="" && name ){
         user.name = toString(name)
      }
      if( email!="" && !email ){
         user.email = toString(email)
      }
      if( password!="" &&  password ){
         user.password = user.has(password)
      }
      await user.save()
      res.status(200).json({message: 'success'})
   } catch (error) {
      res.status(500).json({error})
   }
}


const userPosts = async(req,res)=>{
   let user = await User.findById(req.params.id)
   .populate('post')
   res.status(200).json(user)
}

const logOut = async(req,res)=>{
   const refreshToken = req.cookies.refreshToken 
   res.cookie('refreshToken',"")
   res.cookie('accessToken',"")
   try {
      const user = await User.findById(req.user.userId)
      user.refreshToken = user.refreshToken.filter( token => token != refreshToken )
      await user.save()
      res.status(200).json({message :'you are logged out'})
   } catch (error) {
      res.status(500).json(error)
   }
}

module.exports = { newUser,
                  signIn, 
                  userPosts, 
                  logOut,
                  updateUser }