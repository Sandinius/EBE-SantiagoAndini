import { Router } from 'express';
import CartManager from '../dao/CartManager.js';
import { cartModel } from '../dao/models/cart.model.js';
import product from './product.router.js';
import  express  from "express";
import auth from '../app.js';
import { productModel } from '../dao/models/products.model.js';
import { ticketModel } from '../dao/models/tickets.model.js';

const cartManager = new CartManager();
const cart = Router();
product.use(express.json());
product.use(express.urlencoded({extended: true}));

cart.get('/',auth,async (req, res) => {
  let users = req.session
  console.log(users.passport.user)
  const idprod =  '65a85ba1364948674c622d58';
  let product = await productModel.findOne({_id: idprod}).lean() ;

  console.log(product)
  try{
    let carts = await cartModel.find().lean();

    const hasCartWithoutUserId = carts.some(cart => cart.user_id == users.passport.user);

    if (!hasCartWithoutUserId) {

    await cartManager.generateCart(users.passport.user);

}
carts = await cartModel.find({user_id: users.passport.user}).lean();

res.status(200).send({ carts });

  }
  catch(error){
    console.error(error);
    res.status(400).send({message:'Carts not found'});
  }

});

cart.post('/:pid',auth,async(req, res) => {
  try {
    const idprod = req.params.pid;
    const userId = req.user._id;

    let producto = await productModel.findOne({_id: idprod}).lean() ;

    console.log(producto)

    let cart = await cartModel.findOne({ user_id: userId }).lean();

   if (!cart) {
    cart = await cartModel.create({ user_id: userId });
  }

    const productToAdd = { product: producto };
    cart.products.push(productToAdd);

    await cartModel.findOneAndUpdate({ user_id: userId }, { products: cart.products });

    res.status(200).json({ message: "Producto agregado al carrito exitosamente." });
  } catch (error) {
    res.status(500).json({ error: "Hubo un error al procesar la solicitud." });
  }
  });


  cart.post('/:cid/purchase',auth,async(req, res) => {
    const idcart = req.params.cid
    let users = req.session
    const cart = await cartModel.findOne({ _id: idcart }).lean();
    
    const productIds = cart.products.map(productObj => productObj._id.toString());
    
    let largo = productIds.length;
    let usuario = users.user.mail;
    console.log(largo);
    let code = cartManager.generateUnicCode()
    let date = Date();
    await ticketModel.create({
      code: code,
      purchase_datetime: date,
      amount: largo,
      purcharser: usuario, 
    })

    await cartModel.updateOne({ _id: idcart }, { products: [] }).lean();

    res.status(200).json({ message: "Producto agregado al carrito exitosamente." });
  });



export default cart;