import  express  from "express";
import __dirname, { createHash, isValidPassword, generateProductsFine, generateProductsWrong } from "./utils.js";
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
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import router from "./routes/github.router.js";
import  twilio  from "twilio";
import CustomError from "./services/CustomError.js";
import { generateProductsInfo } from "./services/info.js";
import EErrors from "./services/enums.js";
import errorHandler from './middlewares/errors/index.js'
const fileStorage = FileStore(session);
export const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`);});

const TWILIO_ACOUNT_SID = "AC1992b63f5665bfe7f709af310a287bd5";
const TWILIO_AUTH_TOKEN = "5cc2ec6deec63828ff8325473cbb4f4a";
const TWILIO_SMS_NUMBER = "+17178645394"
const client = twilio(TWILIO_ACOUNT_SID,TWILIO_AUTH_TOKEN)
const validates = new Validates();

mongoose.connect('mongodb+srv://santiagoandini2:123@clustercorder.bht8tuu.mongodb.net/ecommerce');

const socketServer = new Server(httpServer);

const hbs = handlebars.create({
   runtimeOptions: {
      allowProtoPropertiesByDefault: true
   }
})


export default function auth(req,res,next){
   if (req.session.user?.admin || req.session.user?.userRol){
      return next()
   }
   return res.status(401).send('Debes estar logueado para entrar a esta pagina')
}
export  function auth2(req,res,next){
   if (req.session.user?.userRol){
      return next()
   }
   return res.status(401).send('Debes ser un usuario para acceder a esta area de la pagina')
}

 async function serchUsers(mail, password){
   let users = await userModel.find().lean();
   users.forEach(element => {
       if (  element.mail === mail || isValidPassword(element,password) ){
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
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.get('/',(req,res)=>{
   res.render('login');

})

app.get('/sms',auth2 , async (req,res) =>{
   let result = await client.messages.create({
      body:"esto es un mensaje",
      from: TWILIO_SMS_NUMBER,
      to: "+541126363425"
   })
   res.send({status:"succes", result:"Message sent"})
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
app.use('/', router)
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
app.post('/',passport.authenticate('login',{failureRedirect:'/faillogin'}), async(req,res)=>{
   
   if(!req.user) return res.status(400).send({status:"error",error:"Invalid credentials"})

   console.log(req.user.mail)
   console.log(req.user.password)
   if(req.user.mail === 'adminCoder@Coder.com')
   req.session.user = {
      name:req.user.name,
      surname: req.user.surname,
      age: req.user.age,
      mail: req.user.mail,
      admin: true,
      userRol:false
   }
   else{
      console.log(req.user.mail)
      console.log(req.user.password)
      req.session.user = {
         name:req.user.name,
         surname: req.user.surname,
         age: req.user.age,
         mail: req.user.mail,
         admin: false,
         userRol:true
   }}
   res.redirect('/loginsuccess');
   // const {mail, password} = req.body
   // if(mail === 'adminCoder@Coder.com' || password === 'adminCod3r123'){
   //    res.redirect('/realtimeproducts');
   // }else{
   //    if(serchUsers(mail,password)){
   //       if(req.session?.mail === mail || req.session?.password === password){

   //          res.redirect('/realtimeproducts');

   //          }
   //          else{
   //             res.redirect('/faillogin');   
   //          } 
   //       } 
   //    else{
   //       res.redirect('/faillogin');   
   //    } 
   // }  
})
app.get('/loginsuccess',(req,res)=>{
   res.render('loginsuccess');
})
app.get('/faillogin',(req,res)=>{
   res.render('loginfail');

})
app.get('/mockingproducts',(req,res)=>{
   let products = []
   for(let i=0;i<50;i++){
      products.push(generateProductsFine())
   }
   console.log(products)
   console.log(products.length)

   res.send({status: 'Success', payload: products})
})

app.post('/mockingproducts',(req,res)=>{
   const { title, price, description, stock } = req.body;
   console.log(title)
   console.log(price)
   console.log(description)
   console.log(stock)
   let products =[]
   if(title && price && description && stock){
      let productoAgregado = {title, price, description, stock}
      products.push(productoAgregado)
   }else{
      let productoAgregado = {title, price, description, stock}
      CustomError.createError({
         name: 'Product Creation Error',
         cause: generateProductsInfo(productoAgregado),
         message:'Error trying to create product',
         code: EErrors.INVALID_TYPES
      })
   }
   res.send({status: 'Success', payload: products})

})
app.use(errorHandler);

app.post('/registrer',passport.authenticate('register',{failureRedirect:'failregister'}), async(req,res)=>{
   
   // const {name, surname,mail,age, password} = req.body
   
   // if( !validates.valueExist(name) & !validates.valueExist(surname) & !validates.valueExist(mail) & !validates.valueExist(age) & !validates.valueExist(password) ){
   //    return res.send('Registration failed')
   // }
   // if(mail !== 'adminCoder@Coder.com' || password !== 'adminCod3r123'){
   //    await userModel.create({
   //       name,
   //       surname,
   //       mail,
   //       age, 
   //       password:createHash(password)
   //     })
   //    req.session.mail = mail
   //    req.session.password = password
   //    req.session.userRol = true;
   //    req.session.admin = false;
   //    res.redirect('/')      
   // }else{
   //    req.session.mail = mail
   //    req.session.password = password
   //    req.session.userRol = false;
   //    req.session.admin = true;
     
   //    res.redirect('/');
   // }
   res.redirect('/');
})
app.get('/failregister', async(req,res)=>{
   console.log('fail strategy');
   res.send({error:"failed"})
})

app.get('/current', auth,async(req,res)=>{
   let users = req.session
  console.log(users.user.userRol)

   res.render('current',{users});

})
socketServer.on('connection', socket =>{
   console.log("Nuevo cliente conectado")
   
})