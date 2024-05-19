import { Router } from 'express';
import  express  from "express";
import multer from 'multer';
import { userModel } from '../dao/models/user.model.js';
import auth3 from '../app.js';
import auth from '../app.js';
import { transport } from '../app.js';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const userRouter = Router();

userRouter.use(express.json());
userRouter.use(express.urlencoded({extended: true}));


userRouter.get('/',auth3,async(req,res)=>{
    
    let users = await userModel.find().lean();
    res.render('usersViews',{users});
 
 })

userRouter.delete('/',auth3,async(req,res)=>{
    let userid = req.body.id;
    console.log(userid)
    let users = await userModel.findOne({_id: userid})
    const lastConnectionDate = new Date(users.last_connection);

    const currentDate = new Date();

    const diffTime = currentDate - lastConnectionDate;

    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if(diffDays > 2){

        await userModel.deleteOne({_id: userid})
        let result = await transport.sendMail({
            from:"Coder Test santiagoandini2@gmail.com",
            to: `${users.mail}`,
            subject: "Su cuenta fue borrada",
            html:`
            <div>
               <h1>Inactividad prolongada:</h1>
               <p>Debido a que no se conecta hace mas de dos dias su cuenta fue borrada del sistema, saludos</p>
            </div>
            `,
            attachments:[]
         })
        res.send(true);
    }else{
        res.send(false);
    }
 
 })

userRouter.get('/current', auth,async(req,res)=>{
    let users = req.session
   console.log(users.user.userRol)
 
    res.render('current',{users});
 
 })

userRouter.get('/premium/:id',auth3,async(req,res)=>{
    const id = req.params
    let update1 = await userModel.findOne({_id: id.id})
    console.log(update1)
    let test1 = false;
    let test2 = false;
    let test3 = false;
    if(update1.role === 'user' && update1.documents !== null){
        update1.documents.forEach(element => {
            console.log(element)
            if(element.name.includes('identificacion')){
                test1 =true
            }
            if(element.name.includes('comprobante de domicilio')){
                test2 =true
            }
            if(element.name.includes('comprobante de estado de cuenta')){
                test3 =true
            }
        });
        if(test1 && test2 && test3){
            await userModel.updateOne({ _id: id.id }, { $set: { role: 'premium' } });
            res.send({status: 'Success', result:"Role updated to Premium"})
        }else{
            res.send({status: 'Failed', result:"Tiene que cargar los documentos nesesarios"})

        }
       
    }else if(update1.role === 'premium'){
       await userModel.updateOne({ _id: id.id }, { $set: { role: 'user' } });
       res.send({status: 'Success', result:"Role updated to User"})
    }else{
        res.send({status: 'Failed', result:"Tiene que cargar los documentos nesesarios"})
    }
     
    })
userRouter.get('/premium/:id/documents', auth3,async(req,res)=>{
    const id = req.params
    let update1 = await userModel.findOne({_id: id.id})
    if(update1){
        res.render('premium-docs',{style:'index.css'});
    }else{
        res.send({status:"Error", result:`El usuario con id ${id} no existe`})

    } 
    });
userRouter.post('/premium/:id/documents', upload.array('document'), async(req, res) => {
        const id = req.params.id;
        
        let documents = [];
        
        req.files.forEach(file => {
            let document = {
                name: file.originalname,
                reference: file.buffer
            };
            documents.push(document);
        });
        
        console.log(id);
        console.log(documents);

    
    let update1 = await userModel.updateOne({ _id: id }, { documents: documents });
    console.log(update1)

    res.send({ status: 'Success', result: "Documentos actualizados correctamente." });

    });

export default userRouter;