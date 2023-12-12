import { Router } from 'express';
import ProductManager from '../ProductManager.js';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const productManager = new ProductManager();
const product = Router();

product.get('/', (req, res) => productManager.getAllProducts(req, res));


product.get('/:id',(req, res) => productManager.getProductById2(req, res));

product.post('/',upload.fields([{ name: 'thumbnail', maxCount: 1 }]) ,(req, res) => {
    const { title, description, price, stock } = req.body;
    const thumbnail = req.files['thumbnail'] ? req.files['thumbnail'][0].buffer : null;    
    res.send(productManager.addProduct(title,description,price,thumbnail,stock))
  });


product.put('/:id', upload.fields([{ name: 'thumbnail', maxCount: 1 }]),(req, res) =>{
  let id = req.params.id;
  const { title, description, price, stock } = req.body;
  const thumbnail = req.files['thumbnail'] ? req.files['thumbnail'][0].buffer : null;    
  res.send(productManager.updateProduct(id, title, description, price, thumbnail, stock))
})

product.delete('/:id', (req, res)=>{
    let id = req.params.id;
    res.send(productManager.deleteProduct(id))
})

export default product;