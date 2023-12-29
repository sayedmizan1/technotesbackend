const express = require('express')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
connectDB()
const app = express()
const PORT = process.env.PORT || 3500;
const path = require('path')
app.use('/',express.static(path.join(__dirname,'/public')))
app.use(express.json())

app.use('/',require('./routes/root'))
app.use('/users',require('./routes/auth'))
app.use('/note',require('./routes/note'))
app.all('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','404.html'))
})

app.listen(PORT , ()=> console.log(`server start at ${PORT}`))


