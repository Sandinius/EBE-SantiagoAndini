import  express  from "express";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import product from "./routes/product.router.js";
import cart from "./routes/cart.router.js";
import {Server} from "socket.io";


const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`);});
const socketServer = new Server(httpServer);

app.engine('handlebars', handlebars.engine());
app.set('views',__dirname+'/views');
app.set('view engine','handlebars');
app.use(express.static(__dirname+'/public'));
app.use('/',product);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use('/api', product);
app.use('/api/carts', cart);

socketServer.on('connection', socket =>{
   console.log("Nuevo cliente conectado")
   
})