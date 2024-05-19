import { Router } from 'express';
import  express  from "express";
import ProductManager from '../dao/ProductManager.js';
import multer from 'multer';
import { productModel } from '../dao/models/products.model.js';
import auth from '../app.js';
import { cartModel } from '../dao/models/cart.model.js';
import { userModel } from '../dao/models/user.model.js';
import { transport } from '../app.js';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const productManager = new ProductManager();
const product = Router();

product.use(express.json());
product.use(express.urlencoded({extended: true}));

product.get('/productsview',async (req, res) => {
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
  console.log(users)
  let carts = await cartModel.find().lean();
  
  const cartWithUserId = carts.find(cart => cart.user_id === users.passport.user);
  let idcart= '';

  if(cartWithUserId){
    idcart = cartWithUserId._id;
    console.log(cartWithUserId._id)
  }
  
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
     console.log(products)
  }else{
     products = await productModel.paginate({type:type},{limit:limit,page:page,sort:sort});
  }
    products.prevLink = `/realtimeproducts?type=${type}&limit=${limit}&page=${+page - 1}`;
    products.nextLink = `/realtimeproducts?type=${type}&limit=${limit}&page=${+page + 1}`;
  res.render('realtimeproducts',{products, users,idcart, style:'index.css'});
});

product.post('/realtimeproducts',upload.fields([{ name: 'thumbnail', maxCount: 1 }]) ,async (req, res) => {
  let users = req.session
  console.log(req.session)
  let thumbnail ='';
  const { title, description, price, stock } = req.body;
  if(req.files !== undefined){
    thumbnail = req.files['thumbnail'] ? req.files['thumbnail'][0].buffer : null;
  }else{
    thumbnail = null;
  }
   
  const code = productManager.generateUnicCode(); 
  let products = await productModel.find().lean();
  if(users.user !== undefined){
    if(users.user.admin){
      console.log('es admin')
    await productModel.create({
      title,
      description,
      price,
      thumbnail, 
      code,
      stock
    })
    res.send({status:"success", result:'product created'})
  }else if(users.user.premium){
    console.log('es premium')
    await productModel.create({
      title,
      description,
      price,
      thumbnail, 
      code,
      stock,
      owner: users.user.mail
    })
    res.send({status:"success", result:'product created'})
  }
  
}else{
  await productModel.create({
    title,
    description,
    price,
    thumbnail, 
    code,
    stock
  })
  res.send({status:"success", result:'product created'})
  productManager.addProduct(title,description,price,thumbnail,stock,code);

}
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

product.delete('/realtimeproducts',auth, async(req, res)=>{
  let users = req.session
  let productId = req.body.id;
  let result1 = await productModel.findOne({_id:productId}).lean()
console.log(productId)
console.log(result1)
console.log(result1.owner)
let result4 = await userModel.findOne({mail:result1.owner}).lean()
console.log(result4)
  if(users.user.premium && result1.owner === users.user.mail){
      let result2 = await productModel.deleteOne({_id:productId})
      res.send(true)
  }else if(users.user.admin){
    let result3 = await productModel.deleteOne({_id:productId})
    let result = await transport.sendMail({
      from:"Coder Test santiagoandini2@gmail.com",
      to: `${result4.mail}`,
      subject: "Su producto fue borrado",
      html:`
      <div>
         <p>El producto: ${result1.title} fue borrado por un administrador</p>
      </div>
      `,
      attachments:[]
   })
    res.send(true)
  }else{
    res.send(false)
  }
});

product.delete('/realtimeproducts/:id',auth, (req, res)=>{
  let id = req.params.id;
  productManager.deleteProduct(id)
})


//#region Products Routes

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