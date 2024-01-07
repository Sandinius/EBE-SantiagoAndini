import { Router } from 'express';
import CartManager from '../dao/CartManager.js';


const cartManager = new CartManager();
const cart = Router();

cart.get('/', (req, res) => cartManager.getAllCarts(req, res));

cart.post('/',(req, res) => {
    res.send(cartManager.addCart(req.body))
  });

cart.get('/:id',(req, res) => cartManager.getCartById2(req, res));

cart.post('/:cid/product/:pid',(req, res) => {
  const idcart = req.params.cid;
  const idprod = req.params.pid;
  res.send(cartManager.addProductToCart(idcart, idprod))
});



export default cart;