import { Router } from 'express';
import CartManager from '../dao/CartManager.js';
import { cartModel } from '../dao/models/cart.model.js';
import product from './product.router.js';
import  express  from "express";

const cartManager = new CartManager();
const cart = Router();
product.use(express.json());
product.use(express.urlencoded({extended: true}));

cart.get('/', async (req, res) => {

  try{
    let carts = await cartModel.find().lean();
    res.status(200).send({carts})
  }
  catch(error){
    console.error(error);
    res.status(400).send({message:'products not found'});
  }

});

cart.post('/:pid',async(req, res) => {
  const idprod = req.params.pid;

  let carts = await cartModel.find().lean();

await cartModel.create({
    
  })
});

cart.get('/:id',(req, res) => cartManager.getCartById2(req, res));

cart.put('/:cid/product/:pid', async (req, res) => {
  const idcart = req.params.cid;
  const idprod = req.params.pid;
  console.log(idcart)
  console.log(idprod)
  let carts = await cartModel.find({_id:idcart})
  console.log(carts[0].products)
  console.log(carts)
  carts[0].products.push({product:idprod});
  let result = await cartModel.updateOne({_id:idcart},carts);
  res.send({status:"success", payload:result})

});
 


export default cart;