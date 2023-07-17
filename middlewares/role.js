

module.exports = (req,res,next)=>{
   if(req.user.admin) return res.status(402).send("you are not athorized")
   console.log("htis is routle ",req.user)
   console.log("this is role route ", req.user.admin)
   return next()
}