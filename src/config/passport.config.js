import passport from "passport";
import local from 'passport-local';
import { createHash,isValidPassword } from "../utils.js";
import { userModel } from "../dao/models/user.model.js";
import {Strategy as GitHubStrategy} from 'passport-github2'




const LocalStrategy = local.Strategy;
const initializePassport = () =>{
    
    passport.use('github', new GitHubStrategy({
        clientID:'Iv1.977b437cf2573e49',
        clientSecret:'138dfc5c8963cc9f2e8c66c4bcc0e5466686c15b',
        callbackURL:'http://localhost:8080/githubcallback'
    },async (accessToken,refreshToken,profile,done)=>{
        try{
            console.log(profile);
            let user = await userModel.findOne({mail:profile._json.email})
            if(!user){
                let newUser = {
                    name:profile._json.name,
                    surname:'',
                    mail:profile._json.email,
                    age:18,
                    password:''
                }
                let result = await userModel.create(newUser);
                done(null,result);
            }
            else{
                done(null,user);
            }
        }catch(error){
            return done(error);
        }
    }))




    passport.use('register', new LocalStrategy(
        {passReqToCallback:true,usernameField:'mail'},async (req,username,password,done) => {
            const {name,surname,mail,age} = req.body;
            try{
                let user = await userModel.findOne({mail:username});
                if(user) {
                    console.log("user already exists");
                    return done(null,false);
                }
                const newUser = {
                    name,
                    surname,
                    mail,
                    age,
                    password:createHash(password)
                }
                let result = await userModel.create(newUser);

                return done(null,result);
            }catch(error){
                return done("Error al obtener el usuario: "+error);
            }
        }))
        passport.serializeUser((user,done)=>{
            done(null, user.id);
        })
        passport.deserializeUser(async (id, done)=>{
            let user = await userModel.findById(id);
            done(null,user);
        })

        passport.use('login',new LocalStrategy({usernameField:'mail'},async(username,password,done)=>{
            try{
                const user = await userModel.findOne({mail:username})
                if (!user){
                    console.log("User doesn't exist")
                    return done(null,false);
                }
                if(!isValidPassword(user,password)) return done(null,false);
                return done(null,user)
            }catch(error){
                return done(error);
            }
        }))
}
export default initializePassport;