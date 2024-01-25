import { Router } from 'express';
import  express  from "express";
import auth from '../app.js';



const cookiesRouter = Router();

cookiesRouter.use(express.json());
cookiesRouter.use(express.urlencoded({extended: true}));


cookiesRouter.get('/setCookies', auth,(req, res) => {
  res.cookie('CoderCookie','Esta es una cookie', {maxage:10000}).send("Cookie");
});

cookiesRouter.get('/setSignedCookie', auth,(req, res) => {
    res.cookie('SignedCookie','Esta es una cookie firmada', {maxage:10000, signed:true}).send("SignedCookies");
  });

cookiesRouter.get('/getSignedCookie', auth,(req, res) => {
    res.send(req.signedCookies);
 });
cookiesRouter.get('/getCookies',auth, (req, res) => {
   res.send(req.cookies);
});

cookiesRouter.get('/deleteCookies', (req, res) => {
  res.clearCookie('CoderCookie').send('Cookie Removes');
});




export default cookiesRouter;