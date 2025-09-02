const session = require("express-session");
const express = require('express')
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const prisma = require('../prisma/client.js');
const {Router} = require("express");
const router = Router();
router.use(express.urlencoded({extended: false}));
router.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
router.use(passport.initialize());
router.use(passport.session());

passport.use(
    new LocalStrategy(async(username, password, done)=>{
        try {
            const user = await prisma.user.findUnique({
                where: {
                    login:username
                }
            });
            if (!user) {
                return done(null,false,{message: "Incorrect Username"})
            } 
            const match = await bcrypt.compare(password,user.password);
            if (!match){
                return done(null,false, {message: "Incorrect password"})
            }
            return done(null,user)
        }catch(err){
            return done(err);
        }
    })
)
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
        where:{
            id:id
        }
    });
    done (null,user)
  } catch(err) {
    done(err);
  }
});

router.get('/',(req,res) =>{
    res.render('login');
})
router.post('/',
    passport.authenticate('local',{
        successRedirect:'/messages',
        failureRedirect:'/login'
    })
);
module.exports = router;