import { Router } from 'express';
import  express  from "express";
import ProductManager from '../dao/ProductManager.js';
import multer from 'multer';
import { productModel } from '../dao/models/products.model.js';


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const productManager = new ProductManager();
const product = Router();

product.use(express.json());
product.use(express.urlencoded({extended: true}));

product.get('/',async (req, res) => {
  const productsindex = productManager.products;
  res.render('index',{productsindex});
});


// Realtime products route

product.get('/realtimeproducts', (req, res) => {
  const productsindex = productManager.products;
  res.render('realtimeproducts',{productsindex, style:'index.css'});
});

product.post('/realtimeproducts',upload.fields([{ name: 'thumbnail', maxCount: 1 }]) ,async (req, res) => {
  const { title, description, price, stock } = req.body;
  const thumbnail = req.files['thumbnail'] ? req.files['thumbnail'][0].buffer : null; 
  productManager.addProduct(title,description,price,thumbnail,stock);
  const productsindex = productManager.products;
  const code = productManager.generateUnicCode(); 
  await productModel.create({
    title,
    description,
    price,
    thumbnail, 
    code,
    stock
  })
  res.render('realtimeproducts',{productsindex, style:'index.css'});
})

product.get('/realtimeproducts/:id',async (req, res) => {
  let id = req.params.id;
  const productsindex = productManager.products;

  if(productsindex.some(product => product.id === id)){
  res.send(productManager.getProductById2(req, res))
}else{
  let result = await productModel.find({_id:id})
  res.send({status:"success", payload:result})
}
});

product.delete('/realtimeproducts', (req, res)=>{
  let productId = req.body.id;
  productManager.deleteProduct(productId);
})
product.delete('/realtimeproducts/:id', (req, res)=>{
  let id = req.params.id;
  productManager.deleteProduct(id)
})


//Products Routes

product.get('/products',async (req, res) => {
  try{
    let products = await productModel.find();
    res.status(200).send({products})
  }
  catch(error){
    console.error(error);
    res.status(400).send({message:'products not found'});
  }
});


product.get('/products/:id',async(req, res) =>{
  let id = req.params.id;
  const productsindex = productManager.products;

  if(productsindex.some(product => product.id === id)){
  res.send(productManager.getProductById2(req, res))
}else{
  let result = await productModel.find({_id:id})
  res.send({status:"success", payload:result})
}
});

product.post('/products',upload.fields([{ name: 'thumbnail', maxCount: 1 }]) ,async (req, res) => {
    const { title, description, price, stock } = req.body;
    const thumbnail = req.files['thumbnail'] ? req.files['thumbnail'][0].buffer : null;   
    const code = productManager.generateUnicCode(); 
    productManager.addProduct(title,description,price,thumbnail,code,stock)
    let result = await productModel.create({
      title,
      description,
      price,
      thumbnail, 
      code,
      stock
    })
    res.send({status:"success",payload:result})
  });


product.put('/products/:id', upload.fields([{ name: 'thumbnail', maxCount: 1 }]),async(req, res) =>{
  let id = req.params.id;
  const { title, description, price, stock } = req.body;
  const productToUpdate = req.body;
  const productsindex = productManager.products;
  const thumbnail = req.files['thumbnail'] ? req.files['thumbnail'][0].buffer : null;  

  if(productsindex.some(product => product.id === id)){
    res.send(productManager.updateProduct(id, title, description, price, thumbnail, stock))
  }else{
  let result = await productModel.updateOne({_id:id},productToUpdate)
  res.send({status:"success", payload:result})
  }
})

product.delete('/products/:id',async (req, res)=>{
    let id = req.params.id;
    const productsindex = productManager.products;

    if(productsindex.some(product => product.id === id)){
    res.send(productManager.deleteProduct(id))
    }else{
    let result = await productModel.deleteOne({_id:id})
    res.send({status:"success", payload:result})
  }
})

export default product;