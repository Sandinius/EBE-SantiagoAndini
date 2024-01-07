import { Router } from 'express';
import  express  from "express";
import { messagesModel } from '../dao/models/messages.model.js';


const chat = Router();

chat.use(express.json());
chat.use(express.urlencoded({extended: true}));


chat.get('/', async (req, res)=>{
    try{
        let messages = await messagesModel.find();
        res.status(200).send({messages})
      }
      catch(error){s
        console.error(error);
        res.status(400).send({message:'messages not found'});
      }
});


chat.get('/chat',async (req, res) => {
  res.render('chat');
});

chat.post('/chat',async (req, res) => {
    const {user, message} = req.body;
    console.log(req.body);
    
   let result = await messagesModel.create({
        user,
        message
    })

    res.send({status:"success",payload:result})

      });


export default chat;