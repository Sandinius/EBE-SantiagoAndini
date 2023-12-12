import fs from 'fs';

class CartManager {
    constructor() {
      this.cart = [];
      this.fileName = './cart.json';
      this.product =[];
      this.productsinfo = './products.json';
      this.loadProductsFromDisk();
    }
  
    generateUniqueId() {
      const idUnic = this.idCounter++;
      console.log(idUnic);
      return idUnic.toString(36);
    }
    
    getCarts() {
      return this.cart;
    }
  
    addCart(product) {
      
      const id = this.generateUniqueId();

      const newCart = {
        id,
        product
      };
  
      this.cart.push(newCart);
      this.saveProductsToDisk(); 
  
      return newCart;
    }
    
    addProductToCart(cartId, productId) {
      // Busca el índice del carrito en this.cart
      const cartIndex = this.cart.findIndex(cart => cart.id === cartId);
  
      // Si el carrito ya existe, busca el producto en productsInfo
      if (cartIndex !== -1) {
          const productInfo = this.product.find(item => item.id === productId);
  
          if (productInfo) {
              // Verifica si ya existe el producto en el carrito
              const existingProductIndex = this.cart[cartIndex].product.findIndex(item => item.id === productId);
  
              // Si el producto ya está en el carrito, aumenta la cantidad
              if (existingProductIndex !== -1) {
                  this.cart[cartIndex].product[existingProductIndex].stock++;
              } else {
                  // Si el producto no está en el carrito, agrégalo
                  this.cart[cartIndex].product.push({
                      id: productId,
                      stock: 1
                  });
              }
  
              this.saveProductsToDisk();
          } else {
              console.error(`Error: Producto con id ${productId} no encontrado en productsInfo`);
          }
      } else {
          console.error(`Error: Carrito con id ${cartId} no encontrado en this.cart`);
      }
  } 
  
    updateProduct( id, title, description, price, thumbnail, stock ) {
      const productIndex = this.cart.findIndex(product => product.id === id);
      const code = this.generateUnicCode();
      const status = true;

      if (productIndex !== -1) {
        this.cart[productIndex] = {
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
        return this.cart[productIndex];
      } else {
        throw new Error("Error: Product not found");
      }
    }
  
   
  
    saveProductsToDisk() {
      const data = JSON.stringify(this.cart, null, 2);
      fs.writeFileSync(this.fileName, data);
    }
  
    loadProductsFromDisk() {
      try {
        const data = fs.readFileSync(this.fileName, 'utf8');
        this.cart = JSON.parse(data);
        console.log('Products loaded from disk:', this.cart);
      const maxId = this.cart.reduce((max, product) => Math.max(max, parseInt(product.id, 36)), 0);
      this.idCounter = maxId + 1;
      const data2 = fs.readFileSync(this.productsinfo, 'utf8');
        this.product = JSON.parse(data2);
        console.log('Products loaded from disk:', this.product);
      const maxId2 = this.cart.reduce((max, product) => Math.max(max, parseInt(product.id, 36)), 0);
      this.idCounter = maxId2 + 1;
      } catch (error) {
        console.error('Error loading products from disk:', error);
        this.cart = [];
      }
    }
    getAllCarts(req, res) {
      const limit = parseInt(req.query.limit, 10);
      const productsToReturn = limit ? this.cart.slice(0, limit) : this.cart;
      res.json(productsToReturn);
    }
  
    getCartById2(req, res) {
      const id = req.params.id;
      const cart = this.cart.find(product => product.id === id);
      if (cart) {
        res.json(cart.product);
      } else {
        res.status(404).json({ error: "Product not found" });
      }
    }
  }

  export default CartManager;