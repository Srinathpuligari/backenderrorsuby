const Product = require("../models/Product");
const multer = require("multer");
const Firm = require('../models/Firm');
const path = require("path");

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Folder to store images
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage: storage });

const addProduct = async (req, res) => {
    try {
        const { productName, price, category, bestseller, description } = req.body;

        // Check if file is uploaded
        if (!req.file) {
            return res.status(400).json({ error: "No image file uploaded" });
        }

        const image = req.file.filename; // Get the uploaded file name

        const firmId = req.params.firmId; // Retrieve firm ID from params

        const firm = await Firm.findById(firmId);
        if (!firm) {
            return res.status(404).json({ error: "No firm found" });
        }

        const product = new Product({
            productName,
            price,
            category,
            bestseller,
            description,
            image,
            firm: firm._id,
        });

        const savedProduct = await product.save();

        firm.products.push(savedProduct);
        await firm.save();

        return res.status(200).json(savedProduct);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const getProductByFirm = async (req, res) => {
    try {
        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);
        if (!firm) {
            return res.status(404).json({ error: "No firm found" });
        }

        const restaurantName = firm.firmName;
        const products = await Product.find({ firm: firmId });
        res.status(200).json({ restaurantName, products });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const deleteProductById = async (req, res) => {
    try {
        const productId = req.params.productId;
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'No product found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    addProduct: [upload.single('image'), addProduct],
    getProductByFirm,
    deleteProductById,
};