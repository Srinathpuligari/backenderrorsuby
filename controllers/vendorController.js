const Vendor=require('../models/Vendor');
const dotenv=require('dotenv').config();
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const mongoose=require('mongoose');

const secretKey=process.env.WhatIsYourName;

const vendorRegister=async(req,res)=>{
    console.log(req.body);
    const{ username,email,password }=req.body;
    try{
        const vendorEmail=await Vendor.findOne({email});
        if (vendorEmail){
            return res.status(400).json("Email already taken");
        }
        const hashedPassword=await bcrypt.hash(password,10);

        const newVendor = new Vendor({
            username,
            email,
            password:hashedPassword
        });

        await newVendor.save();

        res.status(201).json({message:"vendor registered successfully"});
        console.log('registered');
    }catch(error){
        console.log(error);
        res.status(500).json({error: "Internal server error"})

    }
}


const vendorLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const vendor = await Vendor.findOne({ email });
        if (!vendor || !(await bcrypt.compare(password, vendor.password))) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign({ vendorId: vendor._id }, secretKey, { expiresIn: '1h' });

        res.status(200).json({ success: 'Login successful', token, vendorId: vendor._id });
        console.log(email, 'this is token', token);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const getAllVendors=async(req,res)=>{
    try {
        const  vendors=await Vendor.find().populate('firm');
        res.json({vendors})
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "internal server error"});
    }
}

const getVendorById = async (req, res) => {
    const vendorId = req.params.requestedvendorid;

    // Check if vendorId is provided
    if (!vendorId) {
        return res.status(400).json({ error: 'Vendor ID is required' });
    }

    // Check if vendorId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
        return res.status(400).json({ error: 'Invalid Vendor ID format' });
    }

    try {
        const vendor = await Vendor.findById(vendorId).populate('firm');
        if (!vendor) {
            return res.status(404).json({ error: 'Vendor not found' });
        }

        if (vendor.firm.length > 0) {
            const vendorFirmId = vendor.firm[0]._id;
            return res.status(200).json({ vendorFirmId });
        } else {
            return res.status(200).json({ message: 'Vendor has no associated firm' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {vendorRegister , vendorLogin, getAllVendors,getVendorById}