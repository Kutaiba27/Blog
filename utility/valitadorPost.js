
const joi = require('joi')

const valdation = (body)=>{
   const schema = joi.object({
      title: joi.string().required(),
      discreption:joi.string().required()
   })
   return schema.validate(body)
}



module.exports= valdation