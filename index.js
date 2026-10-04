const app = require("./app")
const dotEnv = require("dotenv");


const port = process.env.PORT;

app.listen(port,()=>{
    console.log(`Server running on Port: ${port}`);
})