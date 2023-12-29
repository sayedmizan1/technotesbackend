const mongoose = require('mongoose');
const mongoURI = "mongodb://127.0.0.1:27017/techNotesDB";

const connectDB=()=>{
    mongoose.connect(mongoURI,()=>{
        console.log("Connect to mongoose sucessfully");
    })
}

module.exports = connectDB;

