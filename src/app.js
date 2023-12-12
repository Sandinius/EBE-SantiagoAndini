import  express  from "express";
import product from "./routes/product.router.js";
import cart from "./routes/cart.router.js";
const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use('/api/products', product);
app.use('/api/carts', cart);
app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});
