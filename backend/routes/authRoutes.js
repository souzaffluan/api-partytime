const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

//regista usuario
router.post('/register', async(req, res)=>{

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;

    //check dos campos require
    if(name == null || email == null || password == null || confirmpassword == null){
        return res.status(400).json({error: "Por favor preencha todos os campos!"})
    }

    //verificar se as senhas combinam
    if(password != confirmpassword){
        return res.status(400).json({error: "As senhas não conferem"})
    }

    //verificar se o usuário ja existe checando email
    const emailExist = await User.findOne({email: email});

    if(emailExist){
        return res.status(400).json({error: "O email informado já está em uso!"})
    }

    //criador de senha
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
        name: name,
        email: email,
        password: passwordHash
    });

    try{

        const newUser = await user.save();

        //criar token
        const token = jwt.sign(
            //payload
            {
                name: newUser.name,
                id: newUser._id
            },
            "nossosecret"
        );

        //retornar token
        res.json({error: null, msg: "Você realizou o cadastro com sucesso", token:token, userId: newUser._id})

    }catch(error){
        res.status(400).json({error});
    }


});

//login do usuário
router.post('/login', async(req, res)=>{
    const email = req.body.email;
    const password = req.body.password;

    //verificar se o usuário exixte
    const user = await User.findOne({email: email});

    if(!user){
        return res.status(400).json({error: "Usuário não cadastrado com esse email!"})
    }

    //verificar se a senha é a mesma
    const checkPassword = await bcrypt.compare(password, user.password);
    if(!checkPassword){
        return res.status(400).json({error: "Senha inválida!"})
    }

    const token = jwt.sign(
        //payload
        {
            name: user.name,
            id: user._id
        },
        "nossosecret"
    );

    //retornar token
    res.json({error: null, msg: "Você está autenticado", token:token, userId: user._id})
});

module.exports = router;