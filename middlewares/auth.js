// const jwt = require('jsonwebtoken')
// const User = require('../models/user')
// module.exports = (req, res, next)=>{
//    const cookei = req.cookies;
//    const access = cookei.accessToken;
//    const refresh = cookei.refreshToken;
//    if (!access) return res.sendStatus(403)
//    try {

//       jwt.verify(access,process.env.ACCESS_TOKEN, async (err, decode)=>{
//          if (err) {
//             if ( err.name === 'TokenExpiredError' ){
//                jwt.verify(refresh,process.env.REFRESH_TOKEN,async( err, doeded)=>{
//                   if (err) return res.sendStatus(403).send("you should resing in")
//                   const foundUser = await User.findOne({refreshToken:refresh})
//                   console.log(foundUser)
//                })
//             }
//          }
//          req.user =  decode.userInfo;
//          next();
//       })

//    } catch (error) {
//       console.log(error.message)
//    }
// }
const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = async (req, res, next) => {
   const cookies = req.cookies;
   const access = cookies.accessToken;
   const refresh = cookies.refreshToken;

   if (!access) {
      return res.sendStatus(403);
   }

   try {
      const decodedAccess = jwt.verify(access, process.env.ACCESS_TOKEN);
      req.user = decodedAccess.userInfo;
      console.log("this is auth route",req.user)
      next();
   } catch (accessError) {
      if (accessError.name === "TokenExpiredError") {
         try {
            const decodedRefresh = jwt.verify(
               refresh,
               process.env.REFRESH_TOKEN
            );
            
            var foundUser = await User.findOne({ refreshToken: refresh });
            if (!foundUser) {
               return res.status(403).send("Refresh token is invalid");
            }
            const newAccessToken = jwt.sign(
               {"userInfo":{"userId":foundUser._id,"userName":foundUser.name,"admin":foundUser.admin}},
               process.env.ACCESS_TOKEN,
               { expiresIn: "15m" }
            );
            res.cookie("accessToken", newAccessToken, { httpOnly: true });
            req.user = decodedRefresh.userInfo;
            next();
         } catch (refreshError) {
            var foundUser = await User.findOne({ refreshToken: refresh });
            foundUser.refreshToken = foundUser.refreshToken.filter(x=> x != refresh )
            await foundUser.save();
            return res.status(403).send("you should re sing in");
         }
      } else {
         console.log(accessError.message);
         return res.status(403).send("Access token is invalid");
      }
   }
};
