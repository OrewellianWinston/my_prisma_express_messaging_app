const {Router} = require("express");
const router = Router();

router.get('/',async(req,res) =>{
    res.render('sign-up')
})

router.post('/',async (req,res) =>{
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

module.exports = router;