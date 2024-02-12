import { Router } from "express";
import passport from "passport";

const router = Router();


router.get('/github',passport.authenticate('github',{scope:['user:mail']}),async(req,res)=>{})


router.get('/githubcallback',passport.authenticate('github',{failureRedirect:'/'}),async(req,res)=>{
    req.session.user = {
        name:req.user.name,
        surname: req.user.surname,
        age: req.user.age,
        mail: req.user.mail,
        admin: false,
        userRol:true
    }
    res.redirect('/loginsuccess');
})

export default router;