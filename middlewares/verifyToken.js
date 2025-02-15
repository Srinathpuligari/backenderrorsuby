
const Vendor=require("../models/Vendor");
const jwt=require("jsonwebtoken");
const dotEnv=require("dotenv").config();

const secretKey=process.env.WhatIsYourName;

const verifyToken = async(req,res, next)=>{
    const token = req.headers.token;

    if (!token){
        return res.status(401).json({error: "token is required"});
    }
    try {
        const decoded=jwt.verify(token,secretKey);
        const vendor=await Vendor.findById(decoded.vendorId);//verify with _id of decodee and real from db
        if(!vendor){
            return response.status(404).json({error:"vendor not found"})
        }
        req.vendorId=vendor._id

        next()
        
    } catch (error) {
        console.error(error)
        return res.status(500).json({error:"invalid token"});
    }
}

module.exports=verifyToken;