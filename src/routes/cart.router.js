import { Router } from 'express';
import CartManager from '../dao/CartManager.js';
import { cartModel } from '../dao/models/cart.model.js';
import product from './product.router.js';
import  express  from "express";
import auth from '../app.js';
import { productModel } from '../dao/models/products.model.js';
import { ticketModel } from '../dao/models/tickets.model.js';
import { transport } from '../app.js';

const cartManager = new CartManager();
const cart = Router();
product.use(express.json());
product.use(express.urlencoded({extended: true}));

cart.get('/',auth,async (req, res) => {
  let users = req.session
  let showProducts = []
  try{
    let carts = await cartModel.find().lean();

    const hasCartWithoutUserId = carts.some(cart => cart.user_id == users.passport.user);

    if (!hasCartWithoutUserId) {

    await cartManager.generateCart(users.passport.user);

}
carts = await cartModel.findOne({user_id: users.passport.user}).lean();

showProducts = await Promise.all(carts.products.map(async prod => {
  return await productModel.findOne({ _id: prod.product }).lean();
}));
console.log(showProducts)

const totalPrice = showProducts.reduce((sum, product) => sum + product.price, 0);

res.render('cartview',{showProducts,totalPrice, style:'index.css'});
  }
  catch(error){
    console.error(error);
    res.status(400).send({message:'Carts not found'});
  }


});

cart.post('/:pid',async(req, res) => {
 
  try {
    const users = req.session.user

    const idprod = req.params.pid;
    const userId = req.user._id;
    console.log(users.mail)
    let producto = await productModel.findOne({_id: idprod}).lean() ;

    console.log(producto)

    let cart = await cartModel.findOne({ user_id: userId }).lean();

   if (!cart) {
    cart = await cartModel.create({ user_id: userId });
  }
console.log(producto.owner)
if(users.mail !== producto.owner){
  const productToAdd = { product: producto }; 
  cart.products.push(productToAdd);

  await cartModel.findOneAndUpdate({ user_id: userId }, { products: cart.products });

  res.status(200).json({ message: "Producto agregado al carrito exitosamente." });
}else{
  res.status(500).json({message: "no puede agregar un producto que haya creado usted"})
}
}catch (error) {
  
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

    let result = await transport.sendMail({
      from:"Coder Test santiagoandini2@gmail.com",
      to: `${usuario}`,
      subject: "Su compra fue finalizada correctamente",
      html:`
      <div>
         <p>Usted ha comprado el dia ${date}, la siguente cantidad de productos: ${largo}, con el codigo de compra: ${code}. En el caso de haber algun inconveniente comuniquese con la empresa. Saludos</p>
      </div>
      `,
      attachments:[]
   })
    res.status(200).json({ message: "Producto agregado al carrito exitosamente." });
  });



export default cart;