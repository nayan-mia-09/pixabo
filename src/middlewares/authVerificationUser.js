const { DecodeToken } = require("../utility/tokenHelper");


module.exports =(req,res,next) =>{
    token = req.cookies["uToken"];

    let decoded = DecodeToken(token);

    if(decoded === null){
        return res.status(401).json({
            status: 401,
            message: "Invalid Token",
        });
    }else{
        let email = decoded["email"];
        let _id = decoded["_id"];
        req.headers.email = email;
        req.headers._id = _id;
        next();
    }
};