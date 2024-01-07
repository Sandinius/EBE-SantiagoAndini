import fs from 'fs';

class ProductManager {
    constructor() {
      this.products = [];
      this.fileName = './products.json';
      this.loadProductsFromDisk();
    }
  
    generateUniqueId() {
      const idUnic = this.idCounter++;
      return idUnic.toString(36);
    }
    generateUnicCode() {
      const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let unicCode = '';
    
      for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        unicCode += characters[randomIndex];
      }
    
      return unicCode.toString(36);
    }
    getProducts() {
      return this.products;
    }
  
    addProduct( title,description,price,thumbnail,code,stock) {
      
      if (this.products.some(product => product.code === code)) {
        throw new Error("Error: The code of the product already exists");
      }
      const status = true;
      const id = this.generateUniqueId();
      const newProduct = {
        id,
        title: title,
        description: description,
        price: price,
        status,
        thumbnail: thumbnail,
        code: code,
        stock: stock
      };
  
      this.products.push(newProduct);
      this.saveProductsToDisk(); 
  
      return newProduct; 
    }
  
    getProductById(id) {
      const product = this.products.find(product => product.id === id);
  
      if (!product) {
        throw new Error("Error: Product not found");
      }
  
      return product;
    }
  
    updateProduct( id, title, description, price, thumbnail, stock ) {
      const productIndex = this.products.findIndex(product => product.id === id);
      const code = this.generateUnicCode();
      const status = true;

      if (productIndex !== -1) {
        this.products[productIndex] = {
          id,
          title: title,
          description: description,
          price: price,
          thumbnail: thumbnail,
          status,
          code,
          stock: stock
        };
  
        this.saveProductsToDisk(); 
        return this.products[productIndex];
      } else {
        throw new Error("Error: Product not found");
      }
    }
  
    deleteProduct(id) {
      const productIndex = this.products.findIndex(product => product.id === id);
  
      if (productIndex !== -1) {
        const deletedProduct = this.products.splice(productIndex, 1)[0];
        this.saveProductsToDisk(); 
        return deletedProduct;
      } else {
        throw new Error("Error: Product not found");
      }
    }
  
    saveProductsToDisk() {
      const data = JSON.stringify(this.products, null, 2);
      fs.writeFileSync(this.fileName, data);
    }
  
    loadProductsFromDisk() {
      try {
        const data = fs.readFileSync(this.fileName, 'utf8');
        this.products = JSON.parse(data);
      const maxId = this.products.reduce((max, product) => Math.max(max, parseInt(product.id, 36)), 0);
      this.idCounter = maxId + 1;
      } catch (error) {
        console.error('Error loading products from disk:', error);
        this.products = [];
      }
    }
    getAllProducts(req, res) {
      const limit = parseInt(req.query.limit, 10);
      const productsToReturn = limit ? this.products.slice(0, limit) : this.products;
      res.json(productsToReturn);
    }
  
    getProductById2(req, res) {
      const id = req.params.id;
      const product = this.products.find(product => product.id === id);
  
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ error: "Product not found" });
      }
    }
  }

  export default ProductManager;