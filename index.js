const express=require("express");
const dotEnv=require("dotenv").config();
const mongoose=require("mongoose");
const vendorRoutes=require('./routes/vendorRoutes');
const bodyParser=require('body-parser');
const firmRoutes=require('./routes/firmRoutes')
const productRoutes=require('./routes/productRoutes');
const path=require('path');
const cors=require('cors');

const app=express()
const port=process.env.PORT || 4000;

app.use(cors())
app.use(bodyParser.json());
app.use('/vendor',vendorRoutes);//use the models,routers,controllers 
app.use('/firm',firmRoutes);
app.use('/product',productRoutes);
app.use('/uploads',express.static('uploads'));


mongoose.connect(process.env.MONGO_URL)
.then(()=>{console.log("MongoDB connected successfully")})
.catch((error)=>{console.log(error);
})

app.listen(port,()=>{console.log(`server connected at ${port}`)})

app.use('/info',(req,res)=>{res.send("<h1>Hi! This is Srinath</h1>")})