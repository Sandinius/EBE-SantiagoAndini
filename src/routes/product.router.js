import { Router } from 'express';
import  express  from "express";
import ProductManager from '../ProductManager.js';
import multer from 'multer';



const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const productManager = new ProductManager();
const product = Router();

product.use(express.json());
product.use(express.urlencoded({extended: true}));
product.get('/', (req, res) => {
  const productsindex = productManager.products;
  res.render('index',{productsindex});
});

product.get('/realtimeproducts', (req, res) => {
  const productsindex = productManager.products;
  res.render('realtimeproducts',{productsindex, style:'index.css'});
});

product.post('/realtimeproducts',upload.fields([{ name: 'thumbnail', maxCount: 1 }]) ,(req, res) => {
  const { title, description, price, stock } = req.body;
  const thumbnail = req.files['thumbnail'] ? req.files['thumbnail'][0].buffer : null; 
  productManager.addProduct(title,description,price,thumbnail,stock);
  const productsindex = productManager.products;
  res.render('realtimeproducts',{productsindex, style:'index.css'});
})

product.get('/realtimeproducts/:id',(req, res) => productManager.getProductById2(req, res));

product.delete('/realtimeproducts', (req, res)=>{
  let productId = req.body.id;
  productManager.deleteProduct(productId);
})
product.delete('/realtimeproducts/:id', (req, res)=>{
  let id = req.body.id;
  productManager.deleteProduct(id)
})


product.get('/products', (req, res) => {
  productManager.getAllProducts(req, res)
});


product.get('/products/:id',(req, res) => productManager.getProductById2(req, res));

product.post('/products',upload.fields([{ name: 'thumbnail', maxCount: 1 }]) ,(req, res) => {
    const { title, description, price, stock } = req.body;
    const thumbnail = req.files['thumbnail'] ? req.files['thumbnail'][0].buffer : null;    
    res.send(productManager.addProduct(title,description,price,thumbnail,stock))
  });


product.put('/products/:id', upload.fields([{ name: 'thumbnail', maxCount: 1 }]),(req, res) =>{
  let id = req.params.id;
  const { title, description, price, stock } = req.body;
  const thumbnail = req.files['thumbnail'] ? req.files['thumbnail'][0].buffer : null;    
  res.send(productManager.updateProduct(id, title, description, price, thumbnail, stock))
})

product.delete('/products/:id', (req, res)=>{
    let id = req.params.id;
    res.send(productManager.deleteProduct(id))
})

export default product;