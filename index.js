const express=require("express");
const dotEnv=require("dotenv").config();
const mongoose=require("mongoose");
const vendorRoutes=require('./routes/vendorRoutes');
const bodyParser=require('body-parser');
const firmRoutes=require('./routes/firmRoutes')
const productRoutes=require('./routes/productRoutes');
const path=require('path');

const app=express()
app.use(bodyParser.json());
app.use('/vendor',vendorRoutes);//use the models,routers,controllers 
app.use('/firm',firmRoutes);
app.use('/product',productRoutes);
app.use('/uploads',express.static('uploads'));


mongoose.connect(process.env.MONGO_URL)
.then(()=>{console.log("MongoDB connected successfully")})
.catch((error)=>{console.log(error);
})


const port=4000;
app.listen(port,()=>{console.log(`server connected at ${port}`)})

app.use('/home',(req,res)=>{res.send("<h1>srinath</h1>")})