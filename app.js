const express = require('express');

const app = express();
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const dotEnv = require('dotenv');
const connectDB = require('./src/config/databaseConfig');
const { route } = require('./src/routes/api');

dotEnv.config();

//Database Connect

connectDB();

mongoose.set("strictQuery",false);

//Global Middlewares
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173","http://localhost:3001"],credentials: true,
}));

app.use(helmet.contentSecurityPolicy({
    useDefaults: true,
    directives:{
        "img-src": ["'self'","https: data:"],
    },
}));

app.use(mongoSanitize());
app.use(hpp());

app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({limit: "50mb"}));

const limiter = rateLimit({windowMs: 15 * 60 * 1000, max: 3000}) // 3000 request per 15 minutes

app.use(limiter);

app.use("/api/v1",route);

app.use("api/v1/get-file", express.static("uploads"));

//Serve Frontend

// app.use("/admin",
//     express.static(path.join(__dirname, "client", "admin", "dist"),{
//         index: false,
//     })
// );
// app.get("/admin",(req,res)=>{
//     res.sendFile(
//         path.resolve(__dirname,"client","admin","dist","index.html")
//     )
// });

// app.use(express.static(path.join(__dirname,"client","user","dist")));
// app.get("*",(req,res)=>{
//     res.sendFile(
//         path.resolve(__dirname,"client","user","dist","index.html")
//     )
// });

module.exports = app;