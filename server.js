require('dotenv').config();
const express = require('express')
const cookies = require('cookie-parser');
const connection = require('./configurations/mongoodb');
const userRouter = require('./routers/userRouter');
const postRouter = require('./routers/postRouter');
const mongoose = require('mongoose')

const app = express()
connection();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookies())
const port = 3000 || process.env.PORT ;
app.use('/Blog/user',userRouter)
app.use('Blog/post',postRouter)

mongoose.connection.once('open',()=>{
   console.log('connect to database')
   app.listen(port, () => console.log(`Example app listening on port ${port}!`))
})