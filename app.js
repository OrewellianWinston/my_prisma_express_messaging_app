const express = require('express');
const app = express();
const PORT = 3000;

const messageRouter = require('./routes/messages.js');
const loginRouter = require('./routes/login.js');
const newMessageRouter = require('./routes/new-message.js');
const signUpRouter = require('./routes/sign-up.js');

app.set('view engine','ejs');

app.use('/messages',messageRouter);
app.use('/login',loginRouter);
app.use('/new-message',newMessageRouter);
app.use('/sign-up',signUpRouter);
app.get('/',(req,res) =>{
    res.redirect("/messages");
})

app.listen(PORT,() =>{
    console.log('Server is up and running on port',PORT)
});