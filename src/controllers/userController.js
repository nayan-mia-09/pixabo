const bcrypt = require("bcrypt");
const { EncodeToken } = require("../utility/tokenHelper");
const userModel = require("../models/userModel");




let options = {
  maxAge: process.env.Cookie_Expire_Time,
  httpOnly: false,
  sameSite: "none",
  secure: true,
};

// Create user
exports.register = async(req,res)=>{
    try {
        const {email, password} = req.body;

        // find the existing user
        let ifUser = await userModel.find({email});

        if(ifUser.length > 0 ){
            return res.status(200).json({
                success: false,
                message: "Email already registered.",
            });
        }

        // Create and save the new user
        user = await userModel.create({
            email, password
        });
        res.status(201).json({
            success: true,
            message: "Registration successfully."
        });
    } catch (error) {
      res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Something went wrong.",
    });
    }
}

//User Login
exports.login = async(req,res)=>{
    try {
        const {email,password} = req.body;

        const user = await userModel.findOne({email});

        if(!user){
            return res.status(200).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // isMatch password
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(200).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        if(isMatch){
            let token = EncodeToken(user.email, user._id.toString());

            // set cookie
            res.cookie("uToken",token,options);

            res.status(200).json({
                success: true,
                message: "Login successful",
                user: {
                    id: user._id,
                    email: user.email,
                },
                token: token,
            });
        }
    } catch (error) {
        res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Something went wrong.",
    });
    }
}

// get user
exports.user = async(req,res)=>{
    try {
        let email = req.headers.email;

        let matchStage = {
            $match: {
                email,
            },
        };

        let project = {
            $project: {
                password: 0,
            },
        };

        let data = await userModel.aggregate([matchStage,project]);
        res.status(200).json({
            success: true,
            data: data[0]
        });
    } catch (error) {
      res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Something went wrong.",
    });
    }
}

// user verify
exports.userVerify = async (req,res)=>{
    try {
        res.status(200).json({success: true})
    } catch (error) {
      res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Something went wrong.",
    });
    }
}

// user logout
exports.logout = async (req,res)=>{
    try {
      res.clearCookie("uToken");
      res.status(200).json({
        success: true,
        message: "Logout success!"
      });  
    } catch (error) {
      res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Something went wrong.",
    });
    }
}

// user update
exports.update = async(req,res)=>{
    try {
        let email = req.headers.email;
        const _id = req.headers._id;
        const {
      password,
      cus_add,
      cus_city,
      cus_country,
      cus_fax,
      cus_name,
      cus_phone,
      cus_postcode,
      cus_state,
      ship_add,
      ship_city,
      ship_country,
      ship_name,
      ship_phone,
      ship_postcode,
      ship_state,
        } = req.body;
        let updateData ={
      password,
      cus_add,
      cus_city,
      cus_country,
      cus_fax,
      cus_name,
      cus_phone,
      cus_postcode,
      cus_state,
      ship_add,
      ship_city,
      ship_country,
      ship_name,
      ship_phone,
      ship_postcode,
      ship_state,
        }

        const user = await userModel.findOne({email, _id});
        if(!user){
            return res.status(200).json({
                success: false, message: "Invalid email."
            });
        }
        // যদি password ফিল্ড থাকে, তবে সেটি bcrypt দিয়ে হ্যাশ করে আপডেট করবো
        if(password){
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        //isMatch password
        const isMatch = await bcrypt.compare(password, updateData.password);
        if(!isMatch){
            return res.status(200).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        if(isMatch){
            // update user
            const user = await userModel.findByIdAndUpdate(_id,updateData,{new: true,});

            let token = EncodeToken(user?.email, user?._id.toString());

            // set cookie
            res.cookie("uToken", token,options);
            res.status(200).json({
                success: true,
                message: "Update data successful",
                user:{
                    id: user._id,
                    email: user.email,
                },
                token: token,
            });
        }
    } catch (error) {
      res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Something went wrong.",
    });
    }
}