import  express  from "express";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import product from "./routes/product.router.js";
import cart from "./routes/cart.router.js";
import chat from "./routes/message.router.js";
import {Server} from "socket.io";
import mongoose from "mongoose";
import cookiesRouter from "./routes/cookies.router.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import FileStore  from "session-file-store";
import MongoStore from "connect-mongo";
import Validates from "./dao/validate.js";
import { userModel } from "./dao/models/user.model.js";



const fileStorage = FileStore(session);
export const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`);});


const validates = new Validates();

mongoose.connect('mongodb+srv://santiagoandini2:123@clustercorder.bht8tuu.mongodb.net/ecommerce');

const socketServer = new Server(httpServer);

const hbs = handlebars.create({
   runtimeOptions: {
      allowProtoPropertiesByDefault: true
   }
})


export default function auth(req,res,next){
   if (req.session?.admin || req.session?.userRol){
      return next()
   }
   return res.status(401).send('Debes estar logueado para entrar a esta pagina')
}


 async function serchUsers(mail, password){
   let users = await userModel.find().lean();
   users.forEach(element => {
       if (  element.mail === mail || element.password === password ){
          return true;
       }else{
           return false;
       }
   });
}

app.use(cookieParser("CoderS3cR3tC0D3"))
app.engine('handlebars', hbs.engine);
app.use(session({

   store:MongoStore.create({
         mongoUrl: "mongodb+srv://santiagoandini2:123@clustercorder.bht8tuu.mongodb.net/ecommerce",
         mongoOptions:{useNewUrlParser:true,useUnifiedTopology:true},
         ttl:15,
   }),
   store:new fileStorage({path:'./sessions', ttl:100, retries:0}),
   secret:'secretCoder',
   resave:false,
   saveUninitialized:false
}))
app.get('/',(req,res)=>{
   res.render('login');

})


app.get('/privado', auth, (req, res)=>{
   res.send('Si estas viendo esto es porque estas logueado')
})
app.set('views',__dirname+'/views');
app.set('view engine','handlebars');
app.use(express.static(__dirname+'/public'));
app.use('/',product);
app.use('/', cookiesRouter)
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use('/api/carts', cart,);
app.use('/api/chats', chat);
app.get('/registrer',(req,res)=>{
res.render('registrer');

})
app.get('/logout',(req,res)=>{
   req.session.destroy(err=>{
      if(err){
         return res.json({ status: 'Logout ERROR', body: err })
      }
      res.render('logout');
   })
})
app.post('/', async(req,res)=>{
   
   const {mail, password} = req.body
   if(mail === 'adminCoder@Coder.com' || password === 'adminCod3r123'){
      res.redirect('/realtimeproducts');
   }else{
      if(serchUsers(mail,password)){
         if(req.session?.mail === mail || req.session?.password === password){
            console.log('entro al cuarto if')

            res.redirect('/realtimeproducts');

            }
            else{
               res.redirect('/faillogin');   
            } 
         } 
      else{
         res.redirect('/faillogin');   
      } 
   }  
})

app.get('/faillogin',(req,res)=>{
   res.render('loginfail');

})
app.post('/registrer', async(req,res)=>{
   
   const {name, surname,mail,age, password} = req.body
   
   if( !validates.valueExist(name) & !validates.valueExist(surname) & !validates.valueExist(mail) & !validates.valueExist(age) & !validates.valueExist(password) ){
      return res.send('Registration failed')
   }
   if(mail !== 'adminCoder@Coder.com' || password !== 'adminCod3r123'){
      await userModel.create({
         name,
         surname,
         mail,
         age, 
         password
       })
      req.session.mail = mail
      req.session.password = password
      req.session.userRol = true;
      req.session.admin = false;
      res.redirect('/')      
   }else{
      req.session.mail = mail
      req.session.password = password
      req.session.userRol = false;
      req.session.admin = true;
     
      res.redirect('/');
   }
})
socketServer.on('connection', socket =>{
   console.log("Nuevo cliente conectado")
   
})