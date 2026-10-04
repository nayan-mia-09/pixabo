const mongoose = require('mongoose');
const dotEnv = require('dotenv');

const connectDB = async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`Database Connected: ${conn.connection.host}`);
        console.log(`Database Name: ${conn.connection.name}`);
    } catch (error) {
        console.log(`Error ${error.message}`)
    }
}

module.exports = connectDB;