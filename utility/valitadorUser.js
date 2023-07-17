const joi = require('joi')

const validateUser = (body)=>{
   const userSchema = joi.object({
      name : joi.string().max(20).required(),
      age  : joi.number().max(99).min(18).required(),
      email : joi.string().required(),
      password:joi.string().required()
   })
   return userSchema.validate(body)
}

const validateUserSing = (body)=>{
   const userSchema = joi.object({
      email : joi.string().required(),
      password:joi.string().required()
   })
   return userSchema.validate(body)
}


module.exports = {validateUser,validateUserSing}