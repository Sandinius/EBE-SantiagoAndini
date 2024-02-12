import { Router } from 'express';
import  express  from "express";
import ProductManager from '../dao/ProductManager.js';
import multer from 'multer';
import { productModel } from '../dao/models/products.model.js';
import auth from '../app.js';


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const productManager = new ProductManager();
const product = Router();

product.use(express.json());
product.use(express.urlencoded({extended: true}));

product.get('/productsview',auth,async (req, res) => {
  let { type, limit, page, sort } = req.query;
  if(type == undefined){
    type = '';
  }
  if (limit == undefined){
    limit = 10;
  }
  if (page == undefined){
    page= 1;
  }
  if (sort == undefined || sort == ''|| sort == 1){
  sort = {
    price: 1,
  };
  }else{
    sort = {
      price: -1,
    };
  }

  let products = ""; 
  if(type == undefined || type == ""){
     products = await productModel.paginate({},{limit:limit,page:page,sort:sort});
  }else{
     products = await productModel.paginate({type:type},{limit:limit,page:page,sort:sort});
  }
  console.log(products)
  products.prevLink = `/?type=${type}&limit=${limit}&page=${+page - 1}`;
  products.nextLink = `/?type=${type}&limit=${limit}&page=${+page + 1}`;
  res.render('index',{products});
});


// Realtime products route

product.get('/realtimeproducts',auth, async (req, res) => {
  let users = req.session
  console.log(users.user.userRol)

  let { type, limit, page, sort } = req.query;
  if(type == undefined){
    type = '';
  }
  if (limit == undefined){
    limit = 10;
  }
  if (page == undefined){
    page= 1;
  }
  if (sort == undefined || sort == ''|| sort == 1){
    sort = {
      price: 1,
    };
    }else{
      sort = {
        price: -1,
      };
    }
  let products = ""; 
  if(type == undefined || type == ""){
     products = await productModel.paginate({},{limit:limit,page:page,sort:sort});
  }else{
     products = await productModel.paginate({type:type},{limit:limit,page:page,sort:sort});
  }
    products.prevLink = `/realtimeproducts?type=${type}&limit=${limit}&page=${+page - 1}`;
    products.nextLink = `/realtimeproducts?type=${type}&limit=${limit}&page=${+page + 1}`;
    console.log(products.docs[0].title)

  res.render('realtimeproducts',{products, users, style:'index.css'});
});

product.post('/realtimeproducts',auth,upload.fields([{ name: 'thumbnail', maxCount: 1 }]) ,async (req, res) => {
  const { title, description, price, stock } = req.body;
  const thumbnail = req.files['thumbnail'] ? req.files['thumbnail'][0].buffer : null; 
  productManager.addProduct(title,description,price,thumbnail,stock);
  let products = await productModel.find().lean();
  const code = productManager.generateUnicCode(); 
  await productModel.create({
    title,
    description,
    price,
    thumbnail, 
    code,
    stock
  })
  res.render('realtimeproducts',auth,{products, style:'index.css'});
})

product.get('/realtimeproducts/:id',auth,async (req, res) => {
  let id = req.params.id;
  let products = await productModel.find().lean();

  if(products.some(product => product.id === id)){
  res.send(productManager.getProductById2(req, res))
}else{
  let result = await productModel.find({_id:id})
  res.send({status:"success", payload:result})
}
});

product.delete('/realtimeproducts',auth, (req, res)=>{
  let productId = req.body.id;
  productManager.deleteProduct(productId);
})
product.delete('/realtimeproducts/:id',auth, (req, res)=>{
  let id = req.params.id;
  productManager.deleteProduct(id)
})


//Products Routes

product.get('/products',auth,async (req, res) => {
  try{
    let products = await productModel.find().lean();
    res.status(200).send({products})
  }
  catch(error){
    console.error(error);
    res.status(400).send({message:'products not found'});
  }
});


product.get('/products/:id',auth,async(req, res) =>{
  let id = req.params.id;
  
  let result = await productModel.paginate({_id:id})
  res.send({status:"success", payload:result})

});

product.post('/products',auth,upload.fields([{ name: 'thumbnail', maxCount: 1 }]) ,async (req, res) => {
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


product.put('/products/:id',auth, upload.fields([{ name: 'thumbnail', maxCount: 1 }]),async(req, res) =>{
  let id = req.params.id;
  const { title, description, price, stock } = req.body;
  const productToUpdate = req.body;
  let products = await productModel.find().lean();
  const thumbnail = req.files['thumbnail'] ? req.files['thumbnail'][0].buffer : null;  

  if(products.some(product => product.id === id)){
    res.send(productManager.updateProduct(id, title, description, price, thumbnail, stock))
  }else{
  let result = await productModel.updateOne({_id:id},productToUpdate)
  res.send({status:"success", payload:result})
  }
})

product.delete('/products/:id',auth,async (req, res)=>{
    let id = req.params.id;
    let products = await productModel.find().lean();

    if(products.some(product => product.id === id)){
    res.send(productManager.deleteProduct(id))
    }else{
    let result = await productModel.deleteOne({_id:id})
    res.send({status:"success", payload:result})
  }
})

export default product;