const bcrypt = require("bcrypt");




const adminModel = require("../models/adminModel");
const { EncodeToken } = require("../utility/tokenHelper");

let options = {
    maxAge: process.env.Cookie_Expire_Time,
    httpOnly: false,
    sameSite: "none",
    secure: true,
};
//Create admin 
exports.register = async (req,res)=>{
    try {
        const {email, password} = req.body;

       user =  await adminModel.create({email,password});
        res.status(201).json({
            success: true,
            message: "Admin Created Successfully!"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Something went wrong"
        })
    }
}

//admin login

exports.login = async(req,res)=>{
    try {
        const {email,password} = req.body;
        const user = await adminModel.findOne({email});

        if(!user){
            return res.status(401).json({success: false, message: "Invalid email or password"});
        }

        // isMatch password
        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }else{
            let token = EncodeToken(user.email, user._id.toString());
            
            // set cookie
            res.cookie("aToken", token, options);
            res.status(200).json({
                success: true,
                message: "Login successful",
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
            message: "Something went wrong"
        }) 
    }
}

//get user 
exports.admin = async(req,res)=>{
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
        let data = await adminModel.aggregate([matchStage,project]);
        res.status(200).json({
            success: true,
            data: data[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Something went wrong"
        })
    }
}

// admin verify
exports.adminVerify = async(req,res)=>{
    try {
        res.status(200).json({
            success: true 
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Something went wrong"
        })
    }
}

// admin logout
exports.logout = async(req,res)=>{
    try {
        res.clearCookie("aToken");
        res.status(200).json({
            success: true,
            message: "Logout success!"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Something went wrong"
        })
    }
}

// admin update
exports.update = async(req,res)=>{
    try {
        const {email, password} = req.body;
        const _id = req.headers._id;

        let updatedData = {email};

        const user = await adminModel.findOne({_id});
        if(!user){
            return res.status(401).json({
                success: false, 
                message: "Invalid email."
            });
        }

        // যদি password ফিল্ড থাকে, তবে সেটি bcrypt দিয়ে হ্যাশ করে আপডেট করবো
        if(password){
            const hashedPassword = await bcrypt.hash(password,10);
            updatedData.password = hashedPassword;
        }

        // update admin
        const updatedUser = await adminModel.findByIdAndUpdate(_id, updatedData,{
            new: true, 
        });

        let token = EncodeToken(updatedUser?.email,updatedUser?._id.toString());

        // set cookie
        res.cookie("aToken",token,options);

        res.status(200).json({
            success: true,
            message: "Admin updated successfully",
            user: {
                email: updatedUser.email,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Something went wrong"
        })
    }
}