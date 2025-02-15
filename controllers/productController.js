
const Product=require("../models/Product");
const multer=require("multer");
const Firm=require('../models/Firm')

const storage = multer.diskStorage({
    destination: 'uploads/', // Folder to store images
    filename: (req, file, cb) => {
        cb(null, Date.now() +Path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage });


const addProduct=async(req,res)=>{
    try {
        const {productName,price,category,bestseller,description}=req.body;

        const image=req.file? req.file.filename:undefined;

        const firmId=req.params.firmId;//retrive with it firm id

        const firm=await Firm.findById(firmId);
        if (!firm){
            return res.status(404).json({error:"no firm found"})

        }
        const product=new Product({
            productName,price,category,bestseller,description,image,firm:firm._id
        })
        const savedProduct=await product.save();

        firm.products.push(savedProduct);

        await firm.save();
        return res.status(200).json(savedProduct)
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Internal server error"})
    }
}

const getProductByFirm=async(req,res)=>{
    try {
        const firmId=req.params.firmId;
        const firm=await Firm.findById(firmId);
        if (!firm){
            return res.status(404).json({error:"no firm found"})
        }

        const restaurantName=firm.firmName;
        const products=await Product.find({firm:firmId});
        res.status(200).json({restaurantName,products});
    } catch (error) {
        console.log(error)
        return res.status(500).json({error:"Internal server error"})
    }
}

const deleteProductById=async(req,res)=>{
    try {
        const productId=req.params.productId;
        const deletedProduct=await Product.findByIdAndDelete(productId);
        if (!deletedProduct){
            return res.status(404).json({error:'no product found'})
        }
        res.status(200).json({ message: 'Product deleted successfully' });

    } catch (error) {
        console.log(error)
        return res.status(500).json({error:"Internal server error"})
    }
}


module.exports = {
    addProduct: [upload.single('image'), addProduct],
    getProductByFirm,
    deleteProductById,
};