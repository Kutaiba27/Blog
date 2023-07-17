const mongoose = require('mongoose')


const connection = ()=>{
   try {
      mongoose.connect(process.env.URL_MONGO)
   } catch (error) {
      console.log(error.message)
   }
}

// generat the random array
module.exports= connection