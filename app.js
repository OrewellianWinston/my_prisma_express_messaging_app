const express = require('express');
const bcrypt = require('bcryptjs');
const {body, validationResult} = require('express-validator');
const app = express();
const PORT = 3000;
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const prisma = require('./prisma/client.js');

app.use(express.urlencoded({extended: false}));
app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine','ejs');



app.get('/login',(req,res) =>{
    res.render('login');
})
app.post('/login',
    passport.authenticate('local',{
        successRedirect:'/messages',
        failureRedirect:'/login'
    })
);
app.get('/sign-up',async(req,res) =>{
    res.render('sign-up')
})
app.get('/messages',async(req,res) =>{
    res.render('allMessages')
})
app.get('/new-message',async(req,res) =>{
    res.render('newMessage')
})

app.get('/',(req,res) =>{
    res.redirect("/sign-up");
})
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
app.post('/sign-up',async (req,res) =>{
    try{
    const {login,password,firstName,lastName} = req.body;
    console.log(login,password,firstName,lastName);
    const userPassword = await bcrypt.hash(password,10);
    const user = await prisma.user.create({
        data: {
            login:login,
            password: userPassword,
            firstName:firstName,
            lastName:lastName
        }
    })}catch(e){
        console.error(e);
    }
    res.redirect('/login')
})

app.listen(PORT,() =>{
    console.log('Server is up and running on port',PORT)
});