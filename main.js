class ProductManager {
    constructor() {
      this.products = [];
      this.idCounter = 1;

    }

    generateUniqueId() {
        const idUnic = this.idCounter++;
        return idUnic.toString(36);
        
      }
    
      getProducts() {
        return this.products;
      }
    
      addProduct({ title, description, price, thumbnail, code, stock }) {

        if (this.products.some(product => product.code === code)) {
          throw new Error("Error: The code of the product already exists");
        }
    
        const id = this.generateUniqueId();
        const newProduct = {
          id,
          title,
          description,
          price,
          thumbnail,
          code,
          stock
        };
    
        this.products.push(newProduct);
    
        return newProduct;
      }
    
      getProductById(id) {
        const product = this.products.find(product => product.id === id);
    
        if (!product) {
          throw new Error("Error: Product not found");
        }
    
        return product;
      }
    }

const productManager = new ProductManager();

console.log('Empty Array:')
console.log(productManager.getProducts());


const addedProduct = productManager.addProduct({
  title: "producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc123",
  stock: 25
});

console.log('Product Added:')
console.log(productManager.getProducts());

try {
  productManager.addProduct({
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25
  });
} catch (error) {
  console.error(error.message);
}

console.log('Get the product by it ID')
console.log(productManager.getProductById(addedProduct.id));

try {
  productManager.getProductById("invalidId");
} catch (error) {
    console.log('Get produt by an invalid ID')
  console.error(error.message);
}