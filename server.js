require('dotenv').config();
const express = require('express')
const cookies = require('cookie-parser');
const connection = require('./configurations/mongoodb');
const mongoose = require('mongoose')
const auth = require('./middlewares/auth')
const role = require('./middlewares/role')
const app = express()
connection();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookies())
const port = 3000 || process.env.PORT ;

app.use('/Blog',require('./routers/get'))
app.use('/Blog/regester',require('./routers/newUser'))
app.use('/Blog/sing',require('./routers/singIn'))
app.use(auth)
app.use('/Blog/new/post',require('./routers/newPost'))
app.use('/Blog/delete',role,require('./routers/delete'))
app.use('/Blog/update',require('./routers/update'))

mongoose.connection.once('open',()=>{
   console.log('connect to database')
   app.listen(port, () => console.log(`Example app listening on port ${port}!`))
})